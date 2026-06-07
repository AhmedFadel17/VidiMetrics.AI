using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.IdentityServer.Data;
using VidiMetrics.IdentityServer.DTOs;
using VidiMetrics.IdentityServer.Events;

namespace VidiMetrics.IdentityServer.Controllers
{
    [ApiController]
    [Route("connect")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _dbContext;
        private readonly IPublishEndpoint _publishEndpoint;

        public AccountController(
            UserManager<ApplicationUser> userManager,

            AppDbContext dbContext,
            IPublishEndpoint publishEndpoint)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _publishEndpoint = publishEndpoint;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var user = new ApplicationUser
                {
                    UserName = dto.Email,
                    Email = dto.Email,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    EmailConfirmed = true

                };

                var result = await _userManager.CreateAsync(user, dto.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "User");

                    await _publishEndpoint.Publish(new UserRegisteredEvent
                    {
                        UserId = user.Id,
                        Email = user.Email,
                        DisplayName = $"{user.FirstName} {user.LastName}",
                        RegisteredAt = DateTime.UtcNow
                    });

                    await _dbContext.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return Ok(new { message = "Registration successful" });
                }
                await transaction.RollbackAsync();

                var errors = MapIdentityErrors(result.Errors);
                return BadRequest(new { errors });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception("An internal error occurred during registration.", ex);
            }
        }

        private Dictionary<string, string[]> MapIdentityErrors(IEnumerable<IdentityError> identityErrors)
        {
            var errors = new Dictionary<string, string[]>();

            foreach (var error in identityErrors)
            {
                var key = error.Code switch
                {
                    var c when c.Contains("Password") => "Password",
                    var c when c.Contains("Email") || c.Contains("UserName") => "Email",
                    _ => "General"
                };

                if (!errors.ContainsKey(key))
                    errors[key] = new[] { error.Description };
                else
                    errors[key] = errors[key].Append(error.Description).ToArray();
            }

            return errors;
        }
    }
}
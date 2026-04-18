using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.IdentityServer.Data;
using VidiMetrics.IdentityServer.DTOs;
using VidiMetrics.IdentityServer.Events;
using MassTransit;

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

            // Start a transaction to ensure both User and Outbox Message are saved together
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var user = new ApplicationUser
                {
                    UserName = dto.Email,
                    Email = dto.Email,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    EmailConfirmed = true // Set to false if you implement email verification later
                };

                var result = await _userManager.CreateAsync(user, dto.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "User");

                    // 1. Stage the event in the Outbox (This doesn't send to RabbitMQ yet)
                    await _publishEndpoint.Publish(new UserRegisteredEvent
                    {
                        UserId = user.Id,
                        Email = user.Email,
                        DisplayName = $"{user.FirstName} {user.LastName}",
                        RegisteredAt = DateTime.UtcNow
                    });

                    // 2. Explicitly SaveChanges to write the Outbox message to the DB
                    await _dbContext.SaveChangesAsync();

                    // 3. Commit the database transaction
                    await transaction.CommitAsync();

                    return Ok(new { message = "Registration successful" });
                }

                // If we reach here, user creation failed. Roll back the transaction.
                await transaction.RollbackAsync();

                // Map Identity errors to our response format
                var errors = MapIdentityErrors(result.Errors);
                return BadRequest(new { errors });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Log exception here (e.g., _logger.LogError...)
                return StatusCode(500, "An internal error occurred during registration.");
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
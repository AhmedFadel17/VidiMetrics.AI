using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VidiMetrics.IdentityServer.Data;
using VidiMetrics.IdentityServer.DTOs;

namespace VidiMetrics.IdentityServer.Controllers
{
    [ApiController]
    [Route("connect")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
                
                return Ok(new { Message = "User registered successfully" });
            }

            var errors = new Dictionary<string, string[]>();
            foreach (var error in result.Errors)
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

            return BadRequest(new { errors });
        }
    }
}

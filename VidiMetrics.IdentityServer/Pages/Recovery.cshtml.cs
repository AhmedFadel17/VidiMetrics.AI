using System.ComponentModel.DataAnnotations;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Caching.Memory;
using VidiMetrics.IdentityServer.Data;

namespace VidiMetrics.IdentityServer.Pages
{
    public class RecoveryModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RecoveryModel> _logger;
        private readonly IEmailSender<ApplicationUser> _emailSender;
        private readonly IMemoryCache _cache;

        public RecoveryModel(
            UserManager<ApplicationUser> userManager, 
            ILogger<RecoveryModel> logger, 
            IEmailSender<ApplicationUser> emailSender,
            IMemoryCache cache)
        {
            _userManager = userManager;
            _logger = logger;
            _emailSender = emailSender;
            _cache = cache;
        }

        [BindProperty]
        public InputModel Input { get; set; } = new();

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;
        }

        public string? SuccessMessage { get; set; }
        public int RemainingSeconds { get; set; }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            // Rate limiting check
            string cacheKey = $"ResetRequest_{Input.Email}";
            if (_cache.TryGetValue(cacheKey, out DateTime lastRequest))
            {
                var timePassed = DateTime.UtcNow - lastRequest;
                if (timePassed < TimeSpan.FromMinutes(2))
                {
                    var waitTime = TimeSpan.FromMinutes(2) - timePassed;
                    RemainingSeconds = (int)waitTime.TotalSeconds;
                    ModelState.AddModelError(string.Empty, $"A recovery sequence was recently transmitted. Please wait {waitTime.Minutes}m {waitTime.Seconds}s before requesting a new one.");
                    return Page();
                }
            }

            var user = await _userManager.FindByEmailAsync(Input.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // Don't reveal that the user does not exist or is not confirmed
                SuccessMessage = "If an account is synchronized with this Terminal ID, a recovery sequence has been transmitted. Please check your data stream.";
                return Page();
            }

            try
            {
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                var callbackUrl = Url.Page(
                    "/ResetPassword",
                    pageHandler: null,
                    values: new { code, email = Input.Email },
                    protocol: Request.Scheme);

                await _emailSender.SendPasswordResetLinkAsync(user, Input.Email, callbackUrl!);
                
                // Set cache entry for rate limiting
                _cache.Set(cacheKey, DateTime.UtcNow, TimeSpan.FromMinutes(2));

                SuccessMessage = "Recovery sequence transmitted successfully. Check your terminal for further instructions.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending password reset email to {Email}", Input.Email);
                ModelState.AddModelError(string.Empty, "The transmission sequence was interrupted. Please check your network connection or contact system administration.");
            }

            return Page();
        }
    }
}

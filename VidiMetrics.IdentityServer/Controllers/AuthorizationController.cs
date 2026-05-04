using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.WebUtilities;
using VidiMetrics.IdentityServer.Data;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace VidiMetrics.IdentityServer.Controllers;

public class AuthorizationController : Controller
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthorizationController(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpGet("~/connect/authorize")]
    [HttpPost("~/connect/authorize")]
    [IgnoreAntiforgeryToken]
    public async Task<IActionResult> Authorize()
    {
        var request = HttpContext.GetOpenIddictServerRequest() ??
            throw new InvalidOperationException("The OpenID Connect request cannot be retrieved.");

        // Handle prompt=register by redirecting to the registration page
        if (request.Prompt == "register")
        {
            // Strip prompt=register from the return URL to avoid infinite loops after registration
            var queryParameters = Request.Query.Where(x => x.Key != "prompt").ToDictionary(x => x.Key, x => x.Value);
            var returnUrl = Microsoft.AspNetCore.WebUtilities.QueryHelpers.AddQueryString(Request.Path, queryParameters!);
            
            return Redirect($"/register?ReturnUrl={Uri.EscapeDataString(returnUrl)}");
        }

        // 1. Check if the user is already signed into the Identity Server
        var result = await HttpContext.AuthenticateAsync(IdentityConstants.ApplicationScheme);

        // 2. If NOT logged in, redirect to your custom /login page
        if (!result.Succeeded)
        {
            var returnUrl = Request.PathBase + Request.Path + Request.QueryString;
            return Redirect($"/login?ReturnUrl={Uri.EscapeDataString(returnUrl)}");
        }

        // 3. Retrieve the user profile
        var user = await _userManager.GetUserAsync(result.Principal) ??
            throw new InvalidOperationException("The user details cannot be retrieved.");

        // 4. Build a fresh ClaimsIdentity for OpenIddict
        var identity = new ClaimsIdentity(
            authenticationType: OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
            nameType: Claims.Name,
            roleType: Claims.Role);

        // 5. Add the mandatory 'sub' claim (user ID) — OpenIddict REQUIRES this
        identity.SetClaim(Claims.Subject, await _userManager.GetUserIdAsync(user))
                .SetClaim(Claims.Email, user.Email)
                .SetClaim(Claims.Name, user.UserName)
                .SetClaims(Claims.Role, [.. (await _userManager.GetRolesAsync(user))]);

        // 6. Set allowed scopes from the authorization request
        identity.SetScopes(request.GetScopes());

        // 7. Build principal first — HasScope() is on ClaimsPrincipal, not ClaimsIdentity
        var principal = new ClaimsPrincipal(identity);

        // 8. Set claim destinations using principal.HasScope()
        principal.SetDestinations(claim => claim.Type switch
        {
            Claims.Name or Claims.Email when principal.HasScope(Scopes.Email)
                => [Destinations.AccessToken, Destinations.IdentityToken],
            Claims.Role when principal.HasScope(Scopes.Roles)
                => [Destinations.AccessToken, Destinations.IdentityToken],
            Claims.Subject
                => [Destinations.AccessToken, Destinations.IdentityToken],
            _ => [Destinations.AccessToken]
        });

        // 9. Complete the OIDC flow and return to React
        return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
    }

    [HttpPost("~/connect/token"), Produces("application/json")]
    public async Task<IActionResult> Exchange()
    {
        var request = HttpContext.GetOpenIddictServerRequest() ??
            throw new InvalidOperationException("The OpenID Connect request cannot be retrieved.");

        if (request.IsAuthorizationCodeGrantType() || request.IsRefreshTokenGrantType())
        {
            // Validate the security principal stored in the code/token
            var authResult = await HttpContext.AuthenticateAsync(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);

            if (authResult.Principal == null)
            {
                return Forbid(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
            }

            return SignIn(authResult.Principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        return BadRequest(new OpenIddictResponse
        {
            Error = Errors.UnsupportedGrantType,
            ErrorDescription = "The specified grant type is not supported."
        });
    }

    [Authorize(AuthenticationSchemes = OpenIddictServerAspNetCoreDefaults.AuthenticationScheme)]
    [HttpGet("~/connect/userinfo"), HttpPost("~/connect/userinfo"), Produces("application/json")]
    public async Task<IActionResult> Userinfo()
    {
        var subject = User.GetClaim(Claims.Subject);
        if (string.IsNullOrEmpty(subject))
        {
             return Challenge(
                authenticationSchemes: OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
                properties: new AuthenticationProperties(new Dictionary<string, string?>
                {
                    [OpenIddictServerAspNetCoreConstants.Properties.Error] = Errors.InvalidToken,
                    [OpenIddictServerAspNetCoreConstants.Properties.ErrorDescription] = "The 'sub' claim is missing from the access token."
                }));
        }

        var user = await _userManager.FindByIdAsync(subject);
        if (user == null)
        {
            // Debug: return the claims to see what's going on
            return BadRequest(new 
            { 
                error = "user_not_found", 
                subject = subject,
                claims = User.Claims.Select(c => new { c.Type, c.Value })
            });
        }

        var claims = new Dictionary<string, object>(StringComparer.Ordinal)
        {
            // Note: the "sub" claim is mandatory and must be the unique identifier of the user.
            [Claims.Subject] = await _userManager.GetUserIdAsync(user)
        };

        if (User.HasScope(Scopes.Email))
        {
            claims[Claims.Email] = user.Email!;
            claims[Claims.EmailVerified] = user.EmailConfirmed;
        }

        if (User.HasScope(Scopes.Profile))
        {
            claims[Claims.Name] = user.UserName!;
            if (!string.IsNullOrEmpty(user.FirstName)) claims[Claims.GivenName] = user.FirstName;
            if (!string.IsNullOrEmpty(user.LastName)) claims[Claims.FamilyName] = user.LastName;
        }

        if (User.HasScope(Scopes.Roles))
        {
            claims[Claims.Role] = await _userManager.GetRolesAsync(user);
        }

        // Note: the UserInfo endpoint must return a JSON response with the claims.
        return Ok(claims);
    }

    [HttpGet("~/connect/logout")]
    [HttpPost("~/connect/logout")]
    public async Task<IActionResult> Logout()
    {
        // 1. Ask OpenIddict to extract the logout request
        var request = HttpContext.GetOpenIddictServerRequest();

    // 2. Sign out of the ASP.NET Identity Cookie
    await _signInManager.SignOutAsync();

    // 3. Return a SignOutResult which tells OpenIddict to 
    // handle the redirect back to the client (React)
    return SignOut(
        authenticationSchemes: OpenIddictServerAspNetCoreDefaults.AuthenticationScheme,
        properties: new AuthenticationProperties
        {
            RedirectUri = "/" // Default fallback
        });
    }
}
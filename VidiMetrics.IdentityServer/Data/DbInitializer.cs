using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;
using VidiMetrics.IdentityServer.Configuration;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace VidiMetrics.IdentityServer.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.EnsureCreatedAsync();

        // 1. Get Services and Configuration
        var manager = scope.ServiceProvider.GetRequiredService<IOpenIddictApplicationManager>();
        var scopeManager = scope.ServiceProvider.GetRequiredService<IOpenIddictScopeManager>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        
        // Pull settings from appsettings.json
        var settings = scope.ServiceProvider
            .GetRequiredService<IOptions<IdentityServerSettings>>().Value;

        // 2. Seed Roles
        var roles = settings.Clients.SelectMany(c => c.Roles).Distinct();
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        // 3. Seed Admin User
        var adminInfo = settings.AdminUser;
        if (!string.IsNullOrEmpty(adminInfo.Email) && await userManager.FindByEmailAsync(adminInfo.Email) == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminInfo.Email,
                Email = adminInfo.Email,
                FirstName = adminInfo.FirstName,
                LastName = adminInfo.LastName,
                EmailConfirmed = true
            };
    
            var result = await userManager.CreateAsync(adminUser, adminInfo.Password);
    
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
            else 
            {
                // Log errors if password requirements aren't met
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to seed admin user: {errors}");
            }
        }

        // 4. Seed Custom Scopes from JSON
        // We look at all clients and ensure every unique scope is registered
        var uniqueScopes = settings.Clients.SelectMany(c => c.Scopes).Distinct();
        foreach (var scopeName in uniqueScopes)
        {
            // Skip OIDC built-in scopes
            if (new[] { "openid", "profile", "email", "roles", "offline_access" }.Contains(scopeName))
                continue;

            if (await scopeManager.FindByNameAsync(scopeName) == null)
            {
                await scopeManager.CreateAsync(new OpenIddictScopeDescriptor
                {
                    Name = scopeName,
                    DisplayName = $"{scopeName.Replace("_", " ")} Access",
                    Resources = { $"{scopeName}_resource" }
                });
            }
        }

        // 5. Seed/Update OpenIddict Clients from JSON
        foreach (var clientConfig in settings.Clients)
        {
            var application = await manager.FindByClientIdAsync(clientConfig.ClientId);
            
            var descriptor = new OpenIddictApplicationDescriptor
            {
                ClientId = clientConfig.ClientId,
                DisplayName = clientConfig.DisplayName,
                ClientType = ClientTypes.Public,
                RedirectUris = { new Uri($"{clientConfig.BaseUrl}/callback") },
                PostLogoutRedirectUris = { new Uri(clientConfig.BaseUrl) },
                Permissions =
                {
                    Permissions.Endpoints.Authorization,
                    Permissions.Endpoints.EndSession,
                    Permissions.Endpoints.Token,
                    Permissions.GrantTypes.AuthorizationCode,
                    Permissions.GrantTypes.RefreshToken,
                    Permissions.ResponseTypes.Code
                },
                Requirements = { Requirements.Features.ProofKeyForCodeExchange }
            };

            // Add Scopes from JSON
            foreach (var s in clientConfig.Scopes)
            {
                descriptor.Permissions.Add(Permissions.Prefixes.Scope + s);
            }

            if (application == null)
            {
                await manager.CreateAsync(descriptor);
            }
            else
            {
                // Update existing client to match JSON (Sync URIs and Permissions)
                await manager.UpdateAsync(application, descriptor);
            }
        }
    }
}
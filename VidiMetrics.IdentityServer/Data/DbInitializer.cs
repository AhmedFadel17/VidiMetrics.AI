using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;
using VidiMetrics.IdentityServer.Configuration;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace VidiMetrics.IdentityServer.Data;

public static class DbInitializer
{
    private static readonly string[] StandardScopes = [
        Scopes.OpenId,
        Scopes.Profile,
        Scopes.Email,
        Scopes.Roles,
        Scopes.OfflineAccess
    ];

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var services = scope.ServiceProvider;

        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.EnsureCreatedAsync();

        var settings = services.GetRequiredService<IOptions<ConfigSettings>>().Value;
        var adminSettings = services.GetRequiredService<IOptions<AdminUserSettings>>().Value;

        await SeedRolesAsync(services, settings);
        await SeedAdminUserAsync(services, adminSettings);
        await SeedScopesAsync(services, settings);
        await SeedClientsAsync(services, settings);
    }

    private static async Task SeedRolesAsync(IServiceProvider services, ConfigSettings settings)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        var roles = settings.Clients
            .SelectMany(c => c.Roles ?? [])
            .Append("Admin")
            .Distinct(StringComparer.OrdinalIgnoreCase);

        foreach (var roleName in roles)
        {
            if (!string.IsNullOrWhiteSpace(roleName) && !await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }

    private static async Task SeedAdminUserAsync(IServiceProvider services, AdminUserSettings? adminSettings)
    {
        if (adminSettings == null || string.IsNullOrWhiteSpace(adminSettings.Email)) return;

        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var existingUser = await userManager.FindByEmailAsync(adminSettings.Email);

        if (existingUser != null) return;

        var adminUser = new ApplicationUser
        {
            UserName = adminSettings.Email,
            Email = adminSettings.Email,
            FirstName = adminSettings.FirstName,
            LastName = adminSettings.LastName,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(adminUser, adminSettings.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to seed admin user: {errors}");
        }

        await userManager.AddToRoleAsync(adminUser, "Admin");
    }

    private static async Task SeedScopesAsync(IServiceProvider services, ConfigSettings settings)
    {
        var scopeManager = services.GetRequiredService<IOpenIddictScopeManager>();

        var customScopes = settings.Clients
            .SelectMany(c => c.Scopes ?? [])
            .Distinct(StringComparer.OrdinalIgnoreCase);

        foreach (var scopeName in customScopes)
        {
            if (string.IsNullOrWhiteSpace(scopeName) || StandardScopes.Contains(scopeName, StringComparer.OrdinalIgnoreCase))
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
    }

    private static async Task SeedClientsAsync(IServiceProvider services, ConfigSettings settings)
    {
        var manager = services.GetRequiredService<IOpenIddictApplicationManager>();

        foreach (var clientConfig in settings.Clients)
        {
            if (string.IsNullOrWhiteSpace(clientConfig.ClientId)) continue;

            var application = await manager.FindByClientIdAsync(clientConfig.ClientId);

            var descriptor = new OpenIddictApplicationDescriptor
            {
                ClientId = clientConfig.ClientId,
                DisplayName = clientConfig.DisplayName,
                ClientType = ClientTypes.Public,
                RedirectUris = { new Uri($"{clientConfig.BaseUrl.TrimPostFix("/")}/callback") },
                PostLogoutRedirectUris = { new Uri(clientConfig.BaseUrl.TrimPostFix("/")) },
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

            if (clientConfig.Scopes != null)
            {
                foreach (var scope in clientConfig.Scopes)
                {
                    descriptor.Permissions.Add(Permissions.Prefixes.Scope + scope);
                }
            }

            if (application == null)
            {
                await manager.CreateAsync(descriptor);
            }
            else
            {
                await manager.UpdateAsync(application, descriptor);
            }
        }
    }

    private static string TrimPostFix(this string value, string postfix)
    {
        if (value.EndsWith(postfix))
            return value.Substring(0, value.Length - postfix.Length);
        return value;
    }
}
using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.IdentityServer.Configuration;
using VidiMetrics.IdentityServer.Data;
using VidiMetrics.IdentityServer.Services;

using static OpenIddict.Abstractions.OpenIddictConstants;

var builder = WebApplication.CreateBuilder(args);

var configSettingsSection = builder.Configuration.GetSection("ConfigSettings");
builder.Services.Configure<ConfigSettings>(configSettingsSection);
var configSettings = configSettingsSection.Get<ConfigSettings>()
    ?? throw new InvalidOperationException("ConfigSettings section is missing or invalid in configuration.");

builder.Services.Configure<AdminUserSettings>(builder.Configuration.GetSection("AdminUserSettings"));
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

builder.Services.AddControllers();
builder.Services.AddRazorPages();
builder.Services.AddMemoryCache();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        foreach (var client in configSettings.Clients)
        {
            policy.WithOrigins(client.BaseUrl)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.UseOpenIddict();
});

builder.Services.AddTransient<IEmailSender<ApplicationUser>, EmailSender>();

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddOpenIddict()
    .AddCore(options =>
    {
        options.UseEntityFrameworkCore().UseDbContext<AppDbContext>();
    })
    .AddServer(options =>
    {
        options.SetTokenEndpointUris(configSettings.Endpoints.Token)
               .SetAuthorizationEndpointUris(configSettings.Endpoints.Authorization)
               .SetEndSessionEndpointUris(configSettings.Endpoints.Logout)
               .SetUserInfoEndpointUris(configSettings.Endpoints.UserInfo);

        options.AllowAuthorizationCodeFlow().AllowRefreshTokenFlow();
        options.RegisterScopes(Scopes.OpenId, Scopes.Email, Scopes.Profile, Scopes.Roles, Scopes.OfflineAccess);
        options.RegisterPromptValues("register");

        if (configSettings.Clients != null)
        {
            foreach (var client in configSettings.Clients)
            {
                if (client.Scopes == null) continue;
                foreach (var scope in client.Scopes)
                {
                    options.RegisterScopes(scope);
                }
            }
        }

        options.DisableAccessTokenEncryption();

        options.AddDevelopmentEncryptionCertificate()
               .AddDevelopmentSigningCertificate();

        options.UseAspNetCore()
               .EnableTokenEndpointPassthrough()
               .EnableAuthorizationEndpointPassthrough()
               .EnableEndSessionEndpointPassthrough()
               .EnableUserInfoEndpointPassthrough()
               .DisableTransportSecurityRequirement();
    })
    .AddValidation(options =>
    {
        options.UseLocalServer();
        options.UseAspNetCore();
    });

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = configSettings.Endpoints.Login;
    options.LogoutPath = configSettings.Endpoints.Logout;
    options.AccessDeniedPath = configSettings.Endpoints.AccessDenied;
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});

builder.Services.AddMassTransit(x =>
{
    x.AddEntityFrameworkOutbox<AppDbContext>(o =>
    {
        o.UseSqlServer();
        o.UseBusOutbox();
    });

    x.UsingRabbitMq((context, cfg) =>
    {
        var rabbitHost = builder.Configuration["RabbitMQ:Host"] ?? "localhost";
        cfg.Host(rabbitHost, "/");
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    await DbInitializer.SeedAsync(scope.ServiceProvider);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();

app.Run();
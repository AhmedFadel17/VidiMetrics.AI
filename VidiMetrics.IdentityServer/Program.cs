using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.IdentityServer.Configuration;
using VidiMetrics.IdentityServer.Data;
using VidiMetrics.IdentityServer.Services;

using static OpenIddict.Abstractions.OpenIddictConstants;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<IdentityServerSettings>(
    builder.Configuration.GetSection("IdentityServer"));

var identitySettings = builder.Configuration.GetSection("IdentityServer").Get<IdentityServerSettings>()

                      ?? new IdentityServerSettings();
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddControllers();
builder.Services.AddRazorPages();
builder.Services.AddMemoryCache();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var firstClientUrl = identitySettings.Clients.FirstOrDefault()?.BaseUrl ?? "http://localhost:5173";
        policy.WithOrigins(firstClientUrl)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.UseOpenIddict();
});

builder.Services.AddScoped<IEmailSender<ApplicationUser>, EmailSender>();

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 8;
    options.SignIn.RequireConfirmedEmail = true;
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
        // Using JSON-defined endpoints
        options.SetTokenEndpointUris(identitySettings.Endpoints.Token)
               .SetAuthorizationEndpointUris(identitySettings.Endpoints.Authorization)
               .SetEndSessionEndpointUris(identitySettings.Endpoints.Logout)
               .SetUserInfoEndpointUris(identitySettings.Endpoints.UserInfo);

        options.AllowAuthorizationCodeFlow().AllowRefreshTokenFlow();

        // Register default scopes + any custom ones from your JSON clients
        options.RegisterScopes(Scopes.OpenId, Scopes.Email, Scopes.Profile, Scopes.Roles, Scopes.OfflineAccess);

        // Allow 'register' prompt for registration flow
        options.RegisterPromptValues("register");


        foreach (var client in identitySettings.Clients)
        {
            foreach (var scope in client.Scopes)
            {
                options.RegisterScopes(scope);
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
    // Using the Login path from JSON
    options.LoginPath = identitySettings.Endpoints.Login;

    options.LogoutPath = identitySettings.Endpoints.Logout;
    options.AccessDeniedPath = identitySettings.Endpoints.AccessDenied;
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});
builder.Services.AddTransient<IEmailSender<ApplicationUser>, EmailSender>();
builder.Services.AddMassTransit(x =>
{
    x.AddEntityFrameworkOutbox<AppDbContext>(o =>
    {
        o.UseSqlServer();
        o.UseBusOutbox();

    });

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/");
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

await DbInitializer.SeedAsync(app.Services);

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
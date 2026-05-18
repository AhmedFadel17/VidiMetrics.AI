using System.IdentityModel.Tokens.Jwt;
using MassTransit;
using OpenIddict.Validation.AspNetCore;
using VidiMetrics.API.Consumers;
using VidiMetrics.API.Extensions;
using VidiMetrics.API.Filters;
using VidiMetrics.API.Middlwares;
using VidiMetrics.Application;
using VidiMetrics.DataAccess;
using VidiMetrics.Domain.Settings;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
await builder.Services.AddDataAccessServices(builder.Configuration);
await builder.Services.AddApplicationServices();

builder.Services.AddControllers(options =>
{
    // Global filters or configuration can go here
});
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<UserRequirementFilter>();
// CORS – allow the Vite dev server
builder.Services.AddCors(options =>
{
    var frontendSettings = builder.Configuration.GetSection("FrontendSettings").Get<FrontendSettings>();

    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(frontendSettings?.BaseUrl ?? "")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
// Configure Authentication using OpenIddict Validation
builder.Services.AddOpenIddict()
    .AddValidation(options =>
    {

        var identitySettings = builder.Configuration.GetJsonSection<IdentityServerSettings>("IdentityServerSettings");
        options.SetIssuer(identitySettings.BaseUrl);
        options.UseSystemNetHttp();
        options.UseAspNetCore();
    });

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
});
builder.Services.Configure<PollinationsApiSettings>(builder.Configuration.GetSection("PollinationsApiSettings"));
builder.Services.Configure<CloudinaryApiSettings>(builder.Configuration.GetSection("CloudinaryApiSettings"));
builder.Services.Configure<SubscriptionSettings>(builder.Configuration.GetSection("SubscriptionSettings"));
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<UserRegisteredConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/");
        cfg.ReceiveEndpoint("user-registration-queue", e =>
        {
            e.ConfigureConsumer<UserRegisteredConsumer>(context);
        });
    });
});
var app = builder.Build();

// Run DB Auto-Seed / Migration
await VidiMetrics.DataAccess.Data.DbInitializer.SeedAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseMiddleware<ExceptionHandlerMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

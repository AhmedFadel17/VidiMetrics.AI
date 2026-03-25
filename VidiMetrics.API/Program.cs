using VidiMetrics.DataAccess;
using VidiMetrics.Application;
using VidiMetrics.API.Middlwares;
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseMiddleware<ExceptionHandlerMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();

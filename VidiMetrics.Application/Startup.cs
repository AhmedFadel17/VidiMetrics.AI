using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.Application.Services.Core;
using VidiMetrics.Application.Validators.Core.Videos;
namespace VidiMetrics.Application
{
    public static class Startup
    {
        public static Task<IServiceCollection> AddApplicationServices(this IServiceCollection services)
        {
            // AutoMapper Registration
            services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());

            // Automatic Validator Registration
            services.AddValidatorsFromAssemblyContaining<CreateVideoValidator>();
            services.AddValidatorsFromAssemblyContaining<UpdateVideoValidator>();

            // Service Registration
            services.AddScoped<IVideosService, VideosService>();

            return Task.FromResult(services);
        }
    }
}

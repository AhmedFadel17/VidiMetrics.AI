using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Core.Videos;
using VidiMetrics.Application.Interfaces.Core;

namespace VidiMetrics.API.Controllers.Core
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly IVideosService _service;
        public VideosController(IVideosService service)
        {
            _service=service;
        }

    }
}

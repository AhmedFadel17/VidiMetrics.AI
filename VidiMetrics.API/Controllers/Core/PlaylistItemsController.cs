using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Core.PlaylistItems;
using VidiMetrics.Application.Interfaces.Core;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.API.Controllers.Core
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistItemsController : ControllerBase
    {
        private readonly IPlaylistItemsService _service;

        public PlaylistItemsController(IPlaylistItemsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<PlaylistItemResponseDto>>>> GetAll()
        {
            var results = await _service.GetAllAsync();
            return Ok(ApiResponseFactory.Success(results, "PlaylistItems retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<PlaylistItemResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(ApiResponseFactory.Success(result, "PlaylistItem retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<PlaylistItemResponseDto>>> Create([FromBody] CreatePlaylistItemDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "PlaylistItem created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<PlaylistItemResponseDto>>> Update(Guid id, [FromBody] UpdatePlaylistItemDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(ApiResponseFactory.Success(result, "PlaylistItem updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return Ok(ApiResponseFactory.Success<object?>(null, "PlaylistItem deleted successfully."));
        }
    }
}

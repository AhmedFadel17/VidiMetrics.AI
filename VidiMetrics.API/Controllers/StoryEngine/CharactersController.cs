using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.StoryEngine.Characters;
using VidiMetrics.Application.Interfaces.StoryEngine;

namespace VidiMetrics.API.Controllers.StoryEngine
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CharactersController : ApiBaseController
    {
        private readonly ICharactersService _service;

        public CharactersController(ICharactersService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<PaginationResponseDto<CharacterResponseDto>>>> GetAll([FromQuery] CharacterFilterDto filter)
        {
            var results = await _service.GetAllAsync(filter, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(results, "Characters retrieved successfully."));
        }

        [HttpGet("lookup")]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<LookupDto>>>> GetLookup([FromQuery] Guid? showId)
        {
            var results = await _service.GetLookupAsync(CurrentUserGuid, showId);
            return Ok(ApiResponseFactory.Success(results, "Character lookup retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SuccessResponseDto<CharacterResponseDto>>> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Character retrieved successfully."));
        }

        [HttpPost]
        public async Task<ActionResult<SuccessResponseDto<CharacterResponseDto>>> Create([FromBody] CreateCharacterDto dto)
        {
            var result = await _service.CreateAsync(dto, CurrentUserGuid);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponseFactory.Success(result, "Character created successfully.", 201));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SuccessResponseDto<CharacterResponseDto>>> Update(Guid id, [FromBody] UpdateCharacterDto dto)
        {
            var result = await _service.UpdateAsync(id, dto, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Character updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto>> Delete(Guid id)
        {
            await _service.DeleteAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success<object?>(null, "Character deleted successfully."));
        }
    }
}

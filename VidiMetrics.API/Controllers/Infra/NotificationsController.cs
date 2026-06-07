using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VidiMetrics.API.Factories;
using VidiMetrics.Application.DTOs.Common;
using VidiMetrics.Application.DTOs.Infra.Notifications;
using VidiMetrics.Application.Interfaces.Infra;

namespace VidiMetrics.API.Controllers.Infra
{
    [Route("api/notifications")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ApiBaseController
    {
        private readonly INotificationsService _service;

        public NotificationsController(INotificationsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<SuccessResponseDto<IEnumerable<NotificationResponseDto>>>> GetMyNotifications()
        {
            var results = await _service.GetUserNotificationsAsync(CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(results, "Notifications retrieved successfully."));
        }

        [HttpPut("{id}/read")]
        public async Task<ActionResult<SuccessResponseDto<NotificationResponseDto>>> MarkAsRead(Guid id)
        {
            var result = await _service.MarkAsReadAsync(id, CurrentUserGuid);
            return Ok(ApiResponseFactory.Success(result, "Notification marked as read."));
        }

        [HttpPut("read-all")]
        public async Task<ActionResult<ApiResponseDto>> MarkAllAsRead()
        {
            await _service.MarkAllAsReadAsync(CurrentUserGuid);
            return Ok(ApiResponseFactory.Success<object?>(null, "All notifications marked as read."));
        }

    }
}

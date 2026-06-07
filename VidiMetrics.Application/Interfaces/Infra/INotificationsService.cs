using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VidiMetrics.Application.DTOs.Infra.Notifications;

namespace VidiMetrics.Application.Interfaces.Infra;

public interface INotificationsService
{
    Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(Guid userId);
    Task<NotificationResponseDto> MarkAsReadAsync(Guid notificationId, Guid userId);
    Task MarkAllAsReadAsync(Guid userId);
}

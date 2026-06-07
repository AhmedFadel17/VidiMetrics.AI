using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using VidiMetrics.Application.Hubs;
using VidiMetrics.DataAccess.Repositories;
using VidiMetrics.Domain.Enums;
using VidiMetrics.Domain.Models.Infra;


namespace VidiMetrics.Application.Providers.NotificationsProviders;

public class NotificationProvider : INotificationProvider
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IBaseRepository<Notification> _notificationRepository;

    public NotificationProvider(
        IHubContext<NotificationHub> hubContext,
        IBaseRepository<Notification> notificationRepository)
    {
        _hubContext = hubContext;
        _notificationRepository = notificationRepository;
    }

    public async Task SendInAppNotificationAsync(
        Guid? userId,
        string title,
        string message,
        NotificationType type,
        bool notifyAdmins = false,
        string? adminCustomMessage = null)
    {

        if (userId.HasValue)
        {
            await SaveAndSendAsync(userId.Value, title, message, type);
        }

        if (notifyAdmins)
        {
            string adminTitle = $"[Admin Alert] {title}";
            string adminMessage = adminCustomMessage ?? $"System Alert regarding User {userId}: {message}";
            await SaveAndSendAsync(null, adminTitle, adminMessage, NotificationType.Info, "AdminGroup");
        }
    }
    private async Task SaveAndSendAsync(
    Guid? userId,
    string title,
    string message,
    NotificationType type,
    string? targetGroup = null)
    {
        var notification = new Notification
        {
            Title = title,
            Message = message,
            Type = type,
            UserId = userId,
        };

        await _notificationRepository.AddAsync(notification);
        await _notificationRepository.SaveChangesAsync();

        var payload = new
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = nameof(type),
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };

        if (userId.HasValue)
        {
            await _hubContext.Clients.User(userId.Value.ToString()).SendAsync("ReceiveNotification", payload);
        }
        else
        {
            await _hubContext.Clients.Group("AdminGroup").SendAsync("ReceiveNotification", payload);
        }
    }

    public async Task SendEmailNotificationAsync(string recipientEmail, string subject, string bodyHtml)
    {
        await Task.CompletedTask;
    }
}
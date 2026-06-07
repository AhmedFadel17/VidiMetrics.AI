using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.Providers.NotificationsProviders;

public interface INotificationProvider
{
    Task SendInAppNotificationAsync(
        Guid? userId,
        string title,
        string message,
        NotificationType type,
        bool notifyAdmins = false,
        string? adminCustomMessage = null);



    Task SendEmailNotificationAsync(
        string recipientEmail,

        string subject,

        string bodyHtml);
}

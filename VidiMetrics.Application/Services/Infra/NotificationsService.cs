using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VidiMetrics.Application.DTOs.Infra.Notifications;
using VidiMetrics.Application.Interfaces.Infra;
using VidiMetrics.DataAccess.Repositories.Infra.Notifications;

namespace VidiMetrics.Application.Services.Infra;

public class NotificationsService : INotificationsService
{
    private readonly INotificationsRepository _repository;
    private readonly IMapper _mapper;

    public NotificationsService(INotificationsRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(Guid userId)
    {
        var notifications = await _repository.Query()
            .Where(n => n.UserId == userId && !n.IsDeleted)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync();

        return _mapper.Map<IEnumerable<NotificationResponseDto>>(notifications);
    }

    public async Task<NotificationResponseDto> MarkAsReadAsync(Guid notificationId, Guid userId)
    {
        var notification = await _repository.GetByIdAsync(notificationId)
            ?? throw new Exception("Notification not found.");

        if (notification.UserId != userId)
            throw new UnauthorizedAccessException("You do not have access to this notification.");

        notification.MarkAsRead();
        _repository.Update(notification);
        await _repository.SaveChangesAsync();

        return _mapper.Map<NotificationResponseDto>(notification);
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        var unread = await _repository.Query()
            .Where(n => n.UserId == userId && !n.IsRead && !n.IsDeleted)
            .ToListAsync();

        foreach (var notification in unread)
        {
            notification.MarkAsRead();
            _repository.Update(notification);
        }

        await _repository.SaveChangesAsync();
    }
}

using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using VidiMetrics.IdentityServer.Configuration;
using VidiMetrics.IdentityServer.Data;

namespace VidiMetrics.IdentityServer.Services;

public class EmailSender : IEmailSender<ApplicationUser>
{
    private readonly SmtpSettings _smtpSettings;

    public EmailSender(IOptions<SmtpSettings> smtpSettings)
    {
        _smtpSettings = smtpSettings.Value;
    }
    public async Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink)
    {
        string subject = "Confirm your email";
        string message = $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.";
        await SendEmailAsync(email, subject, message);
    }

    public async Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
    {
        string subject = "Reset your password";
        string message = $"Please reset your password by <a href='{resetLink}'>clicking here</a>.";
        await SendEmailAsync(email, subject, message);
    }

    public async Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
    {
        string subject = "Reset code";
        string message = $"Your reset code is: {resetCode}";
        await SendEmailAsync(email, subject, message);
    }

    private async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        using (var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port))
        {
            client.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);
            client.EnableSsl = true;

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.FromEmail, "VidiMetrics Support"),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);
            await client.SendMailAsync(mailMessage);
        }
    }
}

using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CMS.Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, IWebHostEnvironment env, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _env = env;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // Always log the email locally for testing/verification
            await LogEmailToFileAsync(toEmail, subject, body);

            var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
            var portStr = _configuration["EmailSettings:Port"] ?? "587";
            var senderName = _configuration["EmailSettings:SenderName"] ?? "TrieuCMS Store";
            var senderEmail = _configuration["EmailSettings:SenderEmail"] ?? "noreply.trieucms@gmail.com";
            var username = _configuration["EmailSettings:Username"] ?? "";
            var password = _configuration["EmailSettings:Password"] ?? "";
            if (!string.IsNullOrEmpty(password))
            {
                password = password.Replace(" ", "");
            }
            var enableSslStr = _configuration["EmailSettings:EnableSSL"] ?? "true";

            int.TryParse(portStr, out int port);
            bool.TryParse(enableSslStr, out bool enableSsl);

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                _logger.LogWarning("SMTP credentials not configured. Email logged to file system only.");
                return;
            }

            try
            {
                using (var client = new SmtpClient(smtpServer, port))
                {
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(username, password);
                    client.EnableSsl = enableSsl;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(senderEmail, senderName),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };

                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation($"Successfully sent email to {toEmail} via SMTP.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail} via SMTP. Email was logged to files.");
            }
        }

        private async Task LogEmailToFileAsync(string toEmail, string subject, string body)
        {
            try
            {
                var folderPath = Path.Combine(_env.WebRootPath, "sent_emails");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var fileName = $"{DateTime.Now:yyyyMMdd_HHmmss}_{Guid.NewGuid().ToString().Substring(0, 5)}.html";
                var filePath = Path.Combine(folderPath, fileName);

                var htmlContent = $@"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <title>{HtmlEncode(subject)}</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #2563eb; color: white; padding: 15px; border-radius: 8px 8px 0 0; }}
        .meta {{ background-color: #f1f5f9; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 0.85em; }}
        .content {{ padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }}
    </style>
</head>
<body>
    <div class='header'>
        <h2 style='margin:0;'>Thư điện tử giả lập (Email Log)</h2>
    </div>
    <div class='meta'>
        <strong>Tới:</strong> {HtmlEncode(toEmail)}<br/>
        <strong>Tiêu đề:</strong> {HtmlEncode(subject)}<br/>
        <strong>Thời gian:</strong> {DateTime.Now:dd/MM/yyyy HH:mm:ss}
    </div>
    <div class='content'>
        {body}
    </div>
</body>
</html>";

                await File.WriteAllTextAsync(filePath, htmlContent);
                _logger.LogInformation($"Saved mock email to: {filePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to write email log file.");
            }
        }

        private string HtmlEncode(string text)
        {
            return WebUtility.HtmlEncode(text);
        }
    }
}

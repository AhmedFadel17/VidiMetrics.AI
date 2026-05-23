namespace VidiMetrics.Domain.Settings;

public class ApisSettings
{
    public ApiSettings YouTube { get; set; } = new();
    public ApiSettings TikTok { get; set; } = new();
    public ApiSettings Pollinations { get; set; } = new();
    public ApiSettings Cloudinary { get; set; } = new();
}

public class ApiSettings
{
    public string Name { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string AuthUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
}
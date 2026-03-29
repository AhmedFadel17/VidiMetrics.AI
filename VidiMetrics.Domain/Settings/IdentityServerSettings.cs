namespace VidiMetrics.Domain.Settings;

public class IdentityServerSettings
{
    public string BaseUrl { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string Authority => $"{BaseUrl}/";
    public string TokenEndpoint => $"{Authority}connect/token";
    public string AuthorizationEndpoint => $"{Authority}connect/authorize";
    public string UserInfoEndpoint => $"{Authority}connect/userinfo";
    public string JwksUri => $"{Authority}discovery/v2/keys";
}

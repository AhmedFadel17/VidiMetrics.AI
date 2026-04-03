namespace VidiMetrics.IdentityServer.Configuration;

public class ClientSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public List<string> Scopes { get; set; } = new();
    public List<string> AllowedCorsOrigins { get; set; } = new();
    public List<string> Roles { get; set; } = new();
}

namespace VidiMetrics.IdentityServer.Configuration;

public class EndpointSettings
{
    public string Authorization { get; set; } = string.Empty;
    public string Login { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string UserInfo { get; set; } = string.Empty;
    public string Logout { get; set; } = string.Empty;
    public string Introspection { get; set; } = string.Empty;
    public string Revocation { get; set; } = string.Empty;
    public string AccessDenied { get; set; } = string.Empty;
}

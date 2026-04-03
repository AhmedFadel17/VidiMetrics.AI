namespace VidiMetrics.IdentityServer.Configuration;

public class IdentityServerSettings
{
    public List<ClientSettings> Clients { get; set; } = new();
    public EndpointSettings Endpoints { get; set; } = new();
    public AdminUserSettings AdminUser { get; set; } = new();
}






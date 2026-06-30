namespace VidiMetrics.IdentityServer.Configuration;

public class ConfigSettings
{
    public List<ClientSettings> Clients { get; set; } = new();
    public EndpointSettings Endpoints { get; set; } = new();
    public string ApiBaseUrl { get; set; } = String.Empty;
}






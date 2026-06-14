namespace VidiMetrics.Application.DTOs.Copilot;

public record CopilotIntentParseResult
{
    public bool IsValid { get; set; }
    public CopilotAiDecisionDto Decision { get; set; } = new();
    public string? RawResponse { get; set; }
    public List<string> ParseErrors { get; set; } = new();
}

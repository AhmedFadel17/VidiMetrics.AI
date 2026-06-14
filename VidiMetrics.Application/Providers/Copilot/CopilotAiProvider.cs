using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using VidiMetrics.Application.DTOs.Copilot;
using VidiMetrics.Application.Interfaces.Copilot;
using VidiMetrics.Domain.Enums.Copilot;
using VidiMetrics.Domain.Models.Copilot;

namespace VidiMetrics.Application.Providers.Copilot;

public class CopilotAiProvider : ICopilotAiProvider
{
    private readonly HttpClient _httpClient;
    private readonly ICopilotPromptBuilder _promptBuilder;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    public CopilotAiProvider(HttpClient httpClient, ICopilotPromptBuilder promptBuilder)
    {
        _httpClient = httpClient;
        _promptBuilder = promptBuilder;
    }

    public async Task<CopilotAiDecisionDto> GetDecisionAsync(
        List<CopilotMessage> messages,
        CancellationToken ct = default)
    {
        var mappedMessages = new List<object>
        {
            new
            {
                role = "system",
                content = _promptBuilder.BuildSystemPrompt()
            }
        };

        foreach (var msg in messages.OrderBy(x => x.CreatedAt))
        {
            if (msg.Role == CopilotMessageRole.User)
            {
                mappedMessages.Add(new
                {
                    role = "user",
                    content = msg.Content
                });
            }
            else if (msg.Role == CopilotMessageRole.Assistant)
            {
                mappedMessages.Add(new
                {
                    role = "assistant",
                    content = msg.Content
                });
            }
        }

        var requestBody = new
        {
            model = "openai",
            messages = mappedMessages,
            temperature = 0.1
        };

        var json = JsonSerializer.Serialize(requestBody);
        using var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var response = await _httpClient.PostAsync("/v1/chat/completions", content, ct);
        var responseText = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Pollinations error: {(int)response.StatusCode} {response.ReasonPhrase} - {responseText}");

        using var doc = JsonDocument.Parse(responseText);

        var aiText = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(aiText))
            return Fallback("The assistant returned an empty response.");

        try
        {
            var cleaned = ExtractJson(aiText);
            var result = JsonSerializer.Deserialize<CopilotAiDecisionDto>(cleaned, JsonOptions);

            if (result == null)
                return Fallback("The assistant returned invalid structured output.");

            result.Answer ??= string.Empty;
            result.Summary ??= string.Empty;
            result.MissingFields ??= new List<string>();
            result.ValidationWarnings ??= new List<string>();

            return result;
        }
        catch
        {
            return Fallback("I could not prepare a valid dashboard response. Please rephrase using dashboard entities and fields.");
        }
    }

    private static string ExtractJson(string content)
    {
        var trimmed = content.Trim();

        if (!trimmed.StartsWith("```"))
            return trimmed;

        var firstBrace = trimmed.IndexOf('{');
        var lastBrace = trimmed.LastIndexOf('}');

        if (firstBrace >= 0 && lastBrace > firstBrace)
            return trimmed.Substring(firstBrace, lastBrace - firstBrace + 1);

        return trimmed;
    }

    private static CopilotAiDecisionDto Fallback(string answer)
    {
        return new CopilotAiDecisionDto
        {
            Mode = CopilotResponseMode.Chat,
            Action = CopilotActionType.Chat,
            Entity = CopilotEntityType.Unknown,
            Answer = answer,
            Summary = string.Empty,
            Payload = null,
            MissingFields = new List<string>(),
            ValidationWarnings = new List<string>()
        };
    }
}
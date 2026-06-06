namespace VidiMetrics.Application.DTOs.Ai.AiImages;

public record CreateCharacterImageDto
{

    public required string Name { get; set; }

    public required string PhysicalDescription { get; set; }

    public required string ClothingStyle { get; set; }

    public required string PersonalityTraits { get; set; }

    public required string Role { get; set; }

}

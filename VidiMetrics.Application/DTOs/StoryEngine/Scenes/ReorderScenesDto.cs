using System;
using System.Collections.Generic;

namespace VidiMetrics.Application.DTOs.StoryEngine.Scenes;

public class ReorderScenesDto
{
    public List<Guid> SceneIds { get; set; } = new();
}

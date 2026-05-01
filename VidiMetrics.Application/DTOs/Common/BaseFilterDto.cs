using Microsoft.Data.SqlClient;

namespace VidiMetrics.Application.DTOs.Common;

public class BaseFilterDto
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string? OrderBy { get; set; }
    public string? SortOrder { get; set; }
}

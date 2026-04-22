using VidiMetrics.Application.DTOs.Common;

namespace VidiMetrics.Application.Helpers;

public static class PaginationHelper
{
    public static PaginationResponseDto<T> CreatePagedResult<T>(
        List<T> items,
        int pageNumber,
        int pageSize,
        int totalCount)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PaginationResponseDto<T>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages,
            TotalCount = totalCount
        };
    }
}

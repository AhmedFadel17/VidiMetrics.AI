using System.Linq.Dynamic.Core;

namespace VidiMetrics.DataAccess.Extensions;


public static class QueryableExtensions
{
    public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, string? orderBy, string? sortOrder)
    {
        if (string.IsNullOrWhiteSpace(orderBy))
            return query;

        var isDescending = !string.IsNullOrWhiteSpace(sortOrder) &&
                           (sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase) ||
                            sortOrder.Equals("descending", StringComparison.OrdinalIgnoreCase));

        string command = isDescending ? $"{orderBy} descending" : orderBy;

        try
        {
            return query.OrderBy(command);
        }
        catch (Exception)
        {
            return query;
        }
    }
    public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> query, int page, int pageSize)
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }
}
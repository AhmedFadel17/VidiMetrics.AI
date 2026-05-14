using System;

namespace VidiMetrics.Application.DTOs.Common
{
    public class LookupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
    }
}

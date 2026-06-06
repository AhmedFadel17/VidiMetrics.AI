using System;
using VidiMetrics.Domain.Enums;

namespace VidiMetrics.Application.DTOs.Infra.CreditTransactionLedgers
{
    public record CreditTransactionLedgerResponseDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public CreditActionType ActionType { get; set; }
        public int AmountDeducted { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}

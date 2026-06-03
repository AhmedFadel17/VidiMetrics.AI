using System;

namespace VidiMetrics.Application.DTOs.Infra.UserCreditWallets
{
    public class UserCreditWalletResponseDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public int TotalCreditsAvailable { get; set; }
        public int CreditsUsed { get; set; }
        public int RemainingCredits { get; set; }
        public DateTime LastResetDate { get; set; }
        public DateTime NextResetDate { get; set; }
    }
}

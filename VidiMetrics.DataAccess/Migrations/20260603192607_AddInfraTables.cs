using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddInfraTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApiUsageQuotas");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "UserSubscriptions",
                newName: "CancelledAt");

            migrationBuilder.RenameColumn(
                name: "DailyApiQuotaLimit",
                table: "SubscriptionPlans",
                newName: "BaseMonthlyCredits");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "UserSubscriptions",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AddColumn<DateTime>(
                name: "CurrentPeriodEnd",
                table: "UserSubscriptions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CurrentPeriodStart",
                table: "UserSubscriptions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "StripeSubscriptionId",
                table: "UserSubscriptions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StripePriceId",
                table: "SubscriptionPlans",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CreditCostRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActionKey = table.Column<int>(type: "int", nullable: false),
                    CreditCost = table.Column<int>(type: "int", nullable: false),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreditCostRules", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CreditTransactionLedgers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActionType = table.Column<int>(type: "int", nullable: false),
                    AmountDeducted = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreditTransactionLedgers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserCreditWallets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserProfileUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TotalCreditsAvailable = table.Column<int>(type: "int", nullable: false),
                    CreditsUsed = table.Column<int>(type: "int", nullable: false),
                    LastResetDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NextResetDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCreditWallets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserCreditWallets_UserProfiles_UserProfileUserId",
                        column: x => x.UserProfileUserId,
                        principalTable: "UserProfiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "BaseMonthlyCredits", "StripePriceId" },
                values: new object[] { 1000, null });

            migrationBuilder.CreateIndex(
                name: "IX_UserCreditWallets_UserProfileUserId",
                table: "UserCreditWallets",
                column: "UserProfileUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CreditCostRules");

            migrationBuilder.DropTable(
                name: "CreditTransactionLedgers");

            migrationBuilder.DropTable(
                name: "UserCreditWallets");

            migrationBuilder.DropColumn(
                name: "CurrentPeriodEnd",
                table: "UserSubscriptions");

            migrationBuilder.DropColumn(
                name: "CurrentPeriodStart",
                table: "UserSubscriptions");

            migrationBuilder.DropColumn(
                name: "StripeSubscriptionId",
                table: "UserSubscriptions");

            migrationBuilder.DropColumn(
                name: "StripePriceId",
                table: "SubscriptionPlans");

            migrationBuilder.RenameColumn(
                name: "CancelledAt",
                table: "UserSubscriptions",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "BaseMonthlyCredits",
                table: "SubscriptionPlans",
                newName: "DailyApiQuotaLimit");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "UserSubscriptions",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "ApiUsageQuotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserProfileUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiType = table.Column<int>(type: "int", nullable: false),
                    CurrentUsage = table.Column<int>(type: "int", nullable: false),
                    MonthlyLimit = table.Column<int>(type: "int", nullable: false),
                    PeriodEnd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PeriodStart = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApiUsageQuotas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApiUsageQuotas_UserProfiles_UserProfileUserId",
                        column: x => x.UserProfileUserId,
                        principalTable: "UserProfiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "DailyApiQuotaLimit",
                value: 100);

            migrationBuilder.CreateIndex(
                name: "IX_ApiUsageQuotas_UserProfileUserId",
                table: "ApiUsageQuotas",
                column: "UserProfileUserId");
        }
    }
}

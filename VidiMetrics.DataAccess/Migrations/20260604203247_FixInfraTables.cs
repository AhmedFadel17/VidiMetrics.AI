using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FixInfraTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_SubscriptionPlans_SubscriptionPlanId",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "ActionKey",
                table: "CreditCostRules");

            migrationBuilder.AlterColumn<Guid>(
                name: "SubscriptionPlanId",
                table: "UserProfiles",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "CreditTransactionLedgers",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ActionType",
                table: "CreditTransactionLedgers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "ActionType",
                table: "CreditCostRules",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_CreditTransactionLedgers_UserId",
                table: "CreditTransactionLedgers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_CreditTransactionLedgers_UserProfiles_UserId",
                table: "CreditTransactionLedgers",
                column: "UserId",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_SubscriptionPlans_SubscriptionPlanId",
                table: "UserProfiles",
                column: "SubscriptionPlanId",
                principalTable: "SubscriptionPlans",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CreditTransactionLedgers_UserProfiles_UserId",
                table: "CreditTransactionLedgers");

            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_SubscriptionPlans_SubscriptionPlanId",
                table: "UserProfiles");

            migrationBuilder.DropIndex(
                name: "IX_CreditTransactionLedgers_UserId",
                table: "CreditTransactionLedgers");

            migrationBuilder.DropColumn(
                name: "ActionType",
                table: "CreditCostRules");

            migrationBuilder.AlterColumn<Guid>(
                name: "SubscriptionPlanId",
                table: "UserProfiles",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "CreditTransactionLedgers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<int>(
                name: "ActionType",
                table: "CreditTransactionLedgers",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<int>(
                name: "ActionKey",
                table: "CreditCostRules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_SubscriptionPlans_SubscriptionPlanId",
                table: "UserProfiles",
                column: "SubscriptionPlanId",
                principalTable: "SubscriptionPlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

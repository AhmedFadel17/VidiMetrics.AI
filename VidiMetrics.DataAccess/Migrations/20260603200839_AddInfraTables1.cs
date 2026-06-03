using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddInfraTables1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCreditWallets_UserProfiles_UserProfileUserId",
                table: "UserCreditWallets");

            migrationBuilder.DropIndex(
                name: "IX_UserCreditWallets_UserProfileUserId",
                table: "UserCreditWallets");

            migrationBuilder.DropColumn(
                name: "UserProfileUserId",
                table: "UserCreditWallets");

            migrationBuilder.CreateIndex(
                name: "IX_UserCreditWallets_UserId",
                table: "UserCreditWallets",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCreditWallets_UserProfiles_UserId",
                table: "UserCreditWallets",
                column: "UserId",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCreditWallets_UserProfiles_UserId",
                table: "UserCreditWallets");

            migrationBuilder.DropIndex(
                name: "IX_UserCreditWallets_UserId",
                table: "UserCreditWallets");

            migrationBuilder.AddColumn<Guid>(
                name: "UserProfileUserId",
                table: "UserCreditWallets",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_UserCreditWallets_UserProfileUserId",
                table: "UserCreditWallets",
                column: "UserProfileUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserCreditWallets_UserProfiles_UserProfileUserId",
                table: "UserCreditWallets",
                column: "UserProfileUserId",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

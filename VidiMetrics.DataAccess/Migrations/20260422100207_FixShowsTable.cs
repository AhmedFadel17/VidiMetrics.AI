using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FixShowsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shows_UserProfiles_UserProfileUserId",
                table: "Shows");

            migrationBuilder.DropIndex(
                name: "IX_Shows_UserProfileUserId",
                table: "Shows");

            migrationBuilder.DropColumn(
                name: "UserProfileUserId",
                table: "Shows");

            migrationBuilder.CreateIndex(
                name: "IX_Shows_UserId",
                table: "Shows",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shows_UserProfiles_UserId",
                table: "Shows",
                column: "UserId",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shows_UserProfiles_UserId",
                table: "Shows");

            migrationBuilder.DropIndex(
                name: "IX_Shows_UserId",
                table: "Shows");

            migrationBuilder.AddColumn<Guid>(
                name: "UserProfileUserId",
                table: "Shows",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Shows_UserProfileUserId",
                table: "Shows",
                column: "UserProfileUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shows_UserProfiles_UserProfileUserId",
                table: "Shows",
                column: "UserProfileUserId",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

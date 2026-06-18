using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddDraftIdToCopilotMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DraftId",
                table: "CopilotMessages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CopilotMessages_DraftId",
                table: "CopilotMessages",
                column: "DraftId");

            migrationBuilder.AddForeignKey(
                name: "FK_CopilotMessages_CopilotDrafts_DraftId",
                table: "CopilotMessages",
                column: "DraftId",
                principalTable: "CopilotDrafts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CopilotMessages_CopilotDrafts_DraftId",
                table: "CopilotMessages");

            migrationBuilder.DropIndex(
                name: "IX_CopilotMessages_DraftId",
                table: "CopilotMessages");

            migrationBuilder.DropColumn(
                name: "DraftId",
                table: "CopilotMessages");
        }
    }
}

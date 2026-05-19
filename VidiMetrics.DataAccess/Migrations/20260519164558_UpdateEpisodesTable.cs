using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEpisodesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_AiImages_AiImageId",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_AiImageId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "AiImageId",
                table: "Episodes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AiImageId",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_AiImageId",
                table: "Episodes",
                column: "AiImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_AiImages_AiImageId",
                table: "Episodes",
                column: "AiImageId",
                principalTable: "AiImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

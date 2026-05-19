using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateShowsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExternalReferenceId",
                table: "Shows");

            migrationBuilder.AddColumn<Guid>(
                name: "AiImageId",
                table: "Shows",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Shows_AiImageId",
                table: "Shows",
                column: "AiImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shows_AiImages_AiImageId",
                table: "Shows",
                column: "AiImageId",
                principalTable: "AiImages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shows_AiImages_AiImageId",
                table: "Shows");

            migrationBuilder.DropIndex(
                name: "IX_Shows_AiImageId",
                table: "Shows");

            migrationBuilder.DropColumn(
                name: "AiImageId",
                table: "Shows");

            migrationBuilder.AddColumn<string>(
                name: "ExternalReferenceId",
                table: "Shows",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}

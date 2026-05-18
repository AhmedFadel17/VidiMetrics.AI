using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAiVideoEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Prompt",
                table: "AiVideos");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duration",
                table: "AiVideos",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "AiVideos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "AiScripts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "AiVideos");

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "AiVideos");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AiScripts");

            migrationBuilder.AddColumn<string>(
                name: "Prompt",
                table: "AiVideos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}

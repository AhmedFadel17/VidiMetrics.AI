using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAiVideoAndSceneSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AiScripts_Scenes_SceneId",
                table: "AiScripts");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_ShortsProjects_ShortsProjectId",
                table: "Videos");

            migrationBuilder.DropTable(
                name: "ShortsProjects");

            migrationBuilder.DropIndex(
                name: "IX_Videos_ShortsProjectId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_AiScripts_SceneId",
                table: "AiScripts");

            migrationBuilder.DropColumn(
                name: "ShortsProjectId",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "SceneId",
                table: "AiScripts");

            migrationBuilder.AddColumn<Guid>(
                name: "AiScriptId",
                table: "Scenes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AiVideoId",
                table: "Scenes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AiVideos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    VideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prompt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Seed = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsLinked = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AiVideos", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Scenes_AiScriptId",
                table: "Scenes",
                column: "AiScriptId",
                unique: true,
                filter: "[AiScriptId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Scenes_AiVideoId",
                table: "Scenes",
                column: "AiVideoId",
                unique: true,
                filter: "[AiVideoId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_AiScripts_AiScriptId",
                table: "Scenes",
                column: "AiScriptId",
                principalTable: "AiScripts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_AiVideos_AiVideoId",
                table: "Scenes",
                column: "AiVideoId",
                principalTable: "AiVideos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_AiScripts_AiScriptId",
                table: "Scenes");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_AiVideos_AiVideoId",
                table: "Scenes");

            migrationBuilder.DropTable(
                name: "AiVideos");

            migrationBuilder.DropIndex(
                name: "IX_Scenes_AiScriptId",
                table: "Scenes");

            migrationBuilder.DropIndex(
                name: "IX_Scenes_AiVideoId",
                table: "Scenes");

            migrationBuilder.DropColumn(
                name: "AiScriptId",
                table: "Scenes");

            migrationBuilder.DropColumn(
                name: "AiVideoId",
                table: "Scenes");

            migrationBuilder.AddColumn<Guid>(
                name: "ShortsProjectId",
                table: "Videos",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SceneId",
                table: "AiScripts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "ShortsProjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OriginalVideoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ExpectedClipCount = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ProjectName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TargetPlatform = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShortsProjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShortsProjects_Videos_OriginalVideoId",
                        column: x => x.OriginalVideoId,
                        principalTable: "Videos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Videos_ShortsProjectId",
                table: "Videos",
                column: "ShortsProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AiScripts_SceneId",
                table: "AiScripts",
                column: "SceneId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShortsProjects_OriginalVideoId",
                table: "ShortsProjects",
                column: "OriginalVideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_AiScripts_Scenes_SceneId",
                table: "AiScripts",
                column: "SceneId",
                principalTable: "Scenes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_ShortsProjects_ShortsProjectId",
                table: "Videos",
                column: "ShortsProjectId",
                principalTable: "ShortsProjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

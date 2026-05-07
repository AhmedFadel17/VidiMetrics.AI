using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddSceneCharactersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_StoryEnvironments_StoryEnvironmentId1",
                table: "Scenes");

            migrationBuilder.DropTable(
                name: "CharacterScene");

            migrationBuilder.DropIndex(
                name: "IX_Scenes_StoryEnvironmentId1",
                table: "Scenes");

            migrationBuilder.DropColumn(
                name: "StoryEnvironmentId1",
                table: "Scenes");

            migrationBuilder.CreateTable(
                name: "SceneCharacters",
                columns: table => new
                {
                    SceneId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CharacterId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SceneCharacters", x => new { x.SceneId, x.CharacterId });
                    table.ForeignKey(
                        name: "FK_SceneCharacters_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SceneCharacters_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SceneCharacters_CharacterId",
                table: "SceneCharacters",
                column: "CharacterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SceneCharacters");

            migrationBuilder.AddColumn<Guid>(
                name: "StoryEnvironmentId1",
                table: "Scenes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CharacterScene",
                columns: table => new
                {
                    CharactersId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ScenesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterScene", x => new { x.CharactersId, x.ScenesId });
                    table.ForeignKey(
                        name: "FK_CharacterScene_Characters_CharactersId",
                        column: x => x.CharactersId,
                        principalTable: "Characters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CharacterScene_Scenes_ScenesId",
                        column: x => x.ScenesId,
                        principalTable: "Scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Scenes_StoryEnvironmentId1",
                table: "Scenes",
                column: "StoryEnvironmentId1");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterScene_ScenesId",
                table: "CharacterScene",
                column: "ScenesId");

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_StoryEnvironments_StoryEnvironmentId1",
                table: "Scenes",
                column: "StoryEnvironmentId1",
                principalTable: "StoryEnvironments",
                principalColumn: "Id");
        }
    }
}

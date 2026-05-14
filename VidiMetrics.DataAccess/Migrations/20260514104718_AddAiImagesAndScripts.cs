using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAiImagesAndScripts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_StoryEnvironments_StoryEnvironmentId",
                table: "Scenes");

            migrationBuilder.DropColumn(
                name: "ReferenceImageUrl",
                table: "StoryEnvironments");

            migrationBuilder.DropColumn(
                name: "Script",
                table: "Scenes");

            migrationBuilder.DropColumn(
                name: "VisualPrompt",
                table: "Scenes");

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "ReferenceImageUrl",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "VoiceId",
                table: "Characters");

            migrationBuilder.AddColumn<Guid>(
                name: "AiImageId",
                table: "StoryEnvironments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "StoryEnvironmentId",
                table: "Scenes",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "ThumbnailImageId",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AiImageId",
                table: "Characters",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "VoiceProfileId",
                table: "Characters",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AiImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_AiImages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AiScripts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Weather = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EnvironmentDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VisualPrompt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StoryEnvironmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SceneId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AiScripts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AiScripts_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AiScripts_StoryEnvironments_StoryEnvironmentId",
                        column: x => x.StoryEnvironmentId,
                        principalTable: "StoryEnvironments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VoiceProfile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Provider = table.Column<int>(type: "int", nullable: false),
                    ProviderVoiceId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviewUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Language = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoiceProfile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ScriptLine",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    CharacterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CharacterStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AiScriptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScriptLine", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScriptLine_AiScripts_AiScriptId",
                        column: x => x.AiScriptId,
                        principalTable: "AiScripts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScriptLine_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_StoryEnvironments_AiImageId",
                table: "StoryEnvironments",
                column: "AiImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_ThumbnailImageId",
                table: "Episodes",
                column: "ThumbnailImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_AiImageId",
                table: "Characters",
                column: "AiImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_VoiceProfileId",
                table: "Characters",
                column: "VoiceProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_AiScripts_SceneId",
                table: "AiScripts",
                column: "SceneId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AiScripts_StoryEnvironmentId",
                table: "AiScripts",
                column: "StoryEnvironmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ScriptLine_AiScriptId",
                table: "ScriptLine",
                column: "AiScriptId");

            migrationBuilder.CreateIndex(
                name: "IX_ScriptLine_CharacterId",
                table: "ScriptLine",
                column: "CharacterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_AiImages_AiImageId",
                table: "Characters",
                column: "AiImageId",
                principalTable: "AiImages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_VoiceProfile_VoiceProfileId",
                table: "Characters",
                column: "VoiceProfileId",
                principalTable: "VoiceProfile",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_AiImages_ThumbnailImageId",
                table: "Episodes",
                column: "ThumbnailImageId",
                principalTable: "AiImages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_StoryEnvironments_StoryEnvironmentId",
                table: "Scenes",
                column: "StoryEnvironmentId",
                principalTable: "StoryEnvironments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoryEnvironments_AiImages_AiImageId",
                table: "StoryEnvironments",
                column: "AiImageId",
                principalTable: "AiImages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_AiImages_AiImageId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_Characters_VoiceProfile_VoiceProfileId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_AiImages_ThumbnailImageId",
                table: "Episodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_StoryEnvironments_StoryEnvironmentId",
                table: "Scenes");

            migrationBuilder.DropForeignKey(
                name: "FK_StoryEnvironments_AiImages_AiImageId",
                table: "StoryEnvironments");

            migrationBuilder.DropTable(
                name: "AiImages");

            migrationBuilder.DropTable(
                name: "ScriptLine");

            migrationBuilder.DropTable(
                name: "VoiceProfile");

            migrationBuilder.DropTable(
                name: "AiScripts");

            migrationBuilder.DropIndex(
                name: "IX_StoryEnvironments_AiImageId",
                table: "StoryEnvironments");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_ThumbnailImageId",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Characters_AiImageId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_Characters_VoiceProfileId",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "AiImageId",
                table: "StoryEnvironments");

            migrationBuilder.DropColumn(
                name: "ThumbnailImageId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "AiImageId",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "VoiceProfileId",
                table: "Characters");

            migrationBuilder.AddColumn<string>(
                name: "ReferenceImageUrl",
                table: "StoryEnvironments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "StoryEnvironmentId",
                table: "Scenes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Script",
                table: "Scenes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VisualPrompt",
                table: "Scenes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "Episodes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ReferenceImageUrl",
                table: "Characters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VoiceId",
                table: "Characters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_StoryEnvironments_StoryEnvironmentId",
                table: "Scenes",
                column: "StoryEnvironmentId",
                principalTable: "StoryEnvironments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

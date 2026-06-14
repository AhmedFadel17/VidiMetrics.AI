using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RenameLocationsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AiScripts_StoryEnvironments_StoryEnvironmentId",
                table: "AiScripts");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_StoryEnvironments_StoryEnvironmentId",
                table: "Scenes");

            migrationBuilder.DropTable(
                name: "StoryEnvironments");

            migrationBuilder.RenameColumn(
                name: "StoryEnvironmentId",
                table: "Scenes",
                newName: "LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Scenes_StoryEnvironmentId",
                table: "Scenes",
                newName: "IX_Scenes_LocationId");

            migrationBuilder.RenameColumn(
                name: "StoryEnvironmentId",
                table: "AiScripts",
                newName: "LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_AiScripts_StoryEnvironmentId",
                table: "AiScripts",
                newName: "IX_AiScripts_LocationId");

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VisualDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Atmosphere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AiImageId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ShowId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Locations_AiImages_AiImageId",
                        column: x => x.AiImageId,
                        principalTable: "AiImages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Locations_Shows_ShowId",
                        column: x => x.ShowId,
                        principalTable: "Shows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Locations_AiImageId",
                table: "Locations",
                column: "AiImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_ShowId",
                table: "Locations",
                column: "ShowId");

            migrationBuilder.AddForeignKey(
                name: "FK_AiScripts_Locations_LocationId",
                table: "AiScripts",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_Locations_LocationId",
                table: "Scenes",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AiScripts_Locations_LocationId",
                table: "AiScripts");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_Locations_LocationId",
                table: "Scenes");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.RenameColumn(
                name: "LocationId",
                table: "Scenes",
                newName: "StoryEnvironmentId");

            migrationBuilder.RenameIndex(
                name: "IX_Scenes_LocationId",
                table: "Scenes",
                newName: "IX_Scenes_StoryEnvironmentId");

            migrationBuilder.RenameColumn(
                name: "LocationId",
                table: "AiScripts",
                newName: "StoryEnvironmentId");

            migrationBuilder.RenameIndex(
                name: "IX_AiScripts_LocationId",
                table: "AiScripts",
                newName: "IX_AiScripts_StoryEnvironmentId");

            migrationBuilder.CreateTable(
                name: "StoryEnvironments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AiImageId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ShowId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Atmosphere = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VisualDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoryEnvironments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StoryEnvironments_AiImages_AiImageId",
                        column: x => x.AiImageId,
                        principalTable: "AiImages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StoryEnvironments_Shows_ShowId",
                        column: x => x.ShowId,
                        principalTable: "Shows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StoryEnvironments_AiImageId",
                table: "StoryEnvironments",
                column: "AiImageId");

            migrationBuilder.CreateIndex(
                name: "IX_StoryEnvironments_ShowId",
                table: "StoryEnvironments",
                column: "ShowId");

            migrationBuilder.AddForeignKey(
                name: "FK_AiScripts_StoryEnvironments_StoryEnvironmentId",
                table: "AiScripts",
                column: "StoryEnvironmentId",
                principalTable: "StoryEnvironments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_StoryEnvironments_StoryEnvironmentId",
                table: "Scenes",
                column: "StoryEnvironmentId",
                principalTable: "StoryEnvironments",
                principalColumn: "Id");
        }
    }
}

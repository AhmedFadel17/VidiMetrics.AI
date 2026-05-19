using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEpisodesEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_AiImages_ThumbnailImageId",
                table: "Episodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Videos_FinalVideoId",
                table: "Episodes");

            migrationBuilder.RenameColumn(
                name: "ThumbnailImageId",
                table: "Episodes",
                newName: "AiVideoId");

            migrationBuilder.RenameColumn(
                name: "FinalVideoId",
                table: "Episodes",
                newName: "AiImageId");

            migrationBuilder.RenameIndex(
                name: "IX_Episodes_ThumbnailImageId",
                table: "Episodes",
                newName: "IX_Episodes_AiVideoId");

            migrationBuilder.RenameIndex(
                name: "IX_Episodes_FinalVideoId",
                table: "Episodes",
                newName: "IX_Episodes_AiImageId");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Scenes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_AiImages_AiImageId",
                table: "Episodes",
                column: "AiImageId",
                principalTable: "AiImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_AiVideos_AiVideoId",
                table: "Episodes",
                column: "AiVideoId",
                principalTable: "AiVideos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_AiImages_AiImageId",
                table: "Episodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_AiVideos_AiVideoId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Scenes");

            migrationBuilder.RenameColumn(
                name: "AiVideoId",
                table: "Episodes",
                newName: "ThumbnailImageId");

            migrationBuilder.RenameColumn(
                name: "AiImageId",
                table: "Episodes",
                newName: "FinalVideoId");

            migrationBuilder.RenameIndex(
                name: "IX_Episodes_AiVideoId",
                table: "Episodes",
                newName: "IX_Episodes_ThumbnailImageId");

            migrationBuilder.RenameIndex(
                name: "IX_Episodes_AiImageId",
                table: "Episodes",
                newName: "IX_Episodes_FinalVideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_AiImages_ThumbnailImageId",
                table: "Episodes",
                column: "ThumbnailImageId",
                principalTable: "AiImages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Videos_FinalVideoId",
                table: "Episodes",
                column: "FinalVideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

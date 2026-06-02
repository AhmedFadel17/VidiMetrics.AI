using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAssetTypeAndSizeToAssetsTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLinked",
                table: "AiVideos");

            migrationBuilder.DropColumn(
                name: "IsLinked",
                table: "AiImages");

            migrationBuilder.AddColumn<int>(
                name: "AssetType",
                table: "AiVideos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "AiVideos",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "AssetType",
                table: "AiImages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "AiImages",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssetType",
                table: "AiVideos");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "AiVideos");

            migrationBuilder.DropColumn(
                name: "AssetType",
                table: "AiImages");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "AiImages");

            migrationBuilder.AddColumn<bool>(
                name: "IsLinked",
                table: "AiVideos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsLinked",
                table: "AiImages",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}

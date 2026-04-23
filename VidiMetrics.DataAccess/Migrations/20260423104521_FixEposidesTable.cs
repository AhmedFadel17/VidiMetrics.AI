using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FixEposidesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Videos_VideoId",
                table: "Episodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Videos_VideoId1",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_VideoId",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_VideoId1",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "VideoId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "VideoId1",
                table: "Episodes");

            migrationBuilder.AddColumn<string>(
                name: "VideoType",
                table: "Videos",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "FinalVideoId",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FinalVideoId1",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_FinalVideoId",
                table: "Episodes",
                column: "FinalVideoId");

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_FinalVideoId1",
                table: "Episodes",
                column: "FinalVideoId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Videos_FinalVideoId",
                table: "Episodes",
                column: "FinalVideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Videos_FinalVideoId1",
                table: "Episodes",
                column: "FinalVideoId1",
                principalTable: "Videos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Videos_FinalVideoId",
                table: "Episodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Videos_FinalVideoId1",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_FinalVideoId",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_FinalVideoId1",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "VideoType",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "FinalVideoId",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "FinalVideoId1",
                table: "Episodes");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Videos",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "VideoId",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "VideoId1",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_VideoId",
                table: "Episodes",
                column: "VideoId");

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_VideoId1",
                table: "Episodes",
                column: "VideoId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Videos_VideoId",
                table: "Episodes",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Videos_VideoId1",
                table: "Episodes",
                column: "VideoId1",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

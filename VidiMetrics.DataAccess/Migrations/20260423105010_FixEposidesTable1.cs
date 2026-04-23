using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VidiMetrics.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class FixEposidesTable1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Videos_FinalVideoId1",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_FinalVideoId1",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "FinalVideoId1",
                table: "Episodes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FinalVideoId1",
                table: "Episodes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_FinalVideoId1",
                table: "Episodes",
                column: "FinalVideoId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Videos_FinalVideoId1",
                table: "Episodes",
                column: "FinalVideoId1",
                principalTable: "Videos",
                principalColumn: "Id");
        }
    }
}

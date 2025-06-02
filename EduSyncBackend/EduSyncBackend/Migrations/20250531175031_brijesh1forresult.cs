using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduSyncBackend.Migrations
{
    /// <inheritdoc />
    public partial class brijesh1forresult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Results_Courses_CourseId",
                table: "Results");

            migrationBuilder.DropIndex(
                name: "IX_Results_CourseId",
                table: "Results");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Results");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CourseId",
                table: "Results",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Results_CourseId",
                table: "Results",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Results_Courses_CourseId",
                table: "Results",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CourseId");
        }
    }
}

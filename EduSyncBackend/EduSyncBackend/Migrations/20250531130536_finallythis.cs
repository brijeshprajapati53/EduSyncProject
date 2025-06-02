using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduSyncBackend.Migrations
{
    /// <inheritdoc />
    public partial class finallythis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OptionsJson",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Answers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OptionsJson",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Answers");
        }
    }
}

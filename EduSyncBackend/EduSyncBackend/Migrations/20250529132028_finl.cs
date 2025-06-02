using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduSyncBackend.Migrations
{
    /// <inheritdoc />
    public partial class finl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Questions",
                table: "Assessments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Questions",
                table: "Assessments");
        }
    }
}

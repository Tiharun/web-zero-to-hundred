using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ImageDonation.Api.Migrations
{
    /// <inheritdoc />
    public partial class SafetyReportsAndMinimalEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DonationText",
                table: "DonationEvents");

            migrationBuilder.DropColumn(
                name: "DonatorNickname",
                table: "DonationEvents");

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DonationId = table.Column<int>(type: "integer", nullable: false),
                    StreamerId = table.Column<int>(type: "integer", nullable: false),
                    Reason = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Donations_ImageFile",
                table: "Donations",
                column: "ImageFile");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_CreatedAt",
                table: "Reports",
                column: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Donations_ImageFile",
                table: "Donations");

            migrationBuilder.AddColumn<string>(
                name: "DonationText",
                table: "DonationEvents",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DonatorNickname",
                table: "DonationEvents",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}

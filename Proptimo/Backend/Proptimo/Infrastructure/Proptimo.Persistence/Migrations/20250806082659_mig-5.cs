using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proptimo.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class mig5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RealEstateAddressId",
                table: "RealEstates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RealEstateId",
                table: "RealEstateAddresses",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Symbol",
                table: "Currencies",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1)");

            migrationBuilder.CreateIndex(
                name: "IX_RealEstateAddresses_RealEstateId",
                table: "RealEstateAddresses",
                column: "RealEstateId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RealEstateAddresses_RealEstates_RealEstateId",
                table: "RealEstateAddresses",
                column: "RealEstateId",
                principalTable: "RealEstates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RealEstateAddresses_RealEstates_RealEstateId",
                table: "RealEstateAddresses");

            migrationBuilder.DropIndex(
                name: "IX_RealEstateAddresses_RealEstateId",
                table: "RealEstateAddresses");

            migrationBuilder.DropColumn(
                name: "RealEstateAddressId",
                table: "RealEstates");

            migrationBuilder.DropColumn(
                name: "RealEstateId",
                table: "RealEstateAddresses");

            migrationBuilder.AlterColumn<string>(
                name: "Symbol",
                table: "Currencies",
                type: "nvarchar(1)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}

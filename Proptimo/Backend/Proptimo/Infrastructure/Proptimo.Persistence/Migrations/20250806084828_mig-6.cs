using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proptimo.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class mig6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RealEstateAddresses_RealEstates_RealEstateId",
                table: "RealEstateAddresses");

            migrationBuilder.DropIndex(
                name: "IX_RealEstateAddresses_RealEstateId",
                table: "RealEstateAddresses");

            migrationBuilder.AlterColumn<string>(
                name: "RealEstateAddressId",
                table: "RealEstates",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "RealEstateId",
                table: "RealEstateAddresses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_RealEstates_RealEstateAddressId",
                table: "RealEstates",
                column: "RealEstateAddressId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RealEstates_RealEstateAddresses_RealEstateAddressId",
                table: "RealEstates",
                column: "RealEstateAddressId",
                principalTable: "RealEstateAddresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RealEstates_RealEstateAddresses_RealEstateAddressId",
                table: "RealEstates");

            migrationBuilder.DropIndex(
                name: "IX_RealEstates_RealEstateAddressId",
                table: "RealEstates");

            migrationBuilder.AlterColumn<string>(
                name: "RealEstateAddressId",
                table: "RealEstates",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "RealEstateId",
                table: "RealEstateAddresses",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

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
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proptimo.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class mig4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RealEstateTypeId",
                table: "RealEstateTypes",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RealEstateTypeFeatureValueId",
                table: "realEstateTypeFeatureValues",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RealEstateTypeFeatureId",
                table: "RealEstateTypeFeatures",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RealEstateId",
                table: "RealEstates",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RealEstateImageId",
                table: "RealEstateImages",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "RealEstateAddressId",
                table: "RealEstateAddresses",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "CurrencyId",
                table: "Currencies",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "RealEstateTypes",
                newName: "RealEstateTypeId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "realEstateTypeFeatureValues",
                newName: "RealEstateTypeFeatureValueId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "RealEstateTypeFeatures",
                newName: "RealEstateTypeFeatureId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "RealEstates",
                newName: "RealEstateId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "RealEstateImages",
                newName: "RealEstateImageId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "RealEstateAddresses",
                newName: "RealEstateAddressId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Currencies",
                newName: "CurrencyId");
        }
    }
}

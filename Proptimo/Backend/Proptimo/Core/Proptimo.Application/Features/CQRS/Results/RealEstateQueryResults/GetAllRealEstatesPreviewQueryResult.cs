using Proptimo.Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults
{
    public class GetAllRealEstatesPreviewQueryResult
    {
        public string RealEstateId { get; set; }
        public string PrimaryImageUrl { get; set; }
        public string RealEstateTypeName { get; set; }
        public string RealEstateTitle { get; set; }
        public DateTime RealEstateStartDate { get; set; }
        public DateTime RealEstateEndDate { get; set; }
        public decimal Price { get; set; }
        public string CityName { get; set; }
        public string DistrictName { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public RealEstateListingType RealEstateListingType { get; set; }
        public RealEstateState RealEstateState { get; set; }
    }
}

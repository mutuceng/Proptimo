using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.RealEstateAddressQueryResults
{
    public class GetAllAdressQueryResult
    {
        public string Id { get; set; }
        public string CityName { get; set; }
        public string DistrictName { get; set; }
        public string NeighborhoodName { get; set; }
        public string? Street { get; set; }
        public string? BuildingNo { get; set; }
        public string DoorNumber { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string RealEstateId { get; set; }
    }
}

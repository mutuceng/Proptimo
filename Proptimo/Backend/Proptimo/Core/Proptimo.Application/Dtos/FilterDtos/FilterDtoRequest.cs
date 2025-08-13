using Proptimo.Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Dtos.FilterDtos
{
    public class FilterDtoRequest
    {
        public string? RealEstateTypeName { get; set; }
        public RealEstateListingType? RealEstateListingType { get; set; }
        public RealEstateState? RealEstateState { get; set; }
        public DateTime? RealEstateStartDate { get; set; }
        public DateTime? RealEstateEndDate { get; set; }
        public string? CityName { get; set; }
        public string? DistrictName { get; set; }
        public decimal? MaxPrice { get; set; }
        public decimal? MinPrice { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 8;
    }
}

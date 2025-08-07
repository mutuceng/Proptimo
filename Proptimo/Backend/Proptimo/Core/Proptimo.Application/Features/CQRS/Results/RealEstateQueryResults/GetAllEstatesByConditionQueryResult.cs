using Proptimo.Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults
{
    public class GetAllEstatesByConditionQueryResult
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }

        public RealEstateListingType ListingType { get; set; }
        public RealEstateState State { get; set; } = 0;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public string RealEstateTypeId { get; set; }
        public string RealEstateAddressId { get; set; }
    }
}

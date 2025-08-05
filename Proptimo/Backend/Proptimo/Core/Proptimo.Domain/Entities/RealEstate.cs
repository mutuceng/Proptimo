using Proptimo.Domain.Entities.Common;
using Proptimo.Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities
{
    public class RealEstate:BaseEntity
    {
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

        public List<RealEstateImage> Images { get; set; }
        public RealEstateType RealEstateType {  get; set; }
        public List<RealEstateTypeFeatureValue> FeatureValues { get; set; } = new();

    }
}

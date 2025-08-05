using Proptimo.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities
{
    public class RealEstateTypeFeatureValue : BaseEntity
    {
        public int? ValueInt { get; set; }
        public decimal? ValueDecimal { get; set; }
        public bool? ValueBool { get; set; }
        public string? ValueString { get; set; }
        public DateTime? ValueDate { get; set; }

        public string RealEstateId { get; set; }
        public RealEstate RealEstate { get; set; }

        public string RealEstateTypeFeatureId { get; set; }
        public RealEstateTypeFeature RealEstateTypeFeature { get; set; }


    }
}

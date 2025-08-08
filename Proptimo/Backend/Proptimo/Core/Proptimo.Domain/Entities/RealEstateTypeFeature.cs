using Proptimo.Domain.Entities.Common;
using Proptimo.Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities
{
    public class RealEstateTypeFeature : BaseEntity
    {
        public string Name { get; set; }
        public TypeFeatureDataType DataType { get; set; }
        public bool IsUnit { get; set; }
        public bool IsRequired { get; set; }
        public List<string>? Options { get; set; } 

        public string RealEstateTypeId { get; set; }
        public RealEstateType RealEstateType { get; set; }
    }
}

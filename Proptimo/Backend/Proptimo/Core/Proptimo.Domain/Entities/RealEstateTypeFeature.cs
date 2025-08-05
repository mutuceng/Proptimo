using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Domain.Entities
{
    public class RealEstateTypeFeature
    {
        public string RealEstateTypeFeatureId { get; set; }
        public string Name { get; set; }
        public string DataType { get; set; }
        public bool IsUnit { get; set; }
        public bool IsRequired { get; set; }
        public List<string>? Options { get; set; } 

        public string RealEstateTypeId { get; set; }
        public RealEstateType RealEstateType { get; set; }
    }
}

using Proptimo.Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureQueryResults
{
    public class GetRealEstateTypeFeaturesByTypeIdQueryResult
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public TypeFeatureDataType DataType { get; set; }
        public string DataTypeName => ((TypeFeatureDataType)DataType).ToString();
        public bool IsUnit { get; set; }
        public bool IsRequired { get; set; }
        public List<string>? Options { get; set; }
    }
}

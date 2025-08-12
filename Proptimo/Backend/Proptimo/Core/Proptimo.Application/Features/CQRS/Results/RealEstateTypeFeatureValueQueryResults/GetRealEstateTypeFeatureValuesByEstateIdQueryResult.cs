using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureValueQueryResults
{
    public class GetRealEstateTypeFeatureValuesByEstateIdQueryResult
    {
        public string Id { get; set; }
        public int? ValueInt { get; set; }
        public decimal? ValueDecimal { get; set; }
        public bool? ValueBool { get; set; }
        public string? ValueString { get; set; }
        public DateTime? ValueDate { get; set; }

        public string RealEstateId { get; set; }
        public string RealEstateTypeFeatureId { get; set; }
    }
}

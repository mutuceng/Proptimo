using MediatR;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureQueries
{
    public class GetRealEstateTypeFeaturesByTypeIdQuery : IRequest<List<GetRealEstateTypeFeaturesByTypeIdQueryResult>>
    {
        public string RealEstateTypeId { get; set; }
        public GetRealEstateTypeFeaturesByTypeIdQuery (string id) 
        { 
            RealEstateTypeId = id; 
        }
    }
}

using MediatR;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureValueQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureValueQueries
{
    public class GetRealEstateTypeFeatureValuesByEstateIdQuery : IRequest<List<GetRealEstateTypeFeatureValuesByEstateIdQueryResult>>
    {
        public string EstateId { get; set; }
        public GetRealEstateTypeFeatureValuesByEstateIdQuery(string EstateId) {  this.EstateId = EstateId;}
    }
}

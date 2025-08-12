using MediatR;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.RealEstateQueries
{
    public class GetRealEstateDetailQuery: IRequest<GetRealEstateDetailQueryResult>
    {
        public string EstateId { get; set; }
        public GetRealEstateDetailQuery(string id)
        {
            EstateId = id;
        }
    }
}

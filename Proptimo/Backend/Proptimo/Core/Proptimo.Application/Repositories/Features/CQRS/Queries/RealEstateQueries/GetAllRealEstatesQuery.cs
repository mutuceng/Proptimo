using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateQueries
{
    public class GetAllRealEstatesQuery : IRequest<List<GetAllEstatesQueryResult>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}

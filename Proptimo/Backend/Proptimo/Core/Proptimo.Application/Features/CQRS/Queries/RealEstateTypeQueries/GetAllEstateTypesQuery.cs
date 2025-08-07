using MediatR;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.RealEstateTypeQueries
{
    public class GetAllEstateTypesQuery : IRequest<List<GetAllEstateTypesQueryResult>>
    {
    }
}

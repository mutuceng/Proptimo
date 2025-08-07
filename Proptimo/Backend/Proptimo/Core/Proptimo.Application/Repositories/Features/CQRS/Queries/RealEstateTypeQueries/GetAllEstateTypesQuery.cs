using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateTypeQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateTypeQueries
{
    public class GetAllEstateTypesQuery : IRequest<List<GetAllEstateTypesQueryResult>>
    {
    }
}

using MediatR;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.RealEstateQueries
{
    public class GetAllRealEstatesPreviewQuery : IRequest<List<GetAllRealEstatesPreviewQueryResult>>
    {
    }
}

using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateAddressQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateAddressQueries
{
    public class GetAllAddressQuery : IRequest<List<GetAllAdressQueryResult>>
    {
    }
}

using MediatR;
using Proptimo.Application.Features.CQRS.Results.RealEstateAddressQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.RealEstateAddressQueries
{
    public class GetAllAddressQuery : IRequest<List<GetAllAdressQueryResult>>
    {
    }
}

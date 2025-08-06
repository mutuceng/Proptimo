using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateAddressQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateAddressQueries
{
    public class GetAddressByIdQuery : IRequest<GetAddressByIdQueryResult>
    {
        public string Id { get; set; }
        public GetAddressByIdQuery (string id)
        {
            Id = id;
        }
    }
}

using MediatR;
using Proptimo.Application.Features.CQRS.Results.CurrencyQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.CurrencyQueries
{
    public class GetByIdCurrencyQuery : IRequest<GetByIdCurrencyQueryResult>
    {
        public string Id { get; set; }
        public GetByIdCurrencyQuery (string id)
        {
            Id = id;
        }

    }
}

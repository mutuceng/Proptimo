using MediatR;
using Proptimo.Application.Features.CQRS.Results.CurrencyQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.CurrencyQueries
{
    public class GetAllCurrenciesQuery : IRequest<List<GetAllCurrenciesQueryResult>>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
    }
}

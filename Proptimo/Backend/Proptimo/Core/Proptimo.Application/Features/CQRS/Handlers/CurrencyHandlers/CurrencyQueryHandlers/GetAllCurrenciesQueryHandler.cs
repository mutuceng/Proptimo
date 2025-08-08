using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Queries.CurrencyQueries;
using Proptimo.Application.Features.CQRS.Results.CurrencyQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.CurrencyHandlers.CurrencyQueryHandlers
{
    public class GetAllCurrenciesQueryHandler : IRequestHandler<GetAllCurrenciesQuery, List<GetAllCurrenciesQueryResult>>
    {
        private readonly IReadRepository<Currency> _repository;
        private readonly IMapper _mapper;

        public GetAllCurrenciesQueryHandler(IReadRepository<Currency> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<GetAllCurrenciesQueryResult>> Handle(GetAllCurrenciesQuery request, CancellationToken cancellationToken)
        {
            var currencies = await _repository.GetAllAsync();
            return _mapper.Map<List<GetAllCurrenciesQueryResult>>(currencies);
        }
    }
}

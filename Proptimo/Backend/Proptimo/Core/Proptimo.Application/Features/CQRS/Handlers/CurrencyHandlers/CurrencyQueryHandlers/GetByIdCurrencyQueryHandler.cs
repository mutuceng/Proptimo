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
    public class GetByIdCurrencyQueryHandler : IRequestHandler<GetByIdCurrencyQuery, GetByIdCurrencyQueryResult>
    {
        private readonly IReadRepository<Currency> _repository;
        private readonly IMapper _mapper;

        public GetByIdCurrencyQueryHandler(IReadRepository<Currency> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<GetByIdCurrencyQueryResult> Handle(GetByIdCurrencyQuery request, CancellationToken cancellationToken)
        {
            var currency = await _repository.GetByIdAsync(request.Id);

            return _mapper.Map<GetByIdCurrencyQueryResult>(currency);
        }
    }
}

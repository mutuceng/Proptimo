using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Commands.CurrencyCommands;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.CurrencyHandlers.CurrencyCommandHandlers
{
    public class CreateCurrencyCommandHandler : IRequestHandler<CreateCurrencyCommand>
    {
        private readonly IWriteRepository<Currency> _repository;
        private readonly IMapper _mapper;

        public CreateCurrencyCommandHandler(IWriteRepository<Currency> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Handle(CreateCurrencyCommand request, CancellationToken cancellationToken)
        {
            var currency = _mapper.Map<Currency>(request);

            await _repository.AddAsync(currency);
        }
    }
}

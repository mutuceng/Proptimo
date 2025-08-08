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
    public class DeleteCurrencyCommandHandler : IRequestHandler<DeleteCurrencyCommand>
    {
        private readonly IWriteRepository<Currency> _repository;

        public DeleteCurrencyCommandHandler(IWriteRepository<Currency> repository)
        {
            _repository = repository;
        }

        public async Task Handle(DeleteCurrencyCommand request, CancellationToken cancellationToken)
        {
            await _repository.DeleteAsync(request.Id);
        }
    }
}

using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Handlers.RealEstateAddressHandlers.RealEstateAddressCommandHandlers
{
    public class DeleteAddressCommandHandler : IRequestHandler<DeleteAddressCommand>
    {
        private readonly IWriteRepository<RealEstateAddress> _repository;

        public DeleteAddressCommandHandler(IWriteRepository<RealEstateAddress> repository)
        {
            _repository = repository;
        }

        public async Task Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
        {
            await _repository.DeleteAsync(request.Id);
        }
    }
}

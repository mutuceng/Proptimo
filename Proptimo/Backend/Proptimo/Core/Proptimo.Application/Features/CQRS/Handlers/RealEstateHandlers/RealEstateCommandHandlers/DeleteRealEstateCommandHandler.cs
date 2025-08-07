using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateHandlers.RealEstateCommandHandlers
{
    public class DeleteRealEstateCommandHandler : IRequestHandler<DeleteRealEstateCommand>
    {
        private readonly IWriteRepository<RealEstate> _repository;

        public DeleteRealEstateCommandHandler(IWriteRepository<RealEstate> repository)
        {
            _repository = repository;
        }

        public async Task Handle(DeleteRealEstateCommand request, CancellationToken cancellationToken)
        {
            await _repository.DeleteAsync(request.Id);
        }
    }
}

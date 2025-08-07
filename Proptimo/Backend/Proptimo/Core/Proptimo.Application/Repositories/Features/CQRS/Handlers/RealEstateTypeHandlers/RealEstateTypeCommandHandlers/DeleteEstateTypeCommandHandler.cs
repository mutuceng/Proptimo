using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Handlers.RealEstateTypeHandlers.RealEstateTypeCommandHandlers
{
    public class DeleteEstateTypeCommandHandler : IRequestHandler<DeleteEstateTypeCommand>
    {
        private readonly IWriteRepository<RealEstateType> _repository;

        public DeleteEstateTypeCommandHandler(IWriteRepository<RealEstateType> repository)
        {
            _repository = repository;
        }

        public async Task Handle(DeleteEstateTypeCommand request, CancellationToken cancellationToken)
        {
            await _repository.DeleteAsync(request.Id);
        }
    }
}

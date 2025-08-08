using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureCommands;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateTypeFeatureHandlers.RealEstateTypeFeatureCommandHandlers
{
    public class DeleteRealEstateTypeFeatureCommandHandler : IRequestHandler<DeleteRealEstateTypeFeatureCommand>
    {
        private readonly IWriteRepository<RealEstateTypeFeature> _repository;

        public DeleteRealEstateTypeFeatureCommandHandler(IWriteRepository<RealEstateTypeFeature> repository)
        {
            _repository = repository;
        }

        public async Task Handle(DeleteRealEstateTypeFeatureCommand request, CancellationToken cancellationToken)
        {
            await _repository.DeleteAsync(request.Id);
        }
    }
}

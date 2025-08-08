using AutoMapper;
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
    public class UpdateRealEstateTypeFeatureCommandHandler : IRequestHandler<UpdateRealEstateTypeFeatureCommand>
    {
        private readonly IWriteRepository<RealEstateTypeFeature> _repository;
        private readonly IMapper _mapper;

        public UpdateRealEstateTypeFeatureCommandHandler(IWriteRepository<RealEstateTypeFeature> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Handle(UpdateRealEstateTypeFeatureCommand request, CancellationToken cancellationToken)
        {
            var feature = _mapper.Map<RealEstateTypeFeature>(request);

            await _repository.Update(feature);
        }
    }
}

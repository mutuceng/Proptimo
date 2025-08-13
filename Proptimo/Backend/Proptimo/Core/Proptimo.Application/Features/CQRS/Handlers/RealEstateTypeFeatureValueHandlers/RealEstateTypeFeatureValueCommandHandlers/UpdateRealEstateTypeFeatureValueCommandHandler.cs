using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureValueCommands;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateTypeFeatureValueHandlers.RealEstateTypeFeatureValueCommandHandlers
{
    public class UpdateRealEstateTypeFeatureValueCommandHandler : IRequestHandler<UpdateRealEstateTypeFeatureValueCommand, RealEstateTypeFeatureValueReturnDto>
    {
        private readonly IWriteRepository<RealEstateTypeFeatureValue> _repository;
        private readonly IMapper _mapper;

        public UpdateRealEstateTypeFeatureValueCommandHandler(IWriteRepository<RealEstateTypeFeatureValue> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<RealEstateTypeFeatureValueReturnDto> Handle(UpdateRealEstateTypeFeatureValueCommand request, CancellationToken cancellationToken)
        {
            var value = _mapper.Map<RealEstateTypeFeatureValue>(request);

            await _repository.Update(value);

            return _mapper.Map<RealEstateTypeFeatureValueReturnDto>(value);
        }
    }
}

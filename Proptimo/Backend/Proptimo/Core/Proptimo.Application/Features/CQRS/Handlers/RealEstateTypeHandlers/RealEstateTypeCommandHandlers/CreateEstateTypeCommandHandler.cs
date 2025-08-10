using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateTypeHandlers.RealEstateTypeCommandHandlers
{
    public class CreateEstateTypeCommandHandler : IRequestHandler<CreateEstateTypeCommand, RealEstateTypeReturnDto>
    {
        private readonly IWriteRepository<RealEstateType> _repository;
        private readonly IMapper _mapper;

        public CreateEstateTypeCommandHandler(IWriteRepository<RealEstateType> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<RealEstateTypeReturnDto> Handle(CreateEstateTypeCommand request, CancellationToken cancellationToken)
        {
            var type = _mapper.Map<RealEstateType>(request);

            await _repository.AddAsync(type);

            return _mapper.Map<RealEstateTypeReturnDto>(type);
        }
    }
}

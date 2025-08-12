using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateAddressHandlers.RealEstateAddressCommandHandlers
{
    public class CreateAddressCommandHandler : IRequestHandler<CreateAddressCommand, RealEstateAddressReturnDto>
    {
        private readonly IWriteRepository<RealEstateAddress> _repository;
        private readonly IMapper _mapper;

        public CreateAddressCommandHandler(IWriteRepository<RealEstateAddress> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<RealEstateAddressReturnDto> Handle(CreateAddressCommand request, CancellationToken cancellationToken)
        {
            var address = _mapper.Map<RealEstateAddress>(request);

            await _repository.AddAsync(address);

            return _mapper.Map<RealEstateAddressReturnDto>(address);
        }
    }
}

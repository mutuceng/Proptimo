using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateAddressHandlers.RealEstateAddressCommandHandlers
{
    public class UpdateAddressCommandHandler : IRequestHandler<UpdateAddressCommand>
    {
        private readonly IWriteRepository<RealEstateAddress> _repository;
        private readonly IMapper _mapper;

        public UpdateAddressCommandHandler(IWriteRepository<RealEstateAddress> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
        {
            var updatedAddress = _mapper.Map<RealEstateAddress>(request);

            await _repository.Update(updatedAddress);
        }
    }
}

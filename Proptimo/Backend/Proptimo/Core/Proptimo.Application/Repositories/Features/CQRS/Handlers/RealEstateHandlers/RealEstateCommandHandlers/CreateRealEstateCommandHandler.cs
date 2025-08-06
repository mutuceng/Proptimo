using AutoMapper;
using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Handlers.RealEstateHandlers.RealEstateCommandHandlers
{
    public class CreateRealEstateCommandHandler : IRequestHandler<CreateRealEstateCommand>
    {
        private readonly IWriteRepository<RealEstate> _repository;
        private readonly IMapper _mapper;

        public CreateRealEstateCommandHandler(IWriteRepository<RealEstate> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Handle(CreateRealEstateCommand request, CancellationToken cancellationToken)
        {
            var RealEstate = _mapper.Map<RealEstate>(request);

            await _repository.AddAsync(RealEstate);
        }
    }
}

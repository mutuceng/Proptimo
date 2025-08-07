using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateTypeHandlers.RealEstateTypeCommandHandlers
{
    public class UpdateEstateTypeCommandHandler : IRequestHandler<UpdateEstateTypeCommand>
    {
        private readonly IWriteRepository<RealEstateType> _repository;
        private readonly IMapper _mapper;

        public UpdateEstateTypeCommandHandler(IWriteRepository<RealEstateType> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Handle(UpdateEstateTypeCommand request, CancellationToken cancellationToken)
        {
            var type = _mapper.Map<RealEstateType>(request);

            await _repository.Update(type);
        }
    }
}

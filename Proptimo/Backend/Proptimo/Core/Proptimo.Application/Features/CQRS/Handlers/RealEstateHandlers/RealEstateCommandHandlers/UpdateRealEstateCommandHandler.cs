using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateHandlers.RealEstateCommandHandlers
{
    public class UpdateRealEstateCommandHandler : IRequestHandler<UpdateRealEstateCommand, RealEstateReturnDto>
    {
        private readonly IWriteRepository<RealEstate> _repository;
        private readonly IMapper _mapper;

        public UpdateRealEstateCommandHandler(IWriteRepository<RealEstate> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<RealEstateReturnDto> Handle(UpdateRealEstateCommand request, CancellationToken cancellationToken)
        {
            var RealEstate = _mapper.Map<RealEstate>(request);

            await _repository.Update(RealEstate);

            return _mapper.Map<RealEstateReturnDto>(RealEstate);
        }
    }
}

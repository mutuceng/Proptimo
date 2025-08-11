using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities.Address;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.CsvLocationHandlers.CsvLocationCommandHandlers
{
    public class CreateDistrictCommandHandler : IRequestHandler<CreateDistrictCommand>
    {
        private readonly IWriteRepository<District> _repository;
        private readonly IMapper _mapper;

        public CreateDistrictCommandHandler(IWriteRepository<District> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Handle(CreateDistrictCommand request, CancellationToken cancellationToken)
        {
            if (request.Districts == null || !request.Districts.Any())
            {
                throw new ArgumentException("İlçe bilgileri boş olamaz.");
            }

            var districts = _mapper.Map<List<District>>(request.Districts);
            await _repository.AddRangeAsync(districts);
        }
    }
}

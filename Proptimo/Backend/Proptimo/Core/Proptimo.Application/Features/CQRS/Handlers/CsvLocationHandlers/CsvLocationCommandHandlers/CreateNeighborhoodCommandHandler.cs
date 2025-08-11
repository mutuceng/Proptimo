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
    public class CreateNeighborhoodCommandHandler : IRequestHandler<CreateNeighborhoodCommand>
    {
        private readonly IWriteRepository<Neighborhood> _repository;
        private readonly IMapper _mapper;

        public CreateNeighborhoodCommandHandler(IWriteRepository<Neighborhood> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task Handle(CreateNeighborhoodCommand request, CancellationToken cancellationToken)
        {
            if (request.Neighborhoods == null || !request.Neighborhoods.Any())
            {
                throw new ArgumentException("Mahalle bilgileri boş olamaz.");
            }

            var neighborhoods = _mapper.Map<List<Neighborhood>>(request.Neighborhoods);
            await _repository.AddRangeAsync(neighborhoods);
        }
    }
}

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
    public class CreateCityCommandHandler : IRequestHandler<CreateCityCommand>
    {
        private readonly IWriteRepository<City> _repository;

        public CreateCityCommandHandler(IWriteRepository<City> repository)
        {
            _repository = repository;
        }

        public async Task Handle(CreateCityCommand request, CancellationToken cancellationToken)
        {
            if (request.Names == null || !request.Names.Any())
            {
                throw new ArgumentException("Şehir isimleri boş olamaz.");
            }

            var cities = request.Names.Select(name => new City { Name = name }).ToList();
            await _repository.AddRangeAsync(cities);
        }
    }
}

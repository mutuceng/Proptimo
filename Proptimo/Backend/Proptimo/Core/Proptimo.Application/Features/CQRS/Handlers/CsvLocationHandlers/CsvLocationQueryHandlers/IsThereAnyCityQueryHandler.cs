using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Queries.CsvLocationQueries;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities.Address;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.CsvLocationHandlers.CsvLocationQueryHandlers
{
    public class IsThereAnyCityQueryHandler : IRequestHandler<IsThereAnyCityQuery, bool>
    {
        private readonly IReadRepository<City> _repository;

        public IsThereAnyCityQueryHandler(IReadRepository<City> repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(IsThereAnyCityQuery request, CancellationToken cancellationToken)
        {
            var result = await _repository.AnyAsync();

            return result;
        }
    }
}

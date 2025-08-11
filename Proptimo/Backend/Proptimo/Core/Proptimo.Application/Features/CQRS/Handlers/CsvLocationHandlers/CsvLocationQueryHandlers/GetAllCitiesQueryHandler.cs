using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Queries.CsvLocationQueries;
using Proptimo.Application.Features.CQRS.Results.CsvLocationQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities.Address;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.CsvLocationHandlers.CsvLocationQueryHandlers
{
    public class GetAllCitiesQueryHandler : IRequestHandler<GetAllCitiesQuery, List<CityDto>>
    {
        private readonly IReadRepository<City> _repository;
        private readonly IMapper _mapper;

        public GetAllCitiesQueryHandler(IReadRepository<City> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<CityDto>> Handle(GetAllCitiesQuery request, CancellationToken cancellationToken)
        {
            var cities = await _repository.GetAllAsync();

            return _mapper.Map<List<CityDto>>(cities);
        }
    }
}

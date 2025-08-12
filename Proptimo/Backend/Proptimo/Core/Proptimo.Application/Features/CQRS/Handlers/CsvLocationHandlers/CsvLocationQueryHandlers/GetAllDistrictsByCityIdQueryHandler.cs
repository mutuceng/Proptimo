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
    public class GetAllDistrictsByCityIdQueryHandler : IRequestHandler<GetAllDistrictsByCityIdQuery, List<DistrictDto>>
    {
        private readonly IReadRepository<District> _repository;
        private readonly IMapper _mapper;

        public GetAllDistrictsByCityIdQueryHandler(IReadRepository<District> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<DistrictDto>> Handle(GetAllDistrictsByCityIdQuery request, CancellationToken cancellationToken)
        {
            var distritcs = _repository.GetWhere( dst => dst.CityId == request.CityId );

            var orderedDistritcs = distritcs.OrderBy(c => c.Name).ToList();

            return _mapper.Map<List<DistrictDto>>(orderedDistritcs);
        }
    }
}

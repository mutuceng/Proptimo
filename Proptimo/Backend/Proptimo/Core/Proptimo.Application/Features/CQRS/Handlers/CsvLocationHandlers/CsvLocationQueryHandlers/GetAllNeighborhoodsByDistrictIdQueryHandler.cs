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
    public class GetAllNeighborhoodsByDistrictIdQueryHandler : IRequestHandler<GetAllNeighborhoodsByDistrictIdQuery, List<NeighborhoodDto>>
    {
        private readonly IReadRepository<Neighborhood> _repository;
        private readonly IMapper _mapper;

        public GetAllNeighborhoodsByDistrictIdQueryHandler(IReadRepository<Neighborhood> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<NeighborhoodDto>> Handle(GetAllNeighborhoodsByDistrictIdQuery request, CancellationToken cancellationToken)
        {
            var neighborhoods = _repository.GetWhere( a => a.DistrictId == request.DistrictId );

            return _mapper.Map<List<NeighborhoodDto>>( neighborhoods );
        }
    }
}

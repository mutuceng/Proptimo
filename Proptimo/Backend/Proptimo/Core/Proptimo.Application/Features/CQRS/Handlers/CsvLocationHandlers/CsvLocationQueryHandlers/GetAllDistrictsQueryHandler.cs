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
    public class GetAllDistrictsQueryHandler : IRequestHandler<GetAllDistrictsQuery, List<DistrictDto>>
    {
        private readonly IReadRepository<District> _repository;
        private readonly IMapper _mapper;

        public GetAllDistrictsQueryHandler(IReadRepository<District> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<DistrictDto>> Handle(GetAllDistrictsQuery request, CancellationToken cancellationToken)
        {
            var districts = await _repository.GetAllAsync();

            return _mapper.Map<List<DistrictDto>>(districts);
            
        }
    }
}

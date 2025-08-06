using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateQueries;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Handlers.RealEstateHandlers.RealEstateQueryHandlers
{
    public class GetAllRealEstatesQueryHandler : IRequestHandler<GetAllRealEstatesQuery, List<GetAllEstatesQueryResult>>
    {
        private readonly IReadRepository<RealEstate> _repository;
        private readonly IMapper _mapper;

        public GetAllRealEstatesQueryHandler(IReadRepository<RealEstate> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<GetAllEstatesQueryResult>> Handle(GetAllRealEstatesQuery request, CancellationToken cancellationToken)
        {
            var list = await _repository.GetAllAsync();

            return _mapper.Map<List<GetAllEstatesQueryResult>>(list);
        }
    }
}

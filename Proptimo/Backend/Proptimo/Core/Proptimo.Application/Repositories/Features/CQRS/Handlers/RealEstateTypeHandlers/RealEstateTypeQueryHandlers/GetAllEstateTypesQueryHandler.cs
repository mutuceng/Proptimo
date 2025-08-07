using AutoMapper;
using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateTypeQueries;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateTypeQueryResults;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Handlers.RealEstateTypeHandlers.RealEstateTypeQueryHandlers
{
    public class GetAllEstateTypesQueryHandler : IRequestHandler<GetAllEstateTypesQuery, List<GetAllEstateTypesQueryResult>>
    {
        private readonly IReadRepository<RealEstateType> _repository;
        private readonly IMapper _mapper;

        public GetAllEstateTypesQueryHandler(IReadRepository<RealEstateType> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<GetAllEstateTypesQueryResult>> Handle(GetAllEstateTypesQuery request, CancellationToken cancellationToken)
        {
            var types = await _repository.GetAllAsync();

            return _mapper.Map<List<GetAllEstateTypesQueryResult>>(types);
        }
    }
}

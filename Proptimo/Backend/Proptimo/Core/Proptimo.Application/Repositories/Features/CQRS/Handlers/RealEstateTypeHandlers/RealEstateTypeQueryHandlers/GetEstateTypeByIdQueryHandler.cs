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
    public class GetEstateTypeByIdQueryHandler : IRequestHandler<GetEstateTypeByIdQuery, GetEstateTypeByIdQueryResult>
    {
        private readonly IReadRepository<RealEstateType> _repository;
        private readonly IMapper _mapper;

        public GetEstateTypeByIdQueryHandler(IReadRepository<RealEstateType> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<GetEstateTypeByIdQueryResult> Handle(GetEstateTypeByIdQuery request, CancellationToken cancellationToken)
        {
            var type = await _repository.GetByIdAsync(request.Id);

            return _mapper.Map<GetEstateTypeByIdQueryResult>(type);
        }
    }
}

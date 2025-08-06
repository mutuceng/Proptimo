using AutoMapper;
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
    public class GetRealEstateByIdQueryHandler : IRequestHandler<GetRealEstateByIdQuery, GetEstateByIdQueryResult>
    {
        private readonly IReadRepository<RealEstate> _repository;
        private readonly IMapper _mapper;

        public GetRealEstateByIdQueryHandler(IReadRepository<RealEstate> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<GetEstateByIdQueryResult> Handle(GetRealEstateByIdQuery request, CancellationToken cancellationToken)
        {
            var realEstate = await _repository.GetByIdAsync(request.Id);

            return _mapper.Map<GetEstateByIdQueryResult>(realEstate);
        }
    }
}

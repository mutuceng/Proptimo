using AutoMapper;
using MediatR;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureValueQueries;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureValueQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateTypeFeatureValueHandlers.RealEstateTypeFeatureValueQueryHandlers
{
    public class GetRealEstateTypeFeatureValuesByEstateIdQueryHandler : IRequestHandler<GetRealEstateTypeFeatureValuesByEstateIdQuery, List<GetRealEstateTypeFeatureValuesByEstateIdQueryResult>>
    {
        private readonly IReadRepository<RealEstateTypeFeatureValue> _repository;
        private readonly IMapper _mapper;

        public GetRealEstateTypeFeatureValuesByEstateIdQueryHandler(IReadRepository<RealEstateTypeFeatureValue> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<GetRealEstateTypeFeatureValuesByEstateIdQueryResult>> Handle(GetRealEstateTypeFeatureValuesByEstateIdQuery request, CancellationToken cancellationToken)
        {
            var values = _repository.GetWhere((val) => val.RealEstateId == request.EstateId);

            return _mapper.Map<List<GetRealEstateTypeFeatureValuesByEstateIdQueryResult>>(values);
        }
    }
}

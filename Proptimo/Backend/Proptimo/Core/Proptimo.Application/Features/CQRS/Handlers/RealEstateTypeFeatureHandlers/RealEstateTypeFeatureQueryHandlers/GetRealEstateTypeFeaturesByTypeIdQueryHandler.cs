using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureQueries;
using Proptimo.Application.Features.CQRS.Results.RealEstateTypeFeatureQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateTypeFeatureHandlers.RealEstateTypeFeatureQueryHandlers
{
    public class GetRealEstateTypeFeaturesByTypeIdQueryHandler : IRequestHandler<GetRealEstateTypeFeaturesByTypeIdQuery, List<GetRealEstateTypeFeaturesByTypeIdQueryResult>>
    {
        private readonly IReadRepository<RealEstateTypeFeature> _repository;
        private readonly IMapper _mapper;

        public GetRealEstateTypeFeaturesByTypeIdQueryHandler(IReadRepository<RealEstateTypeFeature> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<GetRealEstateTypeFeaturesByTypeIdQueryResult>> Handle(GetRealEstateTypeFeaturesByTypeIdQuery request, CancellationToken cancellationToken)
        {
            var typeFeatures =  _repository.GetWhere(tf => tf.RealEstateTypeId == request.RealEstateTypeId);

            var result = await typeFeatures
                .ProjectTo<GetRealEstateTypeFeaturesByTypeIdQueryResult>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return result;
        }
    }
}

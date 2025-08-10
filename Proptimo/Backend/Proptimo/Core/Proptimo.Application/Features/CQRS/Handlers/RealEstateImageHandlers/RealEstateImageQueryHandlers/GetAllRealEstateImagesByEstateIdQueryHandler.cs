using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Proptimo.Application.Features.CQRS.Queries.RealEstateImageQueries;
using Proptimo.Application.Features.CQRS.Results.RealEstateImageQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateImageHandlers.RealEstateImageQueryHandlers
{
    public class GetAllRealEstateImagesByEstateIdQueryHandler : IRequestHandler<GetAllRealEstateImagesByEstateIdQuery, List<GetAllRealEstateImagesByEstateIdQueryResult>>
    {
        private IReadRepository<RealEstateImage> _repository;
        private IMapper _mapper;

        public GetAllRealEstateImagesByEstateIdQueryHandler(IReadRepository<RealEstateImage> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<GetAllRealEstateImagesByEstateIdQueryResult>> Handle(GetAllRealEstateImagesByEstateIdQuery request, CancellationToken cancellationToken)
        {
            var images = await _repository.GetWhere(img => img.RealEstateId == request.RealEstateId)
                .ProjectTo<GetAllRealEstateImagesByEstateIdQueryResult>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return images;
        }
    }
}

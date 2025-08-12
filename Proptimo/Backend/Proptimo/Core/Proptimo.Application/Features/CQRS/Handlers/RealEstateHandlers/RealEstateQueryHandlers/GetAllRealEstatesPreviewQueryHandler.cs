using MediatR;
using Microsoft.EntityFrameworkCore;
using Proptimo.Application.Features.CQRS.Queries.RealEstateQueries;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateHandlers.RealEstateQueryHandlers
{
    public class GetAllRealEstatesPreviewQueryHandler : IRequestHandler<GetAllRealEstatesPreviewQuery, List<GetAllRealEstatesPreviewQueryResult>>
    {
        private readonly IReadRepository<RealEstate> _estateRepository;

        public GetAllRealEstatesPreviewQueryHandler(IReadRepository<RealEstate> estateRepository)
        {
            _estateRepository = estateRepository;
        }

        public async Task<List<GetAllRealEstatesPreviewQueryResult>> Handle(GetAllRealEstatesPreviewQuery request, CancellationToken cancellationToken)
        {
            var query = _estateRepository.Table
                .Include(r => r.Images)
                .Include(r => r.RealEstateType)
                .Include(r => r.RealEstateAddress);

            var result = await query
                .Select(r => new GetAllRealEstatesPreviewQueryResult
                {
                    PrimaryImageUrl = r.Images.FirstOrDefault(i => i.IsPrimary).ImageUrl,
                    RealEstateTypeName = r.RealEstateType.Name,
                    RealEstateTitle = r.Title,
                    RealEstateStartDate = r.StartDate,
                    RealEstateEndDate = r.EndDate,
                    Price = r.Price,
                    CityName = r.RealEstateAddress.CityName,
                    DistrictName = r.RealEstateAddress.DistrictName,
                    RealEstateListingType = r.ListingType,
                    RealEstateState = r.State
                }).ToListAsync();

            return result;
        }
    }
}

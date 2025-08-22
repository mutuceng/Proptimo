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
                .Include(r => r.RealEstateAddress)
                .AsQueryable();

            var filter = request.Filter;

            if (filter != null)
            {
                if (!string.IsNullOrEmpty(filter.RealEstateTypeName))
                    query = query.Where(r => r.RealEstateType.Name == filter.RealEstateTypeName);

                if (filter.MinPrice.HasValue && filter.MaxPrice.HasValue)
                    query = query.Where(r => r.Price >= filter.MinPrice && r.Price <= filter.MaxPrice);

                if (filter.RealEstateListingType.HasValue)
                    query = query.Where(r => r.ListingType == filter.RealEstateListingType.Value);

                if (!string.IsNullOrEmpty(filter.CityName))
                    query = query.Where(r => r.RealEstateAddress.CityName == filter.CityName);

                if (!string.IsNullOrEmpty(filter.DistrictName))
                    query = query.Where(r => r.RealEstateAddress.DistrictName == filter.DistrictName);

                if (filter.RealEstateStartDate.HasValue && filter.RealEstateEndDate.HasValue)
                {
                    var start = filter.RealEstateStartDate.Value;
                    var end = filter.RealEstateEndDate.Value;
                    query = query.Where(r => r.StartDate >= start && r.EndDate <= end);
                }

                if (filter.RealEstateState.HasValue)
                    query = query.Where(r => r.State == filter.RealEstateState.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var data = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(r => new GetAllRealEstatesPreviewQueryResult
                {
                    RealEstateId = r.Id,
                    PrimaryImageUrl = r.Images.FirstOrDefault(i => i.IsPrimary).ImageUrl,
                    RealEstateTypeName = r.RealEstateType.Name,
                    RealEstateTitle = r.Title,
                    RealEstateStartDate = r.StartDate,
                    RealEstateEndDate = r.EndDate,
                    Price = r.Price,
                    CityName = r.RealEstateAddress.CityName,
                    DistrictName = r.RealEstateAddress.DistrictName,
                    Latitude = r.RealEstateAddress.Latitude,
                    Longitude = r.RealEstateAddress.Longitude,
                    RealEstateState = r.State,
                    RealEstateListingType = r.ListingType
                }).ToListAsync(cancellationToken);

            return data;
        }
    }
}

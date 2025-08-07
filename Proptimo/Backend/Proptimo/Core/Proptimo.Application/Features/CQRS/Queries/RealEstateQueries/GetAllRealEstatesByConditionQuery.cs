using MediatR;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.RealEstateQueries
{
    public class GetAllRealEstatesByConditionQuery : IRequest<List<GetAllEstatesByConditionQueryResult>>
    {
        public string? Search { get; set; }
        public string? CityId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}

using MediatR;
using Proptimo.Application.Features.CQRS.Results.CsvLocationQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.CsvLocationQueries
{
    public class GetAllDistrictsByCityIdQuery : IRequest<List<DistrictDto>>
    {
        public string CityId { get; set; }
        public GetAllDistrictsByCityIdQuery(string cityId) { CityId = cityId; }
    }
}

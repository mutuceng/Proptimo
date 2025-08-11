using MediatR;
using Proptimo.Application.Features.CQRS.Results.CsvLocationQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.CsvLocationQueries
{
    public class GetAllNeighborhoodsByDistrictIdQuery : IRequest<List<NeighborhoodDto>>
    {
        public string DistrictId { get; set; }
        public GetAllNeighborhoodsByDistrictIdQuery (string districtId) { DistrictId = districtId; }
    }
}

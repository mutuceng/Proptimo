using MediatR;
using Proptimo.Application.Features.CQRS.Results.RealEstateImageQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.RealEstateImageQueries
{
    public class GetAllRealEstateImagesByEstateIdQuery : IRequest<List<GetAllRealEstateImagesByEstateIdQueryResult>>
    {
        public string RealEstateId { get; set; }
        public GetAllRealEstateImagesByEstateIdQuery(string id) { RealEstateId = id; }
    }
}

using MediatR;
using Proptimo.Application.Features.CQRS.Results.CsvLocationQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Queries.CsvLocationQueries
{
    public class GetAllCitiesQuery : IRequest<List<CityDto>>
    {
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.CsvLocationQueryResults
{
    public class DistrictDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CityId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.CommandQueryResults
{
    public class RealEstateImageReturnDto
    {
        public string Id { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
        public int Order { get; set; }

        public string RealEstateId { get; set; }
    }
}

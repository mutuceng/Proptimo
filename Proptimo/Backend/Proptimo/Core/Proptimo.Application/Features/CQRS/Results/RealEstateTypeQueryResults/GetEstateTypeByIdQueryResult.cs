using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.RealEstateTypeQueryResults
{
    public class GetEstateTypeByIdQueryResult
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}

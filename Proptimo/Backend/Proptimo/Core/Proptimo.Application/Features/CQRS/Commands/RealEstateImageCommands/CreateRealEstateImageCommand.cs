using MediatR;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateImageCommands
{
    public class CreateRealEstateImageCommand : IRequest<RealEstateImageReturnDto>
    {
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
        public int Order { get; set; }

        public string RealEstateId { get; set; }
    }
}

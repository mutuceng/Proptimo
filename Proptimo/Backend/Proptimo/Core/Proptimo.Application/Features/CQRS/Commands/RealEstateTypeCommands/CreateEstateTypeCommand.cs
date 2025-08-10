using MediatR;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateTypeCommands
{
    public class CreateEstateTypeCommand : IRequest<RealEstateTypeReturnDto>
    {
        public string Name { get; set; }
    }
}

using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateTypeCommands
{
    public class CreateEstateTypeCommand : IRequest
    {
        public string Name { get; set; }
    }
}

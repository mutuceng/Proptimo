using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateCommands
{
    public class DeleteRealEstateCommand : IRequest
    {
        public string Id { get; set; }
    }
}

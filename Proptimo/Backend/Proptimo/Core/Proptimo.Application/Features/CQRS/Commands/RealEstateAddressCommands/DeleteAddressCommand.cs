using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands
{
    public class DeleteAddressCommand: IRequest
    {
        public string Id { get; set; }
        public DeleteAddressCommand (string id)
        {
            Id = id;
        }

    }
}

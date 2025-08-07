using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateTypeCommands
{
    public class DeleteEstateTypeCommand : IRequest
    {
        public string Id { get; set; }
        public DeleteEstateTypeCommand(string id)
        {
            Id = id;
        }
    }
}

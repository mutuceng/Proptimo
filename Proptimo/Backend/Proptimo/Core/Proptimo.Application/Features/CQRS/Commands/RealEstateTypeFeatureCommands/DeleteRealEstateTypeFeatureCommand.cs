using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureCommands
{
    public class DeleteRealEstateTypeFeatureCommand: IRequest
    {
        public string Id { get; set; }
        public DeleteRealEstateTypeFeatureCommand(string id)
        {
           Id = id;
        }
    }
}

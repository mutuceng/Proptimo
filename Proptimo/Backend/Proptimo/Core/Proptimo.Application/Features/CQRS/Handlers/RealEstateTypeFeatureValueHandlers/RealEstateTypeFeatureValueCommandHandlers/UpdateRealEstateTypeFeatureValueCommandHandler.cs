using MediatR;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureValueCommands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateTypeFeatureValueHandlers.RealEstateTypeFeatureValueCommandHandlers
{
    public class UpdateRealEstateTypeFeatureValueCommandHandler : IRequestHandler<UpdateRealEstateTypeFeatureValueCommand>
    {
        public Task Handle(UpdateRealEstateTypeFeatureValueCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}

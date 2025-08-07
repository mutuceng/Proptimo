using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateTypeQueries;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateTypeQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.ApiServices.RealEstateTypeServices
{
    public class RealEstateTypeService : IRealEstateTypeService
    {
        private readonly IMediator _mediator;

        public RealEstateTypeService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<bool> CreateAsync(CreateEstateTypeCommand command)
        {
            await _mediator.Send(command);
            return true;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var command = new DeleteEstateTypeCommand(id);
            await _mediator.Send(command);
            return true;
        }

        public async Task<List<GetAllEstateTypesQueryResult>> GetAllAsync()
        {
            var types = await _mediator.Send(new GetAllEstateTypesQuery());

            return types;
        }

        public async Task<GetEstateTypeByIdQueryResult?> GetByIdAsync(string id)
        {
            var type = await _mediator.Send(new GetEstateTypeByIdQuery(id));

            return type;
        }

        public async Task<bool> UpdateAsync(UpdateEstateTypeCommand command)
        {
            await _mediator.Send(command);
            return true;
        }
    }
}

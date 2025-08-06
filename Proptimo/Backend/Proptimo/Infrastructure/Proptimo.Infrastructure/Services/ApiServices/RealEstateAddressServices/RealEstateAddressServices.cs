using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateAddressQueries;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateAddressQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.ApiServices.RealEstateAddressServices
{
    public class RealEstateAddressServices : IRealEstateAddressServices
    {
        private IMediator _mediator;

        public RealEstateAddressServices(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<bool> CreateAsync(CreateAddressCommand command)
        {
            await _mediator.Send(command);
            return true;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            await _mediator.Send(new DeleteAddressCommand(id));
            return true;
        }

        public async Task<List<GetAllAdressQueryResult>> GetAllAsync()
        {
            var addresses = await _mediator.Send(new GetAllAddressQuery());

            return addresses;
        }

        public async Task<GetAddressByIdQueryResult?> GetByIdAsync(string id)
        {
            var address = await _mediator.Send(new GetAddressByIdQuery(id));

            return address;
        }

        public async Task<bool> UpdateAsync(UpdateAddressCommand command)
        {
            await _mediator.Send(command);
            return true;
        }
    }
}

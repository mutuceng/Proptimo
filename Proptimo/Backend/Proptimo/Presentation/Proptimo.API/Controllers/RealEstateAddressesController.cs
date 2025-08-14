using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateAddressQueries;
using System.Threading.Tasks;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateAddressesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RealEstateAddressesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAddresses()
        {
            var addresses = await _mediator.Send(new GetAllAddressQuery());
            return Ok(addresses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAddressById(string id)
        {
            var address = await _mediator.Send(new GetAddressByIdQuery(id));
            return Ok(address);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(string id)
        {
            await _mediator.Send( new DeleteAddressCommand(id));
            return Ok("Basarıyla silindi.");
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAddress(CreateAddressCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAddress (UpdateAddressCommand command)
        {
            await _mediator.Send(command);

            return Ok("Basariyla güncellendi.");
        }
    }
}

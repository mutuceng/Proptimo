using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeQueries;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateTypesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RealEstateTypesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEstateTypes()
        {
            var realEstates = await _mediator.Send(new GetAllEstateTypesQuery());
            return Ok(realEstates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEstateTypeById(string id)
        {
            var realEstate = await _mediator.Send(new GetEstateTypeByIdQuery(id));
            if (realEstate == null)
            {
                return NotFound();
            }
            return Ok(realEstate);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEstateType(CreateEstateTypeCommand command)
        {
            var result = await _mediator.Send(command);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEstateType(string id)
        {
            await _mediator.Send(new DeleteEstateTypeCommand(id));

            return Ok((new { success = true }));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEstateType(UpdateEstateTypeCommand command)
        {
            await _mediator.Send(command);
            return Ok("Basarıyla güncellendi. ");
        }
    }
}

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateQueries;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstatesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RealEstatesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRealEstates()
        {
            var realEstates = await _mediator.Send(new GetAllRealEstatesQuery());
            return Ok(realEstates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRealEstateById(string id)
        {
            var realEstate = await _mediator.Send(new GetRealEstateByIdQuery(id));
            if(realEstate == null)
            {
                return NotFound();
            }
            return Ok(realEstate);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRealEstate(CreateRealEstateCommand command)
        {
            var result = await _mediator.Send(command);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRealEstate(string id)
        {
            await _mediator.Send(new DeleteRealEstateCommand { Id = id });

            return Ok((new { success = true }));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRealEstate(UpdateRealEstateCommand command)
        {
            await _mediator.Send(command);
            return Ok("Basarıyla güncellendi.");
        }
    }
}

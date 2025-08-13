using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureQueries;


namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateTypeFeaturesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RealEstateTypeFeaturesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEstateTypeFeatureByTypeId(string id)
        {
            var features = await _mediator.Send(new GetRealEstateTypeFeaturesByTypeIdQuery(id));
            return Ok(features);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEstateTypeFeature(string id)
        {
            await _mediator.Send(new DeleteRealEstateTypeFeatureCommand(id));
            return Ok((new { success = true }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateEstateTypeFeature(CreateRealEstateTypeFeatureCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEstateTypeFeature(UpdateRealEstateTypeFeatureCommand command)
        {
            await _mediator.Send(command);

            return Ok("Basariyla güncellendi.");
        }
    }
}

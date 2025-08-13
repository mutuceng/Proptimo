using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureValueCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureValueQueries;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateTypeFeatureValuesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RealEstateTypeFeatureValuesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEstateTypeFeatureValue(List<CreateRealEstateTypeFeatureValueCommand> commands)
        {
            var returnedList = new List<RealEstateTypeFeatureValueReturnDto>();
            foreach(var cmd in commands)
            {
                returnedList.Add(await _mediator.Send(cmd));
            }
            
            return Ok(returnedList);
        }

        [HttpPut]
        public async Task<IActionResult> CreateEstateTypeFeatureValue(List<UpdateRealEstateTypeFeatureValueCommand> commands)
        {
            var returnedList = new List<RealEstateTypeFeatureValueReturnDto>();
            foreach (var cmd in commands)
            {
                returnedList.Add(await _mediator.Send(cmd));
            }

            return Ok(returnedList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEstateTypeFeatureValueByEstateId(string id)
        {
            var values = await _mediator.Send(new GetRealEstateTypeFeatureValuesByEstateIdQuery(id));
            return Ok(values);
        }
    }
}

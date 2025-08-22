using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Dtos.FilterDtos;
using Proptimo.Application.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateAddressQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateImageQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureValueQueries;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateImageQueryResults;

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

        [HttpGet("allpreview")]
        public async Task<IActionResult> GetAllRealEstatesPreview([FromQuery] FilterDtoRequest request)
        {

            var realEstates = await _mediator.Send(new GetAllRealEstatesPreviewQuery { Filter = request });

            return Ok(realEstates);
        }

        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetRealEstateDetail(string id)
        {
            var realEstate = await _mediator.Send(new GetRealEstateByIdQuery(id));
            if(realEstate == null)
            {
                return NotFound();
            }
            var address = await _mediator.Send(new GetAddressByEstateIdQuery(id));
            var images = await _mediator.Send(new GetAllRealEstateImagesByEstateIdQuery(id));
            var featureValues = await _mediator.Send(new GetRealEstateTypeFeatureValuesByEstateIdQuery(id));
            var features = await _mediator.Send(new GetRealEstateTypeFeaturesByTypeIdQuery(realEstate.RealEstateTypeId));
            var RealEstateDetail = new RealEstateDetailReturnDto
            {
                RealEstate = realEstate,
                Address = address,
                Images = images,
                FeatureValues = featureValues,
                Features = features
            };
            return Ok(RealEstateDetail);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetRealEstateById(string id)
        {
            var realEstate = await _mediator.Send(new GetRealEstateByIdQuery(id));
            if (realEstate == null)
            {
                return NotFound();
            }


            return Ok(realEstate);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRealEstate(CreateRealEstateCommand command)
        {
            var result = await _mediator.Send(command);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRealEstate(string id)
        {
            await _mediator.Send(new DeleteRealEstateCommand { Id = id });

            return Ok((new { success = true }));
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRealEstate(UpdateRealEstateCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}

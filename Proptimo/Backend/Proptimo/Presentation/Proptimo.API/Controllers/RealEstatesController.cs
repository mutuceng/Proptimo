using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Proptimo.Application.Dtos;
using Proptimo.Application.Dtos.FilterDtos;
using Proptimo.Application.Dtos.ImageDtos;
using Proptimo.Application.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateAddressQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateImageQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureQueries;
using Proptimo.Application.Features.CQRS.Queries.RealEstateTypeFeatureValueQueries;


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
            var RealEstateDetail = new Application.Features.CQRS.Results.CommandQueryResults.RealEstateDetailReturnDto
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
        public async Task<IActionResult> CreateRealEstate([FromForm] CreateEstateRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.JsonData))
            {
                return BadRequest("Invalid request data.");
            }
            var jsonData = JsonConvert.DeserializeObject<CreateRealEstateCommand>(request.JsonData);

            if (jsonData == null || jsonData.CreateEstateCommand == null || jsonData.CreateAddressCommand == null ||
                jsonData.CreateRealEstateTypeFeatureValueCommand == null || jsonData.UploadRealEstatePhotosDto == null)
            {
                return BadRequest("Invalid JSON data.");
            }

            var command = new CreateRealEstateCommand
            {
                CreateEstateCommand = jsonData.CreateEstateCommand,
                CreateAddressCommand = jsonData.CreateAddressCommand,
                CreateRealEstateTypeFeatureValueCommand = jsonData.CreateRealEstateTypeFeatureValueCommand,
                UploadRealEstatePhotosDto = new UploadRealEstatePhotosDto
                {
                    ImageFiles = request.Images?.ToList() ?? new List<IFormFile>(),
                    Commands = jsonData.UploadRealEstatePhotosDto.Commands
                }
            };

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
        public async Task<IActionResult> UpdateRealEstate(UpdateEstateRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.JsonData))
            {
                return BadRequest("Invalid request data.");
            }
            var jsonData = JsonConvert.DeserializeObject<UpdateRealEstateCommand>(request.JsonData);

            if (jsonData == null )
            {
                return BadRequest("Invalid JSON data.");
            }

            var command = new UpdateRealEstateCommand
            {
                RealEstateId = jsonData.RealEstateId,
                UpdateEstateCommand = jsonData.UpdateEstateCommand,
                UpdateAddressCommand = jsonData.UpdateAddressCommand,
                UpdateRealEstateTypeFeatureValueCommand = jsonData.UpdateRealEstateTypeFeatureValueCommand,
                UpdateRealEstatePhotosDto = jsonData.UpdateRealEstatePhotosDto != null ? 
                new UpdateRealEstatePhotosDto
                {
                    ImageFiles = request.Images?.ToList() ?? new List<IFormFile>(),
                    Commands = jsonData.UpdateRealEstatePhotosDto.Commands
                }
        : null
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}

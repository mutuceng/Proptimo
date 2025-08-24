using Azure.Core;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.ImageDtos;
using Proptimo.Application.Features.CQRS.Commands.RealEstateImageCommands;
using Proptimo.Application.Features.CQRS.Queries.RealEstateImageQueries;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateImagesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public RealEstateImagesController( IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{estateId}")]
        public async Task<IActionResult> GetImagesByEstateId(string estateId)
        {
            var images = await _mediator.Send(new GetAllRealEstateImagesByEstateIdQuery(estateId));

            return Ok(images);

        }
    }
}

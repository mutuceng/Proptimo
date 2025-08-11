using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Features.CQRS.Queries.CsvLocationQueries;
using Proptimo.Domain.Entities.Address;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationDatasController : ControllerBase
    {
        IMediator _mediator;

        public LocationDatasController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("getAllCities")]
        public async Task<IActionResult> GetAllCities() 
        {
            var cities = await _mediator.Send(new GetAllCitiesQuery());
            return Ok(cities);
        }

        [HttpGet("getAllDistricts/{cityId}")]
        public async Task<IActionResult> GetAllDistrictsByCityId(string cityId )
        {
            var districs = await _mediator.Send(new GetAllDistrictsByCityIdQuery(cityId));
            return Ok(districs);
        }

        [HttpGet("getAllNeighborhoods/{districtId}")]
        public async Task<IActionResult> GetAllNeighborhoodsByDistrictId(string districtId)
        {
            var neighborhoods = await _mediator.Send(new GetAllNeighborhoodsByDistrictIdQuery(districtId));
            return Ok(neighborhoods);
        }
    }
}

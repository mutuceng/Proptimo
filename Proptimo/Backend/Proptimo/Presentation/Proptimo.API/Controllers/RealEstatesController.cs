using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Infrastructure.Services.ApiServices.RealEstateServices;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstatesController : ControllerBase
    {
        private readonly IRealEstateService _service;

        public RealEstatesController(IRealEstateService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRealEstates()
        {
            var realEstates = await _service.GetAllAsync();
            return Ok(realEstates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRealEstateById(string id)
        {
            var realEstate = await _service.GetByIdAsync(id);
            if(realEstate == null)
            {
                return NotFound();
            }
            return Ok(realEstate);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRealEstate(CreateRealEstateCommand command)
        {
            await _service.CreateAsync(command);

            return Ok("Basarıyla eklendi.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRealEstate(string id)
        {
            var deletedEstate = await _service.DeleteAsync(id);

            return deletedEstate ? Ok("Basarıyla silindi.") : NotFound();   
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRealEstate(UpdateRealEstateCommand command)
        {
            await _service.UpdateAsync(command);
            return Ok("Basarıyla güncellendi. ");
        }
    }
}

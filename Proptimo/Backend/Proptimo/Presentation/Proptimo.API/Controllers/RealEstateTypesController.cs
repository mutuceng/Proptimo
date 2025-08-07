using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Infrastructure.Services.ApiServices.RealEstateTypeServices;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateTypesController : ControllerBase
    {
        private readonly IRealEstateTypeService _service;

        public RealEstateTypesController(IRealEstateTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEstateTypes()
        {
            var realEstates = await _service.GetAllAsync();
            return Ok(realEstates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEstateTypeById(string id)
        {
            var realEstate = await _service.GetByIdAsync(id);
            if (realEstate == null)
            {
                return NotFound();
            }
            return Ok(realEstate);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEstateType(CreateEstateTypeCommand command)
        {
            await _service.CreateAsync(command);

            return Ok("Basarıyla eklendi.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEstateType(string id)
        {
            var deletedEstate = await _service.DeleteAsync(id);

            return deletedEstate ? Ok("Basarıyla silindi.") : NotFound();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEstateType(UpdateEstateTypeCommand command)
        {
            await _service.UpdateAsync(command);
            return Ok("Basarıyla güncellendi. ");
        }
    }
}

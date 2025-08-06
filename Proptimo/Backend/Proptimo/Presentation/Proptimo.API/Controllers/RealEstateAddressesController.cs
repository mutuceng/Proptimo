using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Infrastructure.Services.ApiServices.RealEstateAddressServices;
using System.Threading.Tasks;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RealEstateAddressesController : ControllerBase
    {
        private readonly IRealEstateAddressServices _service;

        public RealEstateAddressesController(IRealEstateAddressServices service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAddresses()
        {
            var addresses = await _service.GetAllAsync();
            return Ok(addresses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAddressById(string id)
        {
            var address = await _service.GetByIdAsync(id);
            return Ok(address);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(string id)
        {
            await _service.DeleteAsync(id);
            return Ok("Basarıyla silindi.");
        }

        [HttpPost]
        public async Task<IActionResult> CreateAddress(CreateAddressCommand command)
        {
            await _service.CreateAsync(command);
            return Ok("Basariyla Eklendi");
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAddress (UpdateAddressCommand command)
        {
            await _service.UpdateAsync(command);

            return Ok("Basariyla güncellendi.");
        }
    }
}

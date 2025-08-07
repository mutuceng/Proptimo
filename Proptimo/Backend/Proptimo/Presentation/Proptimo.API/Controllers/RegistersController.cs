using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistersController : ControllerBase
    {
        private IMediator _mediator;

        public RegistersController(IMediator mediator)
        {
            _mediator = mediator;
        }


        [HttpPost]
        public async Task<IActionResult> Register(UserRegisterCommand command)
        {
            var result = await _mediator.Send(command);

            if(result.Succeeded)
            {
                return Ok("Kullanıcı kayıt işlemi başarılı");
            }

            return BadRequest();

            
        }
    }
}

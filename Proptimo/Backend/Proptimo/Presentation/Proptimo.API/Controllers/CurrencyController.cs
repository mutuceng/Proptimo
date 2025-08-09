using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Features.CQRS.Commands.CurrencyCommands;
using Proptimo.Application.Features.CQRS.Queries.CurrencyQueries;


namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CurrencyController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCurrencies()
        {
            var currencies = await _mediator.Send(new GetAllCurrenciesQuery());
            return Ok(currencies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCurrencyById(string id)
        {
            var currency = await _mediator.Send(new GetByIdCurrencyQuery(id));
            return Ok(currency);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCurrency(string id)
        {
            await _mediator.Send(new DeleteCurrencyCommand(id));
            return Ok(new { success = true });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCurrency(CreateCurrencyCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCurrency(UpdateCurrencyCommand command)
        {
            await _mediator.Send(command);

            return Ok("Basariyla güncellendi.");
        }
    }
}

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.CurrencyDtos;
using Proptimo.Application.Features.CQRS.Commands.CurrencyCommands;
using Proptimo.Application.Features.CQRS.Queries.CurrencyQueries;


namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IExternalCurrencyService _externalCurrencyService;

        public CurrencyController(IMediator mediator, IExternalCurrencyService externalCurrencyService)
        {
            _mediator = mediator;
            _externalCurrencyService = externalCurrencyService;
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCurrency(CreateCurrencyCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }


        [HttpPost("convert-to")]
        public async Task<IActionResult> ConvertCurrency(CurrencyConversionRequestDto dto)
        {
            var result = await _externalCurrencyService.ExchangeCurrencyAsync(dto);
            return Ok(result.Result);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCurrency(UpdateCurrencyCommand command)
        {
            await _mediator.Send(command);

            return Ok("Basariyla güncellendi.");
        }
    }
}

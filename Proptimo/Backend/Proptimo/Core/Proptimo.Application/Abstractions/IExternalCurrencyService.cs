using Proptimo.Application.Dtos.CurrencyDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Abstractions
{
    public interface IExternalCurrencyService
    {
        Task<List<CurrencySymbolsResponseDto>> GetAllCurrencySymbolsAsync();

        Task<CurrencyConversionResponseDto> ExchangeCurrencyAsync(CurrencyConversionRequestDto requestDto);
    }
}

using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.CurrencyDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services
{
    public class ExternalCurrencyService : IExternalCurrencyService
    {
        public Task<CurrencyConversionResponseDto> ExchangeCurrencyAsync(CurrencyConversionRequestDto requestDto)
        {
            throw new NotImplementedException();
        }

        public Task<List<CurrencySymbolsResponseDto>> GetAllCurrencySymbolsAsync()
        {
            throw new NotImplementedException();
        }
    }
}

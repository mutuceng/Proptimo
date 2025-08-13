using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
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
        private readonly HttpClient _httpClient;
        private readonly string _apiKey; // RapidAPI anahtarınızı buraya ekleyin
        private readonly string _apiHost;
        private readonly string _baseUrl;
        public ExternalCurrencyService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["CurrencyRapidApi:ApiKey"];
            _apiHost = configuration["CurrencyRapidApi:ApiHost"]; 
            _baseUrl = configuration["CurrencyRapidApi:BaseUrl"];

            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", _apiKey);
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", _apiHost);
        }

        public async Task<CurrencyConversionResponseDto> ExchangeCurrencyAsync(CurrencyConversionRequestDto requestDto)
        {
            string url = $"{_baseUrl}/convert?from={requestDto.From}&to={requestDto.To}&amount={requestDto.Amount}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            string jsonResponse = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<CurrencyConversionResponseDto>(jsonResponse);

            if(result.Success == true )
            {
                return result;
            }
            return new CurrencyConversionResponseDto();
        }

    }
}

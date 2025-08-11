using CsvHelper;
using CsvHelper.Configuration;
using MediatR;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.LocationDtos.CsvLocationDtos;
using Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands;
using Proptimo.Application.Features.CQRS.Queries.CsvLocationQueries;
using Proptimo.Application.Features.CQRS.Results.CsvLocationQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities.Address;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands.CreateDistrictCommand;
using static Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands.CreateNeighborhoodCommand;

namespace Proptimo.Infrastructure.Services
{
    public class AddressCsvToDbService : IAddressCsvToDbService
    {
        private readonly ILogger<AddressCsvToDbService> _logger;
        private readonly IWebHostEnvironment _environment;
        private IMediator _mediator;

        public AddressCsvToDbService(ILogger<AddressCsvToDbService> logger, IWebHostEnvironment environment, IMediator mediator)
        {
            _logger = logger;
            _environment = environment;
            _mediator = mediator;
        }

        public async Task<bool> ImportLocationDataAsync()
        {
            try
            {
                var dataPath = Path.Combine(_environment.ContentRootPath, "../..","Infrastructure/Proptimo.Infrastructure/Resources");
                var citiesPath = Path.Combine(dataPath, "iller.csv");
                var districtsPath = Path.Combine(dataPath, "ilceler.csv");
                var neighborhoodsPath = Path.Combine(dataPath, "mahalleler_ve_koyler.csv");

                if (!File.Exists(citiesPath))
                {
                    throw new FileNotFoundException($"Dosya bulunamadı: {citiesPath}");
                }
                var cityDtos = await ReadCsvAsync<CsvCityDto>(citiesPath);
                var addCitiesRange = new CreateCityCommand();
                var cityMapping = new Dictionary<int, string>();

                foreach (var city in cityDtos)
                {
                    addCitiesRange.Names.Add(city.name);
                }

                if (addCitiesRange.Names.Count > 0)
                {
                    await _mediator.Send(addCitiesRange);
                }

                var allCities = await _mediator.Send(new GetAllCitiesQuery());
                foreach (var city in cityDtos)
                {
                    var dbCity = allCities.FirstOrDefault(c => c.Name == city.name);
                    if (dbCity != null)
                    {
                        cityMapping[city.id] = dbCity.Id;
                    }
                }

                var districtDtos = await ReadCsvAsync<CsvDistrictDto>(districtsPath);
                var addDistrictRange = new CreateDistrictCommand();
                var districtMapping = new Dictionary<string, string>();

                foreach (var district in districtDtos)
                {
                    if (cityMapping.TryGetValue(district.city_id, out var cityId))
                    {
                        addDistrictRange.Districts.Add(new CreateDistricDto
                        {
                            CityId = cityId,
                            Name = district.name,
                        });
                    }
                }

                if (addDistrictRange.Districts.Count > 0) { await _mediator.Send(addDistrictRange); }

                var allDistricts = await _mediator.Send(new GetAllDistrictsQuery());
                foreach (var district in districtDtos)
                {
                    if (cityMapping.TryGetValue(district.city_id, out var cityId))
                    {
                        var dbDistrict = allDistricts.FirstOrDefault(d => d.Name == district.name && d.CityId == cityId);
                        if (dbDistrict != null)
                        {
                            districtMapping[(district.id).ToString()] = dbDistrict.Id;
                        }
                    }
                }

                var neighborhoodDtos = await ReadCsvAsync<CsvNeighborhoodDto>(neighborhoodsPath);
                var addRangeNeighborhoods = new CreateNeighborhoodCommand();

                foreach (var neighborhood in neighborhoodDtos)
                {
                    if (districtMapping.TryGetValue(neighborhood.county_id, out var districtId))
                    {
                        addRangeNeighborhoods.Neighborhoods.Add(new CreateNeighborhoodDto
                        {
                            Name = neighborhood.name,
                            DistrictId = districtId
                        });
                    }
                }

                if (addRangeNeighborhoods.Neighborhoods.Any())
                {
                    await _mediator.Send(addRangeNeighborhoods);
                }

                return true;
            }
            catch (Exception ex)
            {
                {
                    _logger.LogError(ex, "Import işlemi sırasında hata oluştu.");
                    return false;
                }
            }
        }

        public async Task<IEnumerable<T>> ReadCsvAsync<T>(string filePath) where T : class
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HeaderValidated = null,
                MissingFieldFound = null,
                Delimiter = ",",
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim, // Boşlukları temizle
                BadDataFound = null // Hatalı veri bulunduğunda hata verme
            };

            using var reader = new StreamReader(filePath, Encoding.UTF8);
            using var csv = new CsvReader(reader, config);

            var records = new List<T>();
            await foreach (var record in csv.GetRecordsAsync<T>())
            {
                records.Add(record);
            }

            return records;
        }

        public async Task SeedAsync()
        {
            try
            {
                if (await IsDatabaseSeededAsync())
                {
                    _logger.LogInformation("Veritabanı zaten doldurulmuş, seeding atlanıyor.");
                    return;
                }

                _logger.LogInformation("Veritabanı seeding başlatılıyor...");

                var success = await ImportLocationDataAsync();

                if (success)
                {
                    _logger.LogInformation("Seeding başarıyla tamamlandı.");
                }
                else
                {
                    _logger.LogError("Seeding başarısız oldu.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Seeding sırasında beklenmeyen hata oluştu.");
            }
        }

        public async Task<bool> IsDatabaseSeededAsync()
        {
            return await _mediator.Send(new IsThereAnyCityQuery());
        }
    }
}

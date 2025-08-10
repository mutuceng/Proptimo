using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Abstractions
{
    public interface IAddressCsvToDbService
    {
        Task<IEnumerable<T>> ReadCsvAsync<T>(string filePath) where T : class;
        Task SeedAsync();
        Task<bool> IsDatabaseSeededAsync();
        Task<bool> ImportLocationDataAsync();

    }
}

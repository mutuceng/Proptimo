using Proptimo.Application.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services
{
    public class AddressCsvToDbService : IAddressCsvToDbService
    {
        public Task<bool> ImportLocationDataAsync()
        {
            throw new NotImplementedException();
        }

        public Task<bool> IsDatabaseSeededAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<T>> ReadCsvAsync<T>(string filePath) where T : class
        {
            throw new NotImplementedException();
        }

        public Task SeedAsync()
        {
            throw new NotImplementedException();
        }
    }
}

using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateAddressQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.ApiServices.RealEstateAddressServices
{
    public interface IRealEstateAddressServices
    {
        Task<List<GetAllAdressQueryResult>> GetAllAsync();
        Task<GetAddressByIdQueryResult?> GetByIdAsync(string id);
        Task<bool> CreateAsync(CreateAddressCommand command);
        Task<bool> UpdateAsync(UpdateAddressCommand command);
        Task<bool> DeleteAsync(string id);
    }
}

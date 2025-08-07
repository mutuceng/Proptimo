using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateTypeCommands;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateTypeQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.ApiServices.RealEstateTypeServices
{
    public interface IRealEstateTypeService
    {
        Task<List<GetAllEstateTypesQueryResult>> GetAllAsync();
        Task<GetEstateTypeByIdQueryResult?> GetByIdAsync(string id);
        Task<bool> CreateAsync(CreateEstateTypeCommand command);
        Task<bool> UpdateAsync(UpdateEstateTypeCommand command);
        Task<bool> DeleteAsync(string id);
    }
}

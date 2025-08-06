using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.ApiServices.RealEstateServices
{
    public interface IRealEstateService
    {
        Task<List<GetAllEstatesQueryResult>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<GetEstateByIdQueryResult?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
        Task<bool> CreateAsync(CreateRealEstateCommand command, CancellationToken cancellationToken = default);
        Task<bool> UpdateAsync(UpdateRealEstateCommand command, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
    }
}

using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Commands.RealEstateCommands;
using Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateQueries;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateQueryResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.ApiServices.RealEstateServices
{
    public class RealEstateService : IRealEstateService
    {
        private readonly IMediator _mediator;

        public RealEstateService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<bool> CreateAsync(CreateRealEstateCommand command, CancellationToken cancellationToken = default)
        {
            await _mediator.Send(command, cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
        {
            var query = new DeleteRealEstateCommand { Id = id };

            await _mediator.Send(query, cancellationToken);
            return true;
        }

        public async Task<List<GetAllEstatesQueryResult>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var query = new GetAllRealEstatesQuery();

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<GetEstateByIdQueryResult?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
        {
            var query = new GetRealEstateByIdQuery(id);

            return await _mediator.Send(query, cancellationToken);
        }

        public Task<bool> UpdateAsync(UpdateRealEstateCommand command, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}

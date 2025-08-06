using AutoMapper;
using MediatR;
using Proptimo.Application.Repositories.Features.CQRS.Queries.RealEstateAddressQueries;
using Proptimo.Application.Repositories.Features.CQRS.Results.RealEstateAddressQueryResults;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories.Features.CQRS.Handlers.RealEstateAddressHandlers.RealEstateAddressQueryHandlers
{
    public class GetAddressByIdQueryHandler : IRequestHandler<GetAddressByIdQuery, GetAddressByIdQueryResult>
    {
        private readonly IReadRepository<RealEstateAddress> _repository;
        private readonly IMapper _mapper;

        public GetAddressByIdQueryHandler(IReadRepository<RealEstateAddress> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<GetAddressByIdQueryResult> Handle(GetAddressByIdQuery request, CancellationToken cancellationToken)
        {
            var address = await _repository.GetByIdAsync(request.Id);

            return _mapper.Map<GetAddressByIdQueryResult>(address);

        }
    }
}

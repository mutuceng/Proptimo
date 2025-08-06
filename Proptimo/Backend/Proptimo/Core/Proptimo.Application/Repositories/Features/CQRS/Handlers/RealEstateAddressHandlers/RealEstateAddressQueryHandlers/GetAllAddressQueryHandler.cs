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
    public class GetAllAddressQueryHandler : IRequestHandler<GetAllAddressQuery, List<GetAllAdressQueryResult>>
    {
        private readonly IReadRepository<RealEstateAddress> _repository;
        private readonly IMapper _mapper;

        public GetAllAddressQueryHandler(IReadRepository<RealEstateAddress> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<GetAllAdressQueryResult>> Handle(GetAllAddressQuery request, CancellationToken cancellationToken)
        {
            var addresses = await _repository.GetAllAsync();

            return _mapper.Map<List<GetAllAdressQueryResult>>(addresses);
        }
    }
}

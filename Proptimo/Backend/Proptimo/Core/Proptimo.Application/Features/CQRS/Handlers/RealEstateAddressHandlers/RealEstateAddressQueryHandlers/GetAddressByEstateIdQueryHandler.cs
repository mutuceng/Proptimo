using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Proptimo.Application.Features.CQRS.Queries.RealEstateAddressQueries;
using Proptimo.Application.Features.CQRS.Results.RealEstateAddressQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateAddressHandlers.RealEstateAddressQueryHandlers
{
    public class GetAddressByEstateIdQueryHandler : IRequestHandler<GetAddressByEstateIdQuery, GetAddressByEstateIdQueryResult>
    {
        private readonly IReadRepository<RealEstateAddress> _repository;
        private readonly IMapper _mapper;

        public GetAddressByEstateIdQueryHandler(IReadRepository<RealEstateAddress> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<GetAddressByEstateIdQueryResult> Handle(GetAddressByEstateIdQuery request, CancellationToken cancellationToken)
        {
            var address =  await _repository.GetWhere( add => add.RealEstateId == request.EstateId)
                                .ProjectTo<GetAddressByEstateIdQueryResult>(_mapper.ConfigurationProvider)
                                .FirstOrDefaultAsync(cancellationToken);


            return _mapper.Map<GetAddressByEstateIdQueryResult>(address);
        }
    }
}

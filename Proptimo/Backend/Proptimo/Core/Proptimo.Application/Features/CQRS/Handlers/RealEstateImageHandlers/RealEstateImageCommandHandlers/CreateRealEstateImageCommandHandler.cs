using AutoMapper;
using MediatR;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Features.CQRS.Commands.RealEstateImageCommands;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.RealEstateImageHandlers.RealEstateImageCommandHandlers
{
    public class CreateRealEstateImageCommandHandler : IRequestHandler<CreateRealEstateImageCommand, RealEstateImageReturnDto>
    {
        private readonly IWriteRepository<RealEstateImage> _repository;
        private readonly IMapper _mapper;

        public CreateRealEstateImageCommandHandler(IWriteRepository<RealEstateImage> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }


        public async Task<RealEstateImageReturnDto> Handle(CreateRealEstateImageCommand request, CancellationToken cancellationToken)
        {
            var image = _mapper.Map<RealEstateImage>(request);

            await _repository.AddAsync(image);

            return _mapper.Map<RealEstateImageReturnDto>(image);
        }
    }
}

using MediatR;
using Microsoft.AspNetCore.Http;
using Proptimo.Application.Dtos;
using Proptimo.Application.Dtos.ImageDtos;
using Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateImageCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureValueCommands;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateCommands
{
    public class CreateRealEstateCommand : IRequest<GetAllRealEstatesPreviewQueryResult>
    {
        public CreateEstateCommand CreateEstateCommand { get; set; }
        public CreateAddressCommand CreateAddressCommand { get; set; }
        public List<CreateRealEstateTypeFeatureValueCommand> CreateRealEstateTypeFeatureValueCommand { get; set; }
        public UploadRealEstatePhotosDto UploadRealEstatePhotosDto { get; set; }
    }
}

using MediatR;
using Proptimo.Application.Dtos;
using Proptimo.Application.Dtos.ImageDtos;
using Proptimo.Application.Features.CQRS.Commands.RealEstateAddressCommands;
using Proptimo.Application.Features.CQRS.Commands.RealEstateTypeFeatureValueCommands;
using Proptimo.Application.Features.CQRS.Results.CommandQueryResults;
using Proptimo.Application.Features.CQRS.Results.RealEstateQueryResults;
using Proptimo.Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.RealEstateCommands
{
    public class UpdateRealEstateCommand : IRequest<GetAllRealEstatesPreviewQueryResult>
    {
        [JsonPropertyName("realEstateId")]
        public string RealEstateId { get; set; }
        public UpdateEstateCommand? UpdateEstateCommand { get; set; }
        public UpdateAddressCommand? UpdateAddressCommand { get; set; }
        public List<UpdateRealEstateTypeFeatureValueCommand>? UpdateRealEstateTypeFeatureValueCommand { get; set; }
        public UpdateRealEstatePhotosDto? UpdateRealEstatePhotosDto { get; set; }
    }
}

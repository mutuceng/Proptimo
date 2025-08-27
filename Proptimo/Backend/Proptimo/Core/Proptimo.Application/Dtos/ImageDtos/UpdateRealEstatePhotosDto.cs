using Microsoft.AspNetCore.Http;
using Proptimo.Application.Features.CQRS.Commands.RealEstateImageCommands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Dtos.ImageDtos
{
    public class UpdateRealEstatePhotosDto
    {
        public List<UpdateRealEstateImageCommand>? Commands { get; set; }
        public List<IFormFile>? ImageFiles { get; set; }
    }
}

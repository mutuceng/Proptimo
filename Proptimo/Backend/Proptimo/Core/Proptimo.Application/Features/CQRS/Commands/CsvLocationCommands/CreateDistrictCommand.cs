using MediatR;
using Proptimo.Application.Dtos.LocationDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands
{
    public class CreateDistrictCommand : IRequest
    {
        public List<CreateDistricDto> Districts { get; set; } = new List<CreateDistricDto>();

        public class CreateDistricDto
        {
            public string Name { get; set; }
            public string CityId { get; set; }
        }
    }
}

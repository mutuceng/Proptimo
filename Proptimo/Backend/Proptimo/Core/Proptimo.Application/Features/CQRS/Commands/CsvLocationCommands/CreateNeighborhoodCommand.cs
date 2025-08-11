using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands
{
    public class CreateNeighborhoodCommand : IRequest
    {
        public List<CreateNeighborhoodDto> Neighborhoods { get; set; } = new List<CreateNeighborhoodDto>();
        public class CreateNeighborhoodDto
        {
            public string Name;
            public string DistrictId { get; set; }
        }
    }
}

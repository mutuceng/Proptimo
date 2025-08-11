using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.CsvLocationCommands
{
    public class CreateCityCommand : IRequest
    {
        public List<string> Names { get; set; } = new List<string>();
    }
}

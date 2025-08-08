using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.CurrencyCommands
{
    public class CreateCurrencyCommand : IRequest
    {
        public string Name { get; set; }
        public string Symbol { get; set; }
    }
}

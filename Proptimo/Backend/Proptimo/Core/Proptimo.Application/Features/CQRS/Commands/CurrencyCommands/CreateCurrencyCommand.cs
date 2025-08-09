using MediatR;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.CurrencyCommands
{
    public class CreateCurrencyCommand : IRequest<Currency>
    {
        public string Name { get; set; }
        public string Symbol { get; set; }
    }
}

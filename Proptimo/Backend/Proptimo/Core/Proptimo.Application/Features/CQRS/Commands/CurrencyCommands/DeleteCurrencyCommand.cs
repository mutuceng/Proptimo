using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.CurrencyCommands
{
    public class DeleteCurrencyCommand : IRequest
    {
        public string Id { get; set; }
        public DeleteCurrencyCommand (string id)
        {
            Id = id;
        }
    }
}

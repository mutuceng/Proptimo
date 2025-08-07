using MediatR;
using Proptimo.Application.Features.CQRS.Results.AppUserCommandResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.AppUserCommands
{
    public class UserLoginCommand : IRequest<UserLoginCommandResult>
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        
    }
}

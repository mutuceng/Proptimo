using MediatR;
using Proptimo.Application.Features.CQRS.Results.AppUserCommandResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Commands.AppUserCommands
{
    public class UserRegisterCommand : IRequest<UserRegisterCommandResult>
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public string? PhoneNumber { get; set; }
    }
}

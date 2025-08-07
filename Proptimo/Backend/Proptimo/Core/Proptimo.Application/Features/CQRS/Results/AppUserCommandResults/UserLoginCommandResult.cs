using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Results.AppUserCommandResults
{
    public class UserLoginCommandResult
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
    }
}

using FluentValidation;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Validators
{
    public class UserLoginValidator : AbstractValidator<UserLoginCommand>
    {
        public UserLoginValidator() 
        {
            RuleFor(x => x.Password).NotEmpty().WithMessage("Şifre boş olamaz.");

        }
    }
}

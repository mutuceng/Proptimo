using FluentValidation;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Validators
{
    public class UserRegisterValidator: AbstractValidator<UserRegisterCommand>
    {
        public UserRegisterValidator()
        {
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Şifre boş olamaz.")
                .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalı.")
                .Matches("[A-Z]").WithMessage("Şifre en az bir büyük harf içermeli.")
                .Matches("[a-z]").WithMessage("Şifre en az bir küçük harf içermeli.")
                .Matches("[0-9]").WithMessage("Şifre en az bir rakam içermeli.")
                .Matches("[^a-zA-Z0-9]").WithMessage("Şifre en az bir özel karakter içermeli.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email boş olamaz.")
                .EmailAddress().WithMessage("Geçerli bir email adresi giriniz.");

            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Kullanıcı adı boş olamaz.");
        }
    }
}

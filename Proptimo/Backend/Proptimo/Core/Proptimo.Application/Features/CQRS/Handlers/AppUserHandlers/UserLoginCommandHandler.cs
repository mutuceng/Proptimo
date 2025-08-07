using MediatR;
using Microsoft.AspNetCore.Identity;
using Proptimo.Application.Exceptions;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;
using Proptimo.Application.Features.CQRS.Results.AppUserCommandResults;
using Proptimo.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Features.CQRS.Handlers.AppUserHandlers
{
    public class UserLoginCommandHandler : IRequestHandler<UserLoginCommand, UserLoginCommandResult>
    {
        private readonly UserManager<AppUser> _userManager;

        public UserLoginCommandHandler(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<UserLoginCommandResult> Handle(UserLoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if(user == null)
            {
                user = await _userManager.FindByNameAsync(request.UserName);
            }

            if(user == null)
            {
                throw new UserNotFoundException("Email veya Kullanıcı Adı hatalı.");
            }

            var result = await _userManager.CheckPasswordAsync(user, request.Password);
            if(result == false)
            {
                throw new UserNotFoundException("Şifre hatalı.");
            }

            return new UserLoginCommandResult
            {
                Succeeded = true,
                Message = "Giriş işlemi başarılı"
            };
        }
    }
}

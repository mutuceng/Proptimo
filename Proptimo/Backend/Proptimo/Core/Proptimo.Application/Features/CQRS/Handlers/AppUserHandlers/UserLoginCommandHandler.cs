using MediatR;
using Microsoft.AspNetCore.Identity;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.AuthDtos;
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
        private readonly ITokenService _tokenService;
        private readonly IUserService _userService;

        public UserLoginCommandHandler(UserManager<AppUser> userManager, ITokenService tokenService, IUserService userService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _userService = userService;
        }

        public async Task<UserLoginCommandResult> Handle(UserLoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if(user == null)
            {
                throw new UserNotFoundException("Email hatalı.");
            }

            var result = await _userManager.CheckPasswordAsync(user, request.Password);
            if(result == false)
            {
                throw new UserNotFoundException("Şifre hatalı.");
            }
            var roles = await _userManager.GetRolesAsync(user);
            TokenResponseDto token = _tokenService.CreateAccessToken(user, roles);

            await _userService.UpdateRefreshToken(token.RefreshToken, user.Id, DateTime.UtcNow);

            return new UserLoginCommandResult
            {
                Succeeded = true,
                Token = token
            };
        }
    }
}

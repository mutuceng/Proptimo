using Proptimo.Application.Dtos.AuthDtos;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.AuthServices.TokenServices
{
    public interface ITokenService
    {
        Task<TokenResponseDto> GetRefreshToken(string refreshToken);
        Task<TokenResponseDto> GetTokenResponse(UserLoginCommand userLoginDto);
    }
}

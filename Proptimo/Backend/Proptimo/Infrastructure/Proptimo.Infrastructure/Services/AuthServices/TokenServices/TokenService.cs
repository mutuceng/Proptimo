using Proptimo.Application.Dtos.AuthDtos;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.AuthServices.TokenServices
{
    public class TokenService : ITokenService
    {
        public Task<TokenResponseDto> GetRefreshToken(string refreshToken)
        {
            throw new NotImplementedException();
        }

        public Task<TokenResponseDto> GetTokenResponse(UserLoginCommand userLoginDto)
        {
            throw new NotImplementedException();
        }
    }
}

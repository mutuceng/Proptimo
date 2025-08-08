using Proptimo.Application.Dtos.AuthDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Abstractions
{
    public interface IUserService
    {
        Task UpdateRefreshToken(string refreshToken, string userId, DateTime accessTokenDate);

        Task<TokenResponseDto> RefreshAccessToken(RefreshAccessTokenRequest request);
    }
}

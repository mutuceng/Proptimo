using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.AuthDtos;
using Proptimo.Application.Exceptions;
using Proptimo.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.AuthServices
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;

        public UserService(UserManager<AppUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task UpdateRefreshToken(string refreshToken, string userId, DateTime accessTokenDate)
        {

            var user = await _userManager.FindByIdAsync(userId);

            if(user != null)
            {
                user.RefreshToken = refreshToken;
                user.RefreshTokenEndDate = accessTokenDate.AddDays(7);

                await _userManager.UpdateAsync(user);
            }

            throw new UserNotFoundException("Kullanıcı bulunamadı.");
        }

        public async Task<TokenResponseDto> RefreshAccessToken(RefreshAccessTokenRequest request)
        {
            if(!string.IsNullOrEmpty(request.RefreshToken))
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);


                if ( (user == null) || (user.RefreshTokenEndDate < DateTime.UtcNow) )
                {
                    throw new UnauthorizedAccessException("Refresh Token gereksiz veya süresi dolmuş");
                }
                var roles = await _userManager.GetRolesAsync(user);
                var newToken =  _tokenService.CreateAccessToken(user, roles);
                
                user.RefreshToken = newToken.RefreshToken;
                user.RefreshTokenEndDate = DateTime.UtcNow.AddDays(7);

                await _userManager.UpdateAsync(user);

                return new TokenResponseDto
                {
                    AccessToken = newToken.AccessToken,
                    RefreshToken = newToken.RefreshToken,
                    Expiration = newToken.Expiration
                };
            }

            throw new ArgumentException("Refresh Token gerekli");
        }

    }
}

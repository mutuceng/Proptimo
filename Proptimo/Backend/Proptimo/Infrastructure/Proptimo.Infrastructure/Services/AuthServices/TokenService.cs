using Microsoft.IdentityModel.Tokens;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.AuthDtos;
using Proptimo.Application.Features.CQRS.Commands.AppUserCommands;
using Proptimo.Domain.Entities.Identity;
using Proptimo.Infrastructure.Settings;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services.AuthServices
{
    public class TokenService : ITokenService
    {
        private readonly JwtSettings _jwtSettings;

        public TokenService(JwtSettings jwtSettings)
        {
            _jwtSettings = jwtSettings;
        }

        public TokenResponseDto CreateAccessToken(AppUser user, IList<string> roles)
        {
            var token = new TokenResponseDto();

            SymmetricSecurityKey securityKey= new(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));

            SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            token.Expiration = DateTime.UtcNow.AddMinutes(60);
            JwtSecurityToken securityToken = new JwtSecurityToken(
                    audience: _jwtSettings.Audience,
                    issuer: _jwtSettings.Issuer,
                    expires: token.Expiration,
                    notBefore: DateTime.UtcNow,
                    claims: claims,
                    signingCredentials: signingCredentials
                );

            JwtSecurityTokenHandler tokenHandler= new JwtSecurityTokenHandler();
            token.AccessToken = tokenHandler.WriteToken(securityToken);

            token.RefreshToken = CreateRefreshToken();
            return token;

        }

        public string CreateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var randomNumberGenerator = RandomNumberGenerator.Create(); // disposable object

            randomNumberGenerator.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }
    }
}

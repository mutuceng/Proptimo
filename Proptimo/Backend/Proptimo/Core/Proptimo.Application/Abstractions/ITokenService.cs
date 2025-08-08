using Proptimo.Application.Dtos.AuthDtos;
using Proptimo.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Abstractions
{
    public interface ITokenService
    {
        TokenResponseDto CreateAccessToken(AppUser appUser, IList<string> roles);
        string CreateRefreshToken();

    }
}

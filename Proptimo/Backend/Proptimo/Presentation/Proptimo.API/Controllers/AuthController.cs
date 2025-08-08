using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Dtos.AuthDtos;
using Proptimo.Domain.Entities.Identity;

namespace Proptimo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshAccessToken(RefreshAccessTokenRequest request)
        {
            try
            {
                var accessToken = await _userService.RefreshAccessToken(request);

                return Ok(accessToken);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
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
    public class UserRegisterCommandHandler : IRequestHandler<UserRegisterCommand, UserRegisterCommandResult>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public UserRegisterCommandHandler(UserManager<AppUser> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<UserRegisterCommandResult> Handle(UserRegisterCommand request, CancellationToken cancellationToken)
        {
            var user = _mapper.Map<AppUser>(request);

            var result = await _userManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {

                await _userManager.AddToRoleAsync(user, "User");

                return new UserRegisterCommandResult { 
                    Succeeded = true,
                    Message = "Kullanici basariyla eklendi."
                };

               
            }

            return new UserRegisterCommandResult
            {
                Succeeded = false,
                Message = "Kullanici eklenirken hata meydana geldi."
            };
        }
    }
}

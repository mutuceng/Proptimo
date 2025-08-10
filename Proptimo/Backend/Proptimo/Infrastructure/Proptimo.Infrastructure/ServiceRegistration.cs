using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Proptimo.Application.Abstractions;
using Proptimo.Infrastructure.Services;
using Proptimo.Infrastructure.Services.AuthServices;
using Proptimo.Infrastructure.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>()
                                            ?? throw new InvalidOperationException("JwtSettings not found.");

            services.AddSingleton<JwtSettings>(jwtSettings);

            services.AddAuthentication()
                .AddJwtBearer(opt =>
                {
                    var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);
                    opt.TokenValidationParameters = new()
                    {
                        ValidateAudience = true,
                        ValidateIssuer = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidAudience = jwtSettings.Audience,
                        ValidIssuer = jwtSettings.Issuer,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        
                        LifetimeValidator = (notBefore, expires, securityToken, validationParameters) => 
                                        expires != null ? expires > DateTime.UtcNow : false
                        // expires null değilse ve süresi geçmiş ise false döndür. Bu bir delegate fonk.
                    };
                });

            services.AddScoped<IExternalCurrencyService, ExternalCurrencyService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddScoped<IAddressCsvToDbService, AddressCsvToDbService>();


        }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Proptimo.Application.Abstractions;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities.Identity;
using Proptimo.Persistence.Context;
using Proptimo.Persistence.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Persistence
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                                            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

            services.AddDbContext<ProptimoDbContext>(options => options.UseSqlServer(connectionString));

            services.AddIdentityCore<AppUser>(options =>
            {
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(1); 
                options.Lockout.MaxFailedAccessAttempts = 5;                       
                options.Lockout.AllowedForNewUsers = true;                         

                options.User.RequireUniqueEmail = true;                           

            }).AddRoles<AppRole>().AddEntityFrameworkStores<ProptimoDbContext>();

            services.AddScoped(typeof(IWriteRepository<>), typeof(WriteRepository<>));
            services.AddScoped(typeof(IReadRepository<>), typeof(ReadRepository<>));

            services.AddScoped<IUnitOfWork, UnitOfWork>();

        }
    }
}

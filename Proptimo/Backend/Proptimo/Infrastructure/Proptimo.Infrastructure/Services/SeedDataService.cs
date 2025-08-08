using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Proptimo.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure.Services
{
    public static class SeedDataService
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<AppRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new AppRole("Admin"));
            }

            var adminUser = await userManager.FindByEmailAsync("mutu@admin.com");
            if (adminUser == null)
            {
                adminUser = new AppUser {
                    Id=Guid.NewGuid().ToString(), 
                    Name ="mutu",
                    Surname = "admin",
                    UserName = "mutu",
                    Email = "mutu@admin.com"
                };
                var result = await userManager.CreateAsync(adminUser, "admin123D!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            if(!await roleManager.RoleExistsAsync("User"))
            {
                await roleManager.CreateAsync(new AppRole("User"));
            }
        }
    }
}

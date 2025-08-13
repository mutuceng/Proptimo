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

            var adminRoleExists = await roleManager.RoleExistsAsync("Admin");

            if (!adminRoleExists)
            {
                Console.WriteLine("Admin role oluşturuluyor...");
                var roleResult = await roleManager.CreateAsync(new AppRole("Admin"));
                Console.WriteLine($"Admin role oluşturma sonucu: {roleResult.Succeeded}");
            }
            else
            {
                Console.WriteLine("Admin role zaten mevcut");
            }

            var adminUser = await userManager.FindByEmailAsync("mutu@admin.com");

            if (adminUser == null)
            {
                adminUser = new AppUser {
                    Id=Guid.NewGuid().ToString(), 
                    Name ="mutu",
                    Surname = "admin",
                    UserName = "mutuadmin",
                    Email = "mutu@admin.com"
                };

                var result = await userManager.CreateAsync(adminUser, "admin123D!");

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"[SeedError] {error.Code}: {error.Description}");
                    }
                }
                else
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            } else
            {
                Console.WriteLine("Admin zaten mevcut");
            }

            if (!await roleManager.RoleExistsAsync("User"))
            {
                await roleManager.CreateAsync(new AppRole("User"));
            }
        }
    }
}

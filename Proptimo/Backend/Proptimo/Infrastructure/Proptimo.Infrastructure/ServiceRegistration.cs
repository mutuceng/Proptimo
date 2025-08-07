using Microsoft.Extensions.DependencyInjection;
using Proptimo.Infrastructure.Services.ApiServices.RealEstateAddressServices;
using Proptimo.Infrastructure.Services.ApiServices.RealEstateServices;
using Proptimo.Infrastructure.Services.ApiServices.RealEstateTypeServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddInfrastructureServices(this IServiceCollection services)
        {
            services.AddScoped<IRealEstateService, RealEstateService>();
            services.AddScoped<IRealEstateAddressServices, RealEstateAddressServices>();
            services.AddScoped<IRealEstateTypeService, RealEstateTypeService>();
        }
    }
}

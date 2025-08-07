using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Proptimo.Application.Behaviors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application
{
    public static class ServiceRegistration
    {
        public static void AddApplicationLayerServices(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            // iki farklı registration
            //services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ServiceRegistration).Assembly));
            //services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            // her cagırıldıgında farklı bir instance olusturuluyor

            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(ServiceRegistration).Assembly);
                cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
            }); 

 
        }
    }
}

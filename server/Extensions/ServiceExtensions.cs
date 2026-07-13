using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Models;

namespace server.Extensions
{
    /// <summary>
    /// Extension methods for IServiceCollection to organize service registration.
    /// </summary>
    public static class ServiceExtensions
    {
        /// <summary>
        /// Registers the database context with SQLite.
        /// </summary>
        public static IServiceCollection AddDatabaseContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(opt =>
                opt.UseSqlite(configuration.GetConnectionString("DefaultConnection")));
            return services;
        }

        /// <summary>
        /// Registers repositories for dependency injection.
        /// </summary>
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IRepository<Department>, Repository<Department>>();
            services.AddScoped<IRepository<Employee>, Repository<Employee>>();
            services.AddScoped<IRepository<User>, Repository<User>>();
            services.AddScoped<IRepository<Leave>, Repository<Leave>>();
            return services;
        }

        /// <summary>
        /// Configures JWT authentication.
        /// </summary>
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(configuration.GetValue<string>("JwtKey")!))
                    };
                });

            services.AddAuthorization();
            return services;
        }

        /// <summary>
        /// Configures CORS for the application.
        /// </summary>
        public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(opt =>
            {
                opt.AddPolicy("AllowCrossOrigin", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });
            return services;
        }
    }
}

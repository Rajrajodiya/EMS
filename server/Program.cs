using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using server.Data;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(opt => opt
               .UseSqlite(builder.Configuration
               .GetConnectionString("DefaultConnection")));

// Add interface for dependency injection
builder.Services.AddScoped<IRepository<Department>, Repository<Department>>();
builder.Services.AddScoped<IRepository<Employee>, Repository<Employee>>();
builder.Services.AddScoped<IRepository<User>, Repository<User>>();
builder.Services.AddScoped<IRepository<Leave>, Repository<Leave>>();
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("JwtKey")!))
    }; 
});

builder.Services.AddAuthorization();

// Register DataSeedHelper
builder.Services.AddScoped<DataSeedHelper>();

// Add CORS
builder.Services.AddCors(opt =>
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
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Seed the database with initial data
using (var scope = app.Services.CreateScope())
{
    var dataSeeder = scope.ServiceProvider.GetRequiredService<DataSeedHelper>();
    dataSeeder.InsertData();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors("AllowCrossOrigin");

// Only redirect to HTTPS in production (not when using HTTP-only dev profile)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthentication();         
app.UseAuthorization();
app.MapControllers();
app.Run();

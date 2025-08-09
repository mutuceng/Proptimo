using Proptimo.Persistence;
using Proptimo.Application;
using Proptimo.Infrastructure;
using System.Text;
using Proptimo.API.Settings;
using Microsoft.IdentityModel.Tokens;
using Proptimo.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddApplicationLayerServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddCors(opt => opt.AddPolicy(name: "CorsPolicy", builder =>
    builder.WithOrigins("http://localhost:5173")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials()));

builder.Logging.AddConsole();

var app = builder.Build();

app.UseCors("CorsPolicy");



using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedDataService.SeedAsync(services);
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

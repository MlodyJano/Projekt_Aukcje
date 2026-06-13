using AuctionSystem.API.Data;
using AuctionSystem.API.Repositories;
using AuctionSystem.API.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite("Data Source=auctions.db"));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();
builder.Services.AddScoped<IAuctionService, AuctionService>();
builder.Services.AddScoped<IBidRepository, BidRepository>();
builder.Services.AddScoped<IBidService, BidService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapibuilder
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AngularClient");
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("System Aukcyjny API")
               .WithTheme(ScalarTheme.Purple); 
    });
    //app.UseSwagger();
    //app.UseSwaggerUI(options =>
    //{
    //    // Wskazujemy domyślny plik dokumentacji wygenerowany przez .NET 10
    //    options.SwaggerEndpoint("/openapi/v1.json", "Auction System API v1");
    //    options.RoutePrefix = "swagger"; // Interfejs będzie dostępny pod adresem /swagger
    //});


}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
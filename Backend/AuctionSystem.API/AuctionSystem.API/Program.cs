using AuctionSystem.API.Data;
using AuctionSystem.API.Repositories;
using AuctionSystem.API.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Konfiguracja bazy danych SQLite
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite("Data Source=auctions.db"));

// 2. Rejestracja warstwy repozytoriów i serwisów (Dependency Injection)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();
builder.Services.AddScoped<IAuctionService, AuctionService>();
builder.Services.AddScoped<IBidRepository, BidRepository>();
builder.Services.AddScoped<IBidService, BidService>();

// 3. Konfiguracja polityki CORS dla Angulara
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Adres aplikacji Angular
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Konfiguracja kontrolerów i formatowania JSON (CamelCase dla Angulara)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// 5. Konfiguracja OpenAPI (Swagger/Scalar)
builder.Services.AddOpenApi();

var app = builder.Build();

// Automatyczne tworzenie bazy danych i aplikowanie migracji przy starcie serwera
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DataContext>();
    context.Database.EnsureCreated(); // To fizycznie utworzy plik auctions.db i tabele!
}

// 6. Konfiguracja potoku ¿¹dañ HTTP (Middleware)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("System Aukcyjny API")
               .WithTheme(ScalarTheme.Purple);
    });
}

app.UseHttpsRedirection();

// URUCHOMIENIE CORS (Nazwa zgodna z zarejestrowan¹ polityk¹ "AllowAngular")
app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

// Seed przyk³adowych danych jeœli baza jest pusta (u³atwia rozwój frontendu)
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();

        if (!context.Auctions.Any())
        {
            var ownerId = context.Users.First().Id;

            context.Auctions.AddRange(
                new AuctionSystem.API.Models.Auction
                {
                    Title = "Smartfon testowy",
                    Description = "Telefon do testów",
                    Category = "Elektronika",
                    StartingPrice = 100,
                    CurrentPrice = 100,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(7),
                    OwnerId = ownerId
                },
                new AuctionSystem.API.Models.Auction
                {
                    Title = "Ksi¹¿ka programistyczna",
                    Description = "Nauka C#",
                    Category = "Ksi¹¿ki",
                    StartingPrice = 25,
                    CurrentPrice = 25,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddDays(3),
                    OwnerId = ownerId
                }
            );

            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "B³¹d seedowania");
    }
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();

    Console.WriteLine($"Users: {context.Users.Count()}");
    Console.WriteLine($"Auctions: {context.Auctions.Count()}");
    Console.WriteLine($"Bids: {context.Bids.Count()}");
}

app.Run();
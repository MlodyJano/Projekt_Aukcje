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

app.Run();
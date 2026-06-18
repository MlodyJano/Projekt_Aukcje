# ─────────────────────────────────────────────────────────────────
# Etap 1: Build
# ─────────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Kopiuj plik projektu i przywróć zależności (warstwa cache)
COPY ["Backend/AuctionSystem.API/AuctionSystem.API/AuctionSystem.API.csproj", "AuctionSystem.API/"]
RUN dotnet restore "AuctionSystem.API/AuctionSystem.API.csproj"

# Kopiuj resztę kodu i zbuduj
COPY Backend/AuctionSystem.API/AuctionSystem.API/ AuctionSystem.API/
WORKDIR /src/AuctionSystem.API
RUN dotnet publish "AuctionSystem.API.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore

# ─────────────────────────────────────────────────────────────────
# Etap 2: Runtime
# ─────────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Utwórz katalog na pliki i bazę SQLite
RUN mkdir -p /app/uploads /app/data

# Skopiuj opublikowane pliki z etapu build
COPY --from=build /app/publish .

# Zmień connection string na ścieżkę w wolumenie
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/auctions.db"

# Port aplikacji
EXPOSE 8080

# Użytkownik non-root (bezpieczeństwo)
RUN adduser --disabled-password --gecos "" appuser \
    && chown -R appuser:appuser /app
USER appuser

ENTRYPOINT ["dotnet", "AuctionSystem.API.dll"]

# ─────────────────────────────────────────────────────────────────
# Etap 1: Build
# ─────────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Backend/AuctionSystem.API/AuctionSystem.API/AuctionSystem.API.csproj", "AuctionSystem.API/"]
RUN dotnet restore "AuctionSystem.API/AuctionSystem.API.csproj" \
    --force \
    /p:RestoreForce=true

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

RUN mkdir -p /app/uploads /app/data

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/auctions.db"

EXPOSE 8080

# Debian używa useradd (nie adduser jak Alpine)
RUN useradd --create-home --shell /bin/bash appuser \
    && chown -R appuser:appuser /app
USER appuser

ENTRYPOINT ["dotnet", "AuctionSystem.API.dll"]
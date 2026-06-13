using AuctionSystem.API.DTOs;

namespace AuctionSystem.API.Services
{
    public interface IBidService
    {
        Task<IEnumerable<BidDto>> GetBidsForAuctionAsync(int auctionId);
        // Metoda zwraca string z opisem błędu lub null, jeśli licytacja się powiodła
        Task<string?> PlaceBidAsync(int auctionId, BidCreateDto bidCreateDto);
    }
}
using AuctionSystem.API.DTOs;

namespace AuctionSystem.API.Services
{
    public interface IBidService
    {
        Task<IEnumerable<BidDto>> GetBidsForAuctionAsync(int auctionId);
        Task<string?> PlaceBidAsync(int auctionId, BidCreateDto bidCreateDto);
        Task<IEnumerable<BidDto>> GetBidsByUserAsync(int userId);
    }
}
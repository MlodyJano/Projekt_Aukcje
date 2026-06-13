using AuctionSystem.API.Models;

namespace AuctionSystem.API.Repositories
{
    public interface IBidRepository
    {
        Task<IEnumerable<Bid>> GetBidsByAuctionIdAsync(int auctionId);
        Task AddBidAsync(Bid bid);
        Task<bool> SaveChangesAsync();
    }
}
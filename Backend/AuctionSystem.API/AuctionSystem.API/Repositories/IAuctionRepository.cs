using AuctionSystem.API.Models;

namespace AuctionSystem.API.Repositories
{
    public interface IAuctionRepository
    {
        Task<IEnumerable<Auction>> GetAuctionsAsync(string? category, string? status);
        Task<Auction?> GetAuctionByIdAsync(int id);
        Task AddAuctionAsync(Auction auction);
        Task UpdateAuctionAsync(Auction auction);
        Task DeleteAuctionAsync(Auction auction);
        Task<bool> SaveChangesAsync();
    }
}
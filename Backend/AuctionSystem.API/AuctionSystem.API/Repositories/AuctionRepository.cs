using AuctionSystem.API.Data;
using AuctionSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AuctionSystem.API.Repositories
{
    public class AuctionRepository : IAuctionRepository
    {
        private readonly DataContext _context;

        public AuctionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Auction>> GetAuctionsAsync(string? category)
        {
            IQueryable<Auction> query = _context.Auctions.Include(a => a.Owner);

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(a => a.Category.ToLower() == category.ToLower());
            }

            return await query.ToListAsync();
        }

        public async Task<Auction?> GetAuctionByIdAsync(int id)
        {
            return await _context.Auctions
                .Include(a => a.Owner)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task AddAuctionAsync(Auction auction) => await _context.Auctions.AddAsync(auction);

        public async Task UpdateAuctionAsync(Auction auction) => _context.Auctions.Update(auction);

        public async Task DeleteAuctionAsync(Auction auction) => _context.Auctions.Remove(auction);

        public async Task<bool> SaveChangesAsync() => (await _context.SaveChangesAsync()) > 0;
    }
}
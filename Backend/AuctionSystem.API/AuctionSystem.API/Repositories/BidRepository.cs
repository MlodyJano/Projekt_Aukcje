using AuctionSystem.API.Data;
using AuctionSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AuctionSystem.API.Repositories
{
    public class BidRepository : IBidRepository
    {
        private readonly DataContext _context;

        public BidRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Bid>> GetBidsByAuctionIdAsync(int auctionId)
        {
            return await _context.Bids
                .Include(b => b.Bidder)
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.BidTime)
                .ToListAsync();
        }
        public async Task<IEnumerable<Bid>> GetBidsByUserIdAsync(int userId)
        {
            return await _context.Bids
                .Include(b => b.Auction)
                .Where(b => b.BidderId == userId)
                .OrderByDescending(b => b.BidTime)
                .ToListAsync();
        }

        public async Task AddBidAsync(Bid bid) => await _context.Bids.AddAsync(bid);

        public async Task<bool> SaveChangesAsync() => (await _context.SaveChangesAsync()) > 0;
    }
}

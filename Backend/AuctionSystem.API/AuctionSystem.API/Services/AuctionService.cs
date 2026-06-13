using AuctionSystem.API.DTOs;
using AuctionSystem.API.Models;
using AuctionSystem.API.Repositories;

namespace AuctionSystem.API.Services
{
    public class AuctionService : IAuctionService
    {
        private readonly IAuctionRepository _auctionRepository;

        public AuctionService(IAuctionRepository auctionRepository)
        {
            _auctionRepository = auctionRepository;
        }

        public async Task<IEnumerable<AuctionDto>> GetAuctionsAsync(string? category, string? status)
        {
            var auctions = await _auctionRepository.GetAuctionsAsync(category, status);
            return auctions.Select(a => new AuctionDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                Category = a.Category,
                StartingPrice = a.StartingPrice,
                CurrentPrice = a.CurrentPrice,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                Status = a.Status,
                OwnerId = a.OwnerId,
                OwnerUsername = a.Owner != null ? a.Owner.Username : "Nieznany"
            });
        }

        public async Task<AuctionDto?> GetAuctionByIdAsync(int id)
        {
            var a = await _auctionRepository.GetAuctionByIdAsync(id);
            if (a == null) return null;

            return new AuctionDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                Category = a.Category,
                StartingPrice = a.StartingPrice,
                CurrentPrice = a.CurrentPrice,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                Status = a.Status,
                OwnerId = a.OwnerId,
                OwnerUsername = a.Owner != null ? a.Owner.Username : "Nieznany"
            };
        }

        public async Task<AuctionDto> CreateAuctionAsync(AuctionCreateDto createDto)
        {
            var auction = new Auction
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Category = createDto.Category,
                StartingPrice = createDto.StartingPrice,
                CurrentPrice = createDto.StartingPrice, // Na starcie cena aktualna to cena wywoławcza
                EndDate = createDto.EndDate,
                OwnerId = createDto.OwnerId
            };

            await _auctionRepository.AddAuctionAsync(auction);
            await _auctionRepository.SaveChangesAsync();

            return new AuctionDto
            {
                Id = auction.Id,
                Title = auction.Title,
                Description = auction.Description,
                Category = auction.Category,
                StartingPrice = auction.StartingPrice,
                CurrentPrice = auction.CurrentPrice,
                StartDate = auction.StartDate,
                EndDate = auction.EndDate,
                Status = auction.Status,
                OwnerId = auction.OwnerId
            };
        }

        public async Task<bool> UpdateAuctionAsync(int id, AuctionCreateDto updateDto)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(id);
            if (auction == null) return false;

            auction.Title = updateDto.Title;
            auction.Description = updateDto.Description;
            auction.Category = updateDto.Category;
            auction.StartingPrice = updateDto.StartingPrice;
            auction.EndDate = updateDto.EndDate;

            await _auctionRepository.UpdateAuctionAsync(auction);
            return await _auctionRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAuctionAsync(int id)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(id);
            if (auction == null) return false;

            await _auctionRepository.DeleteAuctionAsync(auction);
            return await _auctionRepository.SaveChangesAsync();
        }
    }
}
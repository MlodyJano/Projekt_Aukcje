using AuctionSystem.API.DTOs;

namespace AuctionSystem.API.Services
{
    public interface IAuctionService
    {
        Task<IEnumerable<AuctionDto>> GetAuctionsAsync(string? category, string? status);
        Task<AuctionDto?> GetAuctionByIdAsync(int id);
        Task<AuctionDto> CreateAuctionAsync(AuctionCreateDto createDto);
        Task<bool> UpdateAuctionAsync(int id, AuctionCreateDto updateDto);
        Task<bool> DeleteAuctionAsync(int id);
    }
}
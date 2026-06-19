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
            var auctions = await _auctionRepository.GetAuctionsAsync(category);

            await RefreshExpiredStatusesAsync(auctions);

            if (!string.IsNullOrEmpty(status))
            {
                auctions = auctions.Where(a => a.Status.ToLower() == status.ToLower());
            }

            // Kolejność: Active (najkrótszy czas do końca najpierw), potem Ended, na samym końcu Cancelled
            auctions = auctions
                .OrderBy(a => GetStatusSortOrder(a.Status))
                .ThenBy(a => a.EndDate);

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
                OwnerUsername = a.Owner != null ? a.Owner.Username : "Nieznany",
                ImagePath = a.ImagePath
            });
        }

        private static int GetStatusSortOrder(string status)
        {
            if (string.Equals(status, "Active", StringComparison.OrdinalIgnoreCase)) return 0;
            if (string.Equals(status, "Ended", StringComparison.OrdinalIgnoreCase)) return 1;
            if (string.Equals(status, "Cancelled", StringComparison.OrdinalIgnoreCase)) return 2;
            return 3;
        }

        public async Task<AuctionDto?> GetAuctionByIdAsync(int id)
        {
            var a = await _auctionRepository.GetAuctionByIdAsync(id);
            if (a == null) return null;

            await RefreshExpiredStatusesAsync(new[] { a });

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
                OwnerUsername = a.Owner != null ? a.Owner.Username : "Nieznany",
                ImagePath = a.ImagePath
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
                CurrentPrice = createDto.StartingPrice,
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
                OwnerId = auction.OwnerId,
                ImagePath = auction.ImagePath
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

        public async Task<bool> UpdateImagePathAsync(int id, string imagePath)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(id);
            if (auction == null) return false;

            auction.ImagePath = imagePath;
            await _auctionRepository.UpdateAuctionAsync(auction);
            return await _auctionRepository.SaveChangesAsync();
        }

        public async Task<string?> CancelAuctionAsync(int id, int ownerId)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(id);
            if (auction == null) return "Aukcja nie istnieje.";

            // Najpierw sprawdzamy, czy aukcja nie zakończyła się już sama z powodu upływu czasu
            await RefreshExpiredStatusesAsync(new[] { auction });

            if (auction.OwnerId != ownerId)
            {
                return "Nie możesz anulować aukcji, której nie jesteś właścicielem.";
            }

            if (!string.Equals(auction.Status, "Active", StringComparison.OrdinalIgnoreCase))
            {
                return "Można anulować tylko aktywną aukcję.";
            }

            auction.Status = "Cancelled";
            await _auctionRepository.UpdateAuctionAsync(auction);
            await _auctionRepository.SaveChangesAsync();

            return null; // Brak błędów oznacza sukces
        }

        // Aukcje, których czas minął, a wciąż mają status "Active", automatycznie
        // przechodzą na "Ended". Zwraca true, jeśli cokolwiek zostało zmienione.
        private async Task<bool> RefreshExpiredStatusesAsync(IEnumerable<Auction> auctions)
        {
            var changed = false;

            foreach (var auction in auctions)
            {
                if (string.Equals(auction.Status, "Active", StringComparison.OrdinalIgnoreCase)
                    && auction.EndDate < DateTime.UtcNow)
                {
                    auction.Status = "Ended";
                    await _auctionRepository.UpdateAuctionAsync(auction);
                    changed = true;
                }
            }

            if (changed)
            {
                await _auctionRepository.SaveChangesAsync();
            }

            return changed;
        }
    }
}
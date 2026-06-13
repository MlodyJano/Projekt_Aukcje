using AuctionSystem.API.DTOs;
using AuctionSystem.API.Models;
using AuctionSystem.API.Repositories;

namespace AuctionSystem.API.Services
{
    public class BidService : IBidService
    {
        private readonly IBidRepository _bidRepository;
        private readonly IAuctionRepository _auctionRepository;

        public BidService(IBidRepository bidRepository, IAuctionRepository auctionRepository)
        {
            _bidRepository = bidRepository;
            _auctionRepository = auctionRepository;
        }

        public async Task<IEnumerable<BidDto>> GetBidsForAuctionAsync(int auctionId)
        {
            var bids = await _bidRepository.GetBidsByAuctionIdAsync(auctionId);
            return bids.Select(b => new BidDto
            {
                Id = b.Id,
                Amount = b.Amount,
                BidTime = b.BidTime,
                BidderId = b.BidderId,
                BidderUsername = b.Bidder != null ? b.Bidder.Username : "Nieznany"
            });
        }

        public async Task<string?> PlaceBidAsync(int auctionId, BidCreateDto bidCreateDto)
        {
            var auction = await _auctionRepository.GetAuctionByIdAsync(auctionId);
            if (auction == null) return "Aukcja nie istnieje.";

            // 1. Czy aukcja jest aktywna i czas nie minął?
            if (auction.EndDate < DateTime.Now || auction.Status.ToLower() != "active")
            {
                return "Ta aukcja została już zakończona.";
            }

            // 2. Czy kwota jest wyższa od aktualnej ceny?
            if (bidCreateDto.Amount <= auction.CurrentPrice)
            {
                return $"Twoja oferta musi być wyższa niż aktualna cena ({auction.CurrentPrice} zł).";
            }

            // 3. Czy właściciel próbuje licytować samego siebie?
            if (auction.OwnerId == bidCreateDto.BidderId)
            {
                return "Nie możesz licytować własnej aukcji.";
            }

            // Tworzymy nowy rekord licytacji
            var bid = new Bid
            {
                Amount = bidCreateDto.Amount,
                AuctionId = auctionId,
                BidderId = bidCreateDto.BidderId
            };

            // Aktualizujemy aktualną cenę w aukcji
            auction.CurrentPrice = bidCreateDto.Amount;

            await _bidRepository.AddBidAsync(bid);
            await _auctionRepository.UpdateAuctionAsync(auction);

            // Zapisujemy obie zmiany (nowy bid + nowa cena aukcji) w jednej transakcji
            await _bidRepository.SaveChangesAsync();

            return null; // Brak błędów oznacza sukces
        }
    }
}
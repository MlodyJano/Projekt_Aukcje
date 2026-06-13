namespace AuctionSystem.API.Models
{
    public class Bid
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime BidTime { get; set; } = DateTime.UtcNow;

        // Relacja: Oferta dotyczy konkretnej aukcji
        public int AuctionId { get; set; }
        public Auction Auction { get; set; } = null!;

        // Relacja: Ofertę składa konkretny użytkownik
        public int BidderId { get; set; }
        public User Bidder { get; set; } = null!;
    }
}

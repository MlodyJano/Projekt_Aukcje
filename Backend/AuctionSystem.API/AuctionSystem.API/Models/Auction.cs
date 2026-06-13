using System.Security.Cryptography;

namespace AuctionSystem.API.Models
{
    public class Auction
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal StartingPrice { get; set; }
        public decimal CurrentPrice { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = "Active"; // np. Active, Finished, Cancelled

        // Relacja: Aukcja należy do jednego użytkownika (właściciela)
        public int OwnerId { get; set; }
        public User Owner { get; set; } = null!;

        // Relacja: Do aukcji może być przypisanych wiele ofert licytacji
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    }
}

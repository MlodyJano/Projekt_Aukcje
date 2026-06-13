using System.Security.Cryptography;

namespace AuctionSystem.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // Zabezpieczone hasło
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relacje: Jeden użytkownik może mieć wiele swoich aukcji i wiele złożonych ofert
        public ICollection<Auction> Auctions { get; set; } = new List<Auction>();
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    }
}

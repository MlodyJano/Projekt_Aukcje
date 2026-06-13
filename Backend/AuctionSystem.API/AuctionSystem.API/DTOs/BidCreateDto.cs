using System.ComponentModel.DataAnnotations;

namespace AuctionSystem.API.DTOs
{
    public class BidCreateDto
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Kwota oferty musi być większa od zera.")]
        public decimal Amount { get; set; }

        [Required]
        public int BidderId { get; set; } // ID użytkownika, który składa ofertę
    }
}

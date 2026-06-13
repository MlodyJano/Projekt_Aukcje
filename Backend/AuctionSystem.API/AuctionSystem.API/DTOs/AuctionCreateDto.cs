using System.ComponentModel.DataAnnotations;

namespace AuctionSystem.API.DTOs
{
    public class AuctionCreateDto
    {
        [Required(ErrorMessage = "Nazwa przedmiotu jest wymagana.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Nazwa musi mieć od 3 do 100 znaków.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Opis jest wymagany.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kategoria jest wymagana.")]
        public string Category { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Cena wywoławcza musi być większa od zera.")]
        public decimal StartingPrice { get; set; }

        [Required(ErrorMessage = "Data zakończenia jest wymagana.")]
        public DateTime EndDate { get; set; }

        [Required]
        public int OwnerId { get; set; } // ID użytkownika, który wystawia aukcję
    }
}
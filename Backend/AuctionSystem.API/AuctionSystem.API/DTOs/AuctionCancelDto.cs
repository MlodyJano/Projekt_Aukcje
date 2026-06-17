using System.ComponentModel.DataAnnotations;

namespace AuctionSystem.API.DTOs
{
    public class AuctionCancelDto
    {
        [Required]
        public int OwnerId { get; set; } // ID użytkownika żądającego anulowania (musi być właścicielem aukcji)
    }
}

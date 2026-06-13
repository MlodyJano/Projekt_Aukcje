using System.ComponentModel.DataAnnotations;

namespace AuctionSystem.API.DTOs
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "Nazwa użytkownika jest wymagana.")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Nazwa musi mieć od 3 do 20 znaków.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Adres e-mail jest wymagany.")]
        [EmailAddress(ErrorMessage = "Niepoprawny format adresu e-mail.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Hasło jest wymagane.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Hasło musi mieć minimum 6 znaków.")]
        public string Password { get; set; } = string.Empty;
    }
}

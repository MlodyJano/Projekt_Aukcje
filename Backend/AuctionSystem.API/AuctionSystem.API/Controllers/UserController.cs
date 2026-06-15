using AuctionSystem.API.DTOs;
using AuctionSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    // Obsługujemy zarówno api/user jak i api/users, żeby Angular zawsze trafił w odpowiednie miejsce!
    [Route("api/user")]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound(new { message = "Użytkownik nie istnieje." });
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            var createdUser = await _userService.RegisterUserAsync(registerDto);
            if (createdUser == null)
            {
                return BadRequest(new { message = "Nazwa użytkownika jest już zajęta." });
            }
            return Ok(createdUser);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Username) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest(new { message = "Wymagane jest podanie loginu i hasła." });
            }

            var userDto = await _userService.AuthenticateAsync(loginDto);

            if (userDto == null)
            {
                return Unauthorized(new { message = "Nieprawidłowy login lub hasło." });
            }

            return Ok(userDto);
        }
    }
}
using AuctionSystem.API.DTOs;
using AuctionSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            var result = await _userService.RegisterUserAsync(registerDto);
            if (result == null)
                return BadRequest(new { message = "Użytkownik o tym emailu już istnieje." });

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _userService.AuthenticateAsync(loginDto);
            if (result == null)
                return Unauthorized(new { message = "Nieprawidłowy email lub hasło." });

            return Ok(result);
        }
    }
}
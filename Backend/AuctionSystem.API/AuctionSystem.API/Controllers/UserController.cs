using AuctionSystem.API.DTOs;
using AuctionSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Adres to: api/users
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound(new { message = $"Użytkownik o ID {id} nie istnieje." });

            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto registerDto)
        {
            var createdUser = await _userService.RegisterUserAsync(registerDto);
            if (createdUser == null)
                return BadRequest(new { message = "Nazwa użytkownika jest już zajęta." });

            // Zwraca status 201 Created oraz nagłówek Location wskazujący na nowo utworzony zasób
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserRegisterDto updateDto)
        {
            var result = await _userService.UpdateUserAsync(id, updateDto);
            if (!result) return NotFound(new { message = "Nie można zaktualizować. Użytkownik nie istnieje." });

            return NoContent(); // Status 204
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result) return NotFound(new { message = "Nie można usunąć. Użytkownik nie istnieje." });

            return NoContent(); // Status 204
        }
    }
}
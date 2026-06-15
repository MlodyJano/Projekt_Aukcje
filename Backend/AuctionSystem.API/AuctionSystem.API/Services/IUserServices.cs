using AuctionSystem.API.DTOs;
using AuctionSystem.API.Models;

namespace AuctionSystem.API.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto?> RegisterUserAsync(UserRegisterDto registerDto);
        Task<bool> UpdateUserAsync(int id, UserRegisterDto updateDto);
        Task<bool> DeleteUserAsync(int id);
        
        // Ta linijka musi idealnie pasować do UserService.cs:
        Task<UserDto?> AuthenticateAsync(LoginDto loginDto);
    }
}
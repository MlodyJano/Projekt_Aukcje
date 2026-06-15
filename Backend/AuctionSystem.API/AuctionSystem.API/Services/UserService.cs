using AuctionSystem.API.DTOs;
using AuctionSystem.API.Models;
using AuctionSystem.API.Repositories;

namespace AuctionSystem.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                CreatedAt = u.CreatedAt
            });
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto?> RegisterUserAsync(UserRegisterDto registerDto)
        {
            var allUsers = await _userRepository.GetAllUsersAsync();
            var userExists = allUsers.Any(u => u.Username.Trim().Equals(registerDto.Username.Trim(), StringComparison.OrdinalIgnoreCase));
            
            if (userExists) return null;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash
            };

            await _userRepository.AddUserAsync(newUser);
            await _userRepository.SaveChangesAsync();

            return new UserDto
            {
                Id = newUser.Id,
                Username = newUser.Username,
                Email = newUser.Email,
                CreatedAt = newUser.CreatedAt
            };
        }

        public async Task<bool> UpdateUserAsync(int id, UserRegisterDto updateDto)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return false;

            user.Username = updateDto.Username;
            user.Email = updateDto.Email;
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);

            await _userRepository.UpdateUserAsync(user);
            return await _userRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return false;

            await _userRepository.DeleteUserAsync(user);
            return await _userRepository.SaveChangesAsync();
        }

        // METODA LOGOWANIA Z POPRAWIONYM TYPEM LOGIN-DTO
        public async Task<UserDto?> AuthenticateAsync(LoginDto loginDto)
        {
            var allUsers = await _userRepository.GetAllUsersAsync();
            if (allUsers == null) return null;

            var user = allUsers.FirstOrDefault(u => 
                u.Username.Trim().Equals(loginDto.Username.Trim(), StringComparison.OrdinalIgnoreCase));

            if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            {
                return null;
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return null;
            }

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
/*
 * ============================================================
 *  AuctionSystem.API.Tests — Testy jednostkowe (xUnit + Moq)
 *
 *  Wymagane pakiety NuGet (dodaj do projektu testowego):
 *    dotnet add package xunit
 *    dotnet add package xunit.runner.visualstudio
 *    dotnet add package Moq
 *    dotnet add package FluentAssertions
 *    dotnet add package Microsoft.NET.Test.Sdk
 *    dotnet add package BCrypt.Net-Next
 *
 *  Uruchomienie:
 *    dotnet test
 * ============================================================
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuctionSystem.API.DTOs;
using AuctionSystem.API.Models;
using AuctionSystem.API.Repositories;
using AuctionSystem.API.Services;
using FluentAssertions;
using Moq;
using Xunit;

// ─────────────────────────────────────────────────────────────────
// SEKCJA 1: AuctionService
// ─────────────────────────────────────────────────────────────────

namespace AuctionSystem.API.Tests.Services
{
    public class AuctionServiceTests
    {
        private readonly Mock<IAuctionRepository> _repoMock;
        private readonly AuctionService _service;

        public AuctionServiceTests()
        {
            _repoMock = new Mock<IAuctionRepository>();
            _service = new AuctionService(_repoMock.Object);
        }

        // ── GetAuctionsAsync ──────────────────────────────────────

        [Fact]
        public async Task GetAuctionsAsync_ReturnsAllAuctions_WhenNoFilters()
        {
            // Arrange
            var auctions = new List<Auction>
            {
                MakeAuction(1, "Active"),
                MakeAuction(2, "Ended")
            };
            _repoMock.Setup(r => r.GetAuctionsAsync(null)).ReturnsAsync(auctions);
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var result = await _service.GetAuctionsAsync(null, null);

            // Assert
            result.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetAuctionsAsync_FiltersCorrectlyByStatus()
        {
            // Arrange
            var auctions = new List<Auction>
            {
                MakeAuction(1, "Active"),
                MakeAuction(2, "Ended"),
                MakeAuction(3, "Cancelled")
            };
            _repoMock.Setup(r => r.GetAuctionsAsync(null)).ReturnsAsync(auctions);
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var result = await _service.GetAuctionsAsync(null, "Active");

            // Assert
            result.Should().HaveCount(1);
            result.First().Status.Should().Be("Active");
        }

        [Fact]
        public async Task GetAuctionsAsync_SetsStatusToEnded_WhenEndDatePassed()
        {
            // Arrange — aukcja Active, ale EndDate w przeszłości
            var expiredAuction = MakeAuction(1, "Active", endDate: DateTime.Now.AddHours(-1));
            _repoMock.Setup(r => r.GetAuctionsAsync(null)).ReturnsAsync(new List<Auction> { expiredAuction });
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var result = await _service.GetAuctionsAsync(null, null);

            // Assert
            result.First().Status.Should().Be("Ended");
            _repoMock.Verify(r => r.UpdateAuctionAsync(It.Is<Auction>(a => a.Status == "Ended")), Times.Once);
        }

        [Fact]
        public async Task GetAuctionsAsync_OrdersCorrectly_ActiveBeforeEndedBeforeCancelled()
        {
            // Arrange
            var cancelled = MakeAuction(3, "Cancelled");
            var ended = MakeAuction(2, "Ended");
            var active = MakeAuction(1, "Active");

            _repoMock.Setup(r => r.GetAuctionsAsync(null)).ReturnsAsync(new List<Auction> { cancelled, ended, active });
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var result = (await _service.GetAuctionsAsync(null, null)).ToList();

            // Assert
            result[0].Status.Should().Be("Active");
            result[1].Status.Should().Be("Ended");
            result[2].Status.Should().Be("Cancelled");
        }

        // ── GetAuctionByIdAsync ───────────────────────────────────

        [Fact]
        public async Task GetAuctionByIdAsync_ReturnsDto_WhenAuctionExists()
        {
            // Arrange
            var auction = MakeAuction(5, "Active");
            auction.Owner = new User { Username = "tester" };
            _repoMock.Setup(r => r.GetAuctionByIdAsync(5)).ReturnsAsync(auction);
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var result = await _service.GetAuctionByIdAsync(5);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(5);
            result.OwnerUsername.Should().Be("tester");
        }

        [Fact]
        public async Task GetAuctionByIdAsync_ReturnsNull_WhenNotFound()
        {
            // Arrange
            _repoMock.Setup(r => r.GetAuctionByIdAsync(999)).ReturnsAsync((Auction?)null);

            // Act
            var result = await _service.GetAuctionByIdAsync(999);

            // Assert
            result.Should().BeNull();
        }

        // ── CreateAuctionAsync ────────────────────────────────────

        [Fact]
        public async Task CreateAuctionAsync_SetsCurrentPriceEqualToStartingPrice()
        {
            // Arrange
            var dto = new AuctionCreateDto
            {
                Title = "Test",
                Description = "Desc",
                Category = "Sport",
                StartingPrice = 500,
                EndDate = DateTime.Now.AddDays(7),
                OwnerId = 1
            };

            _repoMock.Setup(r => r.AddAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var result = await _service.CreateAuctionAsync(dto);

            // Assert
            result.CurrentPrice.Should().Be(dto.StartingPrice);
            result.Status.Should().Be("Active");
        }

        // ── CancelAuctionAsync ────────────────────────────────────

        [Fact]
        public async Task CancelAuctionAsync_ReturnsNull_WhenSuccessful()
        {
            // Arrange
            var auction = MakeAuction(1, "Active");
            auction.OwnerId = 10;
            _repoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var error = await _service.CancelAuctionAsync(1, ownerId: 10);

            // Assert
            error.Should().BeNull();
            auction.Status.Should().Be("Cancelled");
        }

        [Fact]
        public async Task CancelAuctionAsync_ReturnsError_WhenNotOwner()
        {
            // Arrange
            var auction = MakeAuction(1, "Active");
            auction.OwnerId = 10;
            _repoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var error = await _service.CancelAuctionAsync(1, ownerId: 99);

            // Assert
            error.Should().Contain("właścicielem");
        }

        [Fact]
        public async Task CancelAuctionAsync_ReturnsError_WhenNotActive()
        {
            // Arrange
            var auction = MakeAuction(1, "Ended");
            auction.OwnerId = 10;
            _repoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var error = await _service.CancelAuctionAsync(1, ownerId: 10);

            // Assert
            error.Should().Contain("aktywną");
        }

        [Fact]
        public async Task CancelAuctionAsync_ReturnsError_WhenAuctionNotFound()
        {
            // Arrange
            _repoMock.Setup(r => r.GetAuctionByIdAsync(999)).ReturnsAsync((Auction?)null);

            // Act
            var error = await _service.CancelAuctionAsync(999, ownerId: 1);

            // Assert
            error.Should().Contain("nie istnieje");
        }

        // ── DeleteAuctionAsync ────────────────────────────────────

        [Fact]
        public async Task DeleteAuctionAsync_ReturnsTrue_WhenFound()
        {
            var auction = MakeAuction(1, "Active");
            _repoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);
            _repoMock.Setup(r => r.DeleteAuctionAsync(auction)).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            var result = await _service.DeleteAuctionAsync(1);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAuctionAsync_ReturnsFalse_WhenNotFound()
        {
            _repoMock.Setup(r => r.GetAuctionByIdAsync(999)).ReturnsAsync((Auction?)null);

            var result = await _service.DeleteAuctionAsync(999);

            result.Should().BeFalse();
        }

        // ── Helpers ──────────────────────────────────────────────

        private static Auction MakeAuction(int id, string status, DateTime? endDate = null) =>
            new Auction
            {
                Id = id,
                Title = $"Aukcja {id}",
                Description = "Opis",
                Category = "Test",
                StartingPrice = 100,
                CurrentPrice = 100,
                StartDate = DateTime.UtcNow.AddDays(-1),
                EndDate = endDate ?? DateTime.Now.AddDays(7),
                Status = status,
                OwnerId = 1
            };
    }

    // ─────────────────────────────────────────────────────────────────
    // SEKCJA 2: BidService
    // ─────────────────────────────────────────────────────────────────

    public class BidServiceTests
    {
        private readonly Mock<IBidRepository> _bidRepoMock;
        private readonly Mock<IAuctionRepository> _auctionRepoMock;
        private readonly BidService _service;

        public BidServiceTests()
        {
            _bidRepoMock = new Mock<IBidRepository>();
            _auctionRepoMock = new Mock<IAuctionRepository>();
            _service = new BidService(_bidRepoMock.Object, _auctionRepoMock.Object);
        }

        // ── PlaceBidAsync ─────────────────────────────────────────

        [Fact]
        public async Task PlaceBidAsync_ReturnsNull_WhenValidBid()
        {
            // Arrange
            var auction = MakeActiveAuction(currentPrice: 200);
            var dto = new BidCreateDto { Amount = 250, BidderId = 2 };

            _auctionRepoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);
            _bidRepoMock.Setup(r => r.AddBidAsync(It.IsAny<Bid>())).Returns(Task.CompletedTask);
            _auctionRepoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _bidRepoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var error = await _service.PlaceBidAsync(1, dto);

            // Assert
            error.Should().BeNull();
            auction.CurrentPrice.Should().Be(250);
        }

        [Fact]
        public async Task PlaceBidAsync_ReturnsError_WhenAuctionNotFound()
        {
            _auctionRepoMock.Setup(r => r.GetAuctionByIdAsync(99)).ReturnsAsync((Auction?)null);

            var error = await _service.PlaceBidAsync(99, new BidCreateDto { Amount = 100, BidderId = 1 });

            error.Should().Contain("nie istnieje");
        }

        [Fact]
        public async Task PlaceBidAsync_ReturnsError_WhenAuctionEnded()
        {
            var auction = new Auction
            {
                Id = 1,
                Status = "Active",
                CurrentPrice = 100,
                OwnerId = 1,
                EndDate = DateTime.Now.AddHours(-1) // Przeterminowana!
            };
            _auctionRepoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);

            var error = await _service.PlaceBidAsync(1, new BidCreateDto { Amount = 200, BidderId = 2 });

            error.Should().Contain("zakończona");
        }

        [Fact]
        public async Task PlaceBidAsync_ReturnsError_WhenAmountTooLow()
        {
            var auction = MakeActiveAuction(currentPrice: 500);
            _auctionRepoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);

            var dto = new BidCreateDto { Amount = 499, BidderId = 2 }; // Mniej niż currentPrice
            var error = await _service.PlaceBidAsync(1, dto);

            error.Should().Contain("wyższa");
        }

        [Fact]
        public async Task PlaceBidAsync_ReturnsError_WhenAmountEqualsCurrentPrice()
        {
            var auction = MakeActiveAuction(currentPrice: 500);
            _auctionRepoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);

            var dto = new BidCreateDto { Amount = 500, BidderId = 2 }; // Równa currentPrice — nie wyższa!
            var error = await _service.PlaceBidAsync(1, dto);

            error.Should().Contain("wyższa");
        }

        [Fact]
        public async Task PlaceBidAsync_ReturnsError_WhenOwnerBids()
        {
            var auction = MakeActiveAuction(currentPrice: 100);
            auction.OwnerId = 5;
            _auctionRepoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);

            var dto = new BidCreateDto { Amount = 200, BidderId = 5 }; // Owner = bidder!
            var error = await _service.PlaceBidAsync(1, dto);

            error.Should().Contain("własnej");
        }

        [Fact]
        public async Task PlaceBidAsync_ReturnsError_WhenStatusNotActive()
        {
            var auction = new Auction
            {
                Id = 1,
                Status = "Cancelled",
                CurrentPrice = 100,
                OwnerId = 1,
                EndDate = DateTime.Now.AddDays(1)
            };
            _auctionRepoMock.Setup(r => r.GetAuctionByIdAsync(1)).ReturnsAsync(auction);

            var error = await _service.PlaceBidAsync(1, new BidCreateDto { Amount = 200, BidderId = 2 });

            error.Should().Contain("zakończona");
        }

        // ── GetBidsForAuctionAsync ────────────────────────────────

        [Fact]
        public async Task GetBidsForAuctionAsync_ReturnsCorrectDtos()
        {
            var bids = new List<Bid>
            {
                new Bid { Id = 1, Amount = 150, BidderId = 2, AuctionId = 1, Bidder = new User { Username = "user2" } },
                new Bid { Id = 2, Amount = 200, BidderId = 3, AuctionId = 1, Bidder = new User { Username = "user3" } }
            };
            _bidRepoMock.Setup(r => r.GetBidsByAuctionIdAsync(1)).ReturnsAsync(bids);

            var result = (await _service.GetBidsForAuctionAsync(1)).ToList();

            result.Should().HaveCount(2);
            result[0].BidderUsername.Should().Be("user2");
            result[1].Amount.Should().Be(200);
        }

        // ── GetBidsByUserAsync ────────────────────────────────────

        [Fact]
        public async Task GetBidsByUserAsync_IncludesAuctionData()
        {
            var bid = new Bid
            {
                Id = 10,
                Amount = 500,
                BidderId = 2,
                AuctionId = 3,
                Bidder = new User { Username = "kupujacy" },
                Auction = new Auction
                {
                    Title = "Laptop",
                    Category = "Elektronika",
                    ImagePath = "/uploads/test.jpg"
                }
            };
            _bidRepoMock.Setup(r => r.GetBidsByUserIdAsync(2)).ReturnsAsync(new List<Bid> { bid });

            var result = (await _service.GetBidsByUserAsync(2)).ToList();

            result.Should().HaveCount(1);
            result[0].AuctionTitle.Should().Be("Laptop");
            result[0].AuctionCategory.Should().Be("Elektronika");
            result[0].AuctionImagePath.Should().Be("/uploads/test.jpg");
        }

        // ── Helpers ──────────────────────────────────────────────

        private static Auction MakeActiveAuction(decimal currentPrice) =>
            new Auction
            {
                Id = 1,
                Status = "Active",
                CurrentPrice = currentPrice,
                OwnerId = 1,
                EndDate = DateTime.Now.AddDays(5)
            };
    }

    // ─────────────────────────────────────────────────────────────────
    // SEKCJA 3: UserService
    // ─────────────────────────────────────────────────────────────────

    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _repoMock;
        private readonly UserService _service;

        public UserServiceTests()
        {
            _repoMock = new Mock<IUserRepository>();
            _service = new UserService(_repoMock.Object);
        }

        // ── RegisterUserAsync ─────────────────────────────────────

        [Fact]
        public async Task RegisterUserAsync_ReturnsDto_WhenUsernameAvailable()
        {
            // Arrange
            _repoMock.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User>());
            _repoMock.Setup(r => r.AddUserAsync(It.IsAny<User>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            var dto = new UserRegisterDto
            {
                Username = "nowy_user",
                Email = "nowy@example.com",
                Password = "haslo123"
            };

            // Act
            var result = await _service.RegisterUserAsync(dto);

            // Assert
            result.Should().NotBeNull();
            result!.Username.Should().Be("nowy_user");
            result.Email.Should().Be("nowy@example.com");
        }

        [Fact]
        public async Task RegisterUserAsync_ReturnsNull_WhenUsernameAlreadyTaken()
        {
            // Arrange
            var existingUser = new User { Username = "jan_kowalski", Email = "jan@example.com" };
            _repoMock.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User> { existingUser });

            var dto = new UserRegisterDto
            {
                Username = "jan_kowalski", // Duplikat!
                Email = "inny@example.com",
                Password = "haslo123"
            };

            // Act
            var result = await _service.RegisterUserAsync(dto);

            // Assert
            result.Should().BeNull();
            _repoMock.Verify(r => r.AddUserAsync(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task RegisterUserAsync_ReturnsNull_WhenUsernameMatchesCaseInsensitively()
        {
            // Arrange — "JAN_KOWALSKI" vs "jan_kowalski"
            var existingUser = new User { Username = "JAN_KOWALSKI" };
            _repoMock.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User> { existingUser });

            var dto = new UserRegisterDto { Username = "jan_kowalski", Email = "a@b.com", Password = "pass123" };

            // Act
            var result = await _service.RegisterUserAsync(dto);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task RegisterUserAsync_HashesPassword()
        {
            // Arrange
            User? capturedUser = null;
            _repoMock.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User>());
            _repoMock.Setup(r => r.AddUserAsync(It.IsAny<User>()))
                     .Callback<User>(u => capturedUser = u)
                     .Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            var dto = new UserRegisterDto { Username = "user1", Email = "u@e.com", Password = "plain_text" };

            // Act
            await _service.RegisterUserAsync(dto);

            // Assert — hasło jest zahashowane, nie przechowujemy jawnego tekstu
            capturedUser.Should().NotBeNull();
            capturedUser!.PasswordHash.Should().NotBe("plain_text");
            BCrypt.Net.BCrypt.Verify("plain_text", capturedUser.PasswordHash).Should().BeTrue();
        }

        // ── AuthenticateAsync ─────────────────────────────────────

        [Fact]
        public async Task AuthenticateAsync_ReturnsUserDto_WhenCredentialsValid()
        {
            // Arrange
            var hashedPass = BCrypt.Net.BCrypt.HashPassword("correctPass");
            var user = new User { Id = 1, Username = "testuser", Email = "t@e.com", PasswordHash = hashedPass };
            _repoMock.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User> { user });

            var dto = new LoginDto { Username = "testuser", Password = "correctPass" };

            // Act
            var result = await _service.AuthenticateAsync(dto);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.Username.Should().Be("testuser");
        }

        [Fact]
        public async Task AuthenticateAsync_ReturnsNull_WhenPasswordWrong()
        {
            // Arrange
            var hashedPass = BCrypt.Net.BCrypt.HashPassword("correctPass");
            var user = new User { Username = "testuser", PasswordHash = hashedPass };
            _repoMock.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User> { user });

            // Act
            var result = await _service.AuthenticateAsync(new LoginDto { Username = "testuser", Password = "wrongPass" });

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task AuthenticateAsync_ReturnsNull_WhenUserNotFound()
        {
            _repoMock.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User>());

            var result = await _service.AuthenticateAsync(new LoginDto { Username = "unknown", Password = "pass" });

            result.Should().BeNull();
        }

        [Fact]
        public async Task AuthenticateAsync_IsCaseInsensitiveForUsername()
        {
            var hashedPass = BCrypt.Net.BCrypt.HashPassword("pass123");
            var user = new User { Id = 2, Username = "ADMIN", Email = "admin@e.com", PasswordHash = hashedPass };
            _repoMock.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User> { user });

            var result = await _service.AuthenticateAsync(new LoginDto { Username = "admin", Password = "pass123" });

            result.Should().NotBeNull();
        }

        // ── GetUserByIdAsync ──────────────────────────────────────

        [Fact]
        public async Task GetUserByIdAsync_ReturnsDto_WhenExists()
        {
            var user = new User { Id = 5, Username = "user5", Email = "u5@e.com" };
            _repoMock.Setup(r => r.GetUserByIdAsync(5)).ReturnsAsync(user);

            var result = await _service.GetUserByIdAsync(5);

            result.Should().NotBeNull();
            result!.Id.Should().Be(5);
        }

        [Fact]
        public async Task GetUserByIdAsync_ReturnsNull_WhenNotExists()
        {
            _repoMock.Setup(r => r.GetUserByIdAsync(999)).ReturnsAsync((User?)null);

            var result = await _service.GetUserByIdAsync(999);

            result.Should().BeNull();
        }

        // ── DeleteUserAsync ───────────────────────────────────────

        [Fact]
        public async Task DeleteUserAsync_ReturnsTrue_WhenUserExists()
        {
            var user = new User { Id = 1, Username = "to_delete" };
            _repoMock.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
            _repoMock.Setup(r => r.DeleteUserAsync(user)).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            var result = await _service.DeleteUserAsync(1);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteUserAsync_ReturnsFalse_WhenNotFound()
        {
            _repoMock.Setup(r => r.GetUserByIdAsync(999)).ReturnsAsync((User?)null);

            var result = await _service.DeleteUserAsync(999);

            result.Should().BeFalse();
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // SEKCJA 4: Testy logiki pomocniczej (sortowanie, filtrowanie)
    // ─────────────────────────────────────────────────────────────────

    public class AuctionSortingEdgeCaseTests
    {
        private readonly Mock<IAuctionRepository> _repoMock;
        private readonly AuctionService _service;

        public AuctionSortingEdgeCaseTests()
        {
            _repoMock = new Mock<IAuctionRepository>();
            _service = new AuctionService(_repoMock.Object);
        }

        [Fact]
        public async Task GetAuctionsAsync_ReturnsEmpty_WhenNoAuctions()
        {
            _repoMock.Setup(r => r.GetAuctionsAsync(null)).ReturnsAsync(new List<Auction>());

            var result = await _service.GetAuctionsAsync(null, null);

            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetAuctionsAsync_ActiveAuctions_SortedByEndDateAscending()
        {
            // Arrange — dwie aktywne aukcje; pierwsza kończy się wcześniej
            var sooner = new Auction
            {
                Id = 1, Status = "Active",
                EndDate = DateTime.Now.AddDays(1),
                CurrentPrice = 100, StartingPrice = 100
            };
            var later = new Auction
            {
                Id = 2, Status = "Active",
                EndDate = DateTime.Now.AddDays(5),
                CurrentPrice = 100, StartingPrice = 100
            };

            _repoMock.Setup(r => r.GetAuctionsAsync(null)).ReturnsAsync(new List<Auction> { later, sooner });
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            // Act
            var result = (await _service.GetAuctionsAsync(null, "Active")).ToList();

            // Assert
            result[0].Id.Should().Be(1); // sooner first
            result[1].Id.Should().Be(2);
        }

        [Theory]
        [InlineData("active")]
        [InlineData("ACTIVE")]
        [InlineData("Active")]
        public async Task GetAuctionsAsync_FilterStatus_IsCaseInsensitive(string statusFilter)
        {
            var auction = new Auction { Id = 1, Status = "Active", EndDate = DateTime.Now.AddDays(1), CurrentPrice = 100, StartingPrice = 100 };
            _repoMock.Setup(r => r.GetAuctionsAsync(null)).ReturnsAsync(new List<Auction> { auction });
            _repoMock.Setup(r => r.UpdateAuctionAsync(It.IsAny<Auction>())).Returns(Task.CompletedTask);
            _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(true);

            var result = await _service.GetAuctionsAsync(null, statusFilter);

            result.Should().HaveCount(1);
        }
    }
}

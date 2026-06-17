using AuctionSystem.API.DTOs;
using AuctionSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionsController : ControllerBase
    {
        private readonly IAuctionService _auctionService;
        private readonly IWebHostEnvironment _env;

        public AuctionsController(IAuctionService auctionService, IWebHostEnvironment env)
        {
            _auctionService = auctionService;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuctionDto>>> GetAuctions(
            [FromQuery] string? category,
            [FromQuery] string? status)
        {
            var auctions = await _auctionService.GetAuctionsAsync(category, status);
            return Ok(auctions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionDto>> GetAuction(int id)
        {
            var auction = await _auctionService.GetAuctionByIdAsync(id);
            if (auction == null) return NotFound(new { message = $"Aukcja o ID {id} nie istnieje." });
            return Ok(auction);
        }

        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction([FromBody] AuctionCreateDto createDto)
        {
            var createdAuction = await _auctionService.CreateAuctionAsync(createDto);
            return CreatedAtAction(nameof(GetAuction), new { id = createdAuction.Id }, createdAuction);
        }

        [HttpPost("{id}/image")]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Brak pliku." });

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType))
                return BadRequest(new { message = "Dozwolone formaty: jpg, png, webp." });

            var uploadsPath = Path.Combine(_env.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsPath);

            var fileName = $"{id}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imagePath = $"/uploads/{fileName}";
            var result = await _auctionService.UpdateImagePathAsync(id, imagePath);
            if (!result) return NotFound(new { message = "Aukcja nie istnieje." });

            return Ok(new { imagePath });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuction(int id, [FromBody] AuctionCreateDto updateDto)
        {
            var result = await _auctionService.UpdateAuctionAsync(id, updateDto);
            if (!result) return NotFound(new { message = "Nie można zaktualizować. Aukcja nie istnieje." });
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuction(int id)
        {
            var result = await _auctionService.DeleteAuctionAsync(id);
            if (!result) return NotFound(new { message = "Nie można usunąć. Aukcja nie istnieje." });
            return NoContent();
        }
    }
}
using AuctionSystem.API.DTOs;
using AuctionSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Adres w przeglądarce: api/auctions
    public class AuctionsController : ControllerBase
    {
        private readonly IAuctionService _auctionService;

        public AuctionsController(IAuctionService auctionService)
        {
            _auctionService = auctionService;
        }

        // GET: api/auctions?category=Elektronika&status=Active
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuctionDto>>> GetAuctions(
            [FromQuery] string? category,
            [FromQuery] string? status)
        {
            var auctions = await _auctionService.GetAuctionsAsync(category, status);
            return Ok(auctions);
        }

        // GET: api/auctions/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionDto>> GetAuction(int id)
        {
            var auction = await _auctionService.GetAuctionByIdAsync(id);
            if (auction == null) return NotFound(new { message = $"Aukcja o ID {id} nie istnieje." });

            return Ok(auction);
        }

        // POST: api/auctions
        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction([FromBody] AuctionCreateDto createDto)
        {
            var createdAuction = await _auctionService.CreateAuctionAsync(createDto);
            return CreatedAtAction(nameof(GetAuction), new { id = createdAuction.Id }, createdAuction);
        }

        // PUT: api/auctions/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuction(int id, [FromBody] AuctionCreateDto updateDto)
        {
            var result = await _auctionService.UpdateAuctionAsync(id, updateDto);
            if (!result) return NotFound(new { message = "Nie można zaktualizować. Aukcja nie istnieje." });

            return NoContent();
        }

        // DELETE: api/auctions/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuction(int id)
        {
            var result = await _auctionService.DeleteAuctionAsync(id);
            if (!result) return NotFound(new { message = "Nie można usunąć. Aukcja nie istnieje." });

            return NoContent();
        }
    }
}
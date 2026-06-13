using AuctionSystem.API.DTOs;
using AuctionSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/auctions/{auctionId}/[controller]")] // Generuje ścieżkę: api/auctions/{auctionId}/bids
    public class BidsController : ControllerBase
    {
        private readonly IBidService _bidService;

        public BidsController(IBidService bidService)
        {
            _bidService = bidService;
        }

        // GET: api/auctions/{auctionId}/bids
        // Pobiera historię wszystkich ofert dla danej aukcji
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetBids([FromRoute] int auctionId)
        {
            var bids = await _bidService.GetBidsForAuctionAsync(auctionId);
            return Ok(bids);
        }

        // POST: api/auctions/{auctionId}/bids
        // Składa nową ofertę w licytacji
        [HttpPost]
        public async Task<IActionResult> PlaceBid([FromRoute] int auctionId, [FromBody] BidCreateDto bidCreateDto)
        {
            var errorResult = await _bidService.PlaceBidAsync(auctionId, bidCreateDto);

            if (errorResult != null)
            {
                return BadRequest(new { message = errorResult });
            }

            return Ok(new { message = "Oferta została złożona pomyślnie!" });
        }
    }
}
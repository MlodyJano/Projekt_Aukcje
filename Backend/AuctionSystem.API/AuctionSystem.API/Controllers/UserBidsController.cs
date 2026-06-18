using AuctionSystem.API.DTOs;
using AuctionSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionSystem.API.Controllers
{
    [ApiController]
    [Route("api/users/{userId}/bids")]
    public class UserBidsController : ControllerBase
    {
        private readonly IBidService _bidService;

        public UserBidsController(IBidService bidService)
        {
            _bidService = bidService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetUserBids([FromRoute] int userId)
        {
            var bids = await _bidService.GetBidsByUserAsync(userId);
            return Ok(bids);
        }
    }
}
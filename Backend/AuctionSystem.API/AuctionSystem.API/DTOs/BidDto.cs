namespace AuctionSystem.API.DTOs
{
    public class BidDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime BidTime { get; set; }
        public int BidderId { get; set; }
        public string BidderUsername { get; set; } = string.Empty;
    }
}
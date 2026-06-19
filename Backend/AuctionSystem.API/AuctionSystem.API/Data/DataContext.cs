using AuctionSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AuctionSystem.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // SQLite przechowuje daty bez strefy — EF Core zwraca Kind=Unspecified.
            // JSON serializer nie dodaje wtedy 'Z', przeglądarka traktuje czas jako lokalny
            // zamiast UTC → różnica 2h. Ten konwerter wymusza Kind=Utc przy odczycie.
            var utcConverter = new ValueConverter<DateTime, DateTime>(
                dt => dt.Kind == DateTimeKind.Utc ? dt : dt.ToUniversalTime(),
                dt => DateTime.SpecifyKind(dt, DateTimeKind.Utc)
            );

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(utcConverter);
                    }
                }
            }

            modelBuilder.Entity<Auction>()
                .HasOne(a => a.Owner)
                .WithMany(u => u.Auctions)
                .HasForeignKey(a => a.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Auction)
                .WithMany(a => a.Bids)
                .HasForeignKey(b => b.AuctionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Bidder)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.BidderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

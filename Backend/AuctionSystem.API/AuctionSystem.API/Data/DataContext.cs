using AuctionSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AuctionSystem.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        // Tutaj definiujemy, jakie tabele mają powstać w bazie danych
        public DbSet<User> Users { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguracja relacji i kaskadowego usuwania, żeby baza danych działała poprawnie

            // Aukcja -> Właściciel
            modelBuilder.Entity<Auction>()
                .HasOne(a => a.Owner)
                .WithMany(u => u.Auctions)
                .HasForeignKey(a => a.OwnerId)
                .OnDelete(DeleteBehavior.Restrict); // Nie usuwamy użytkownika, jeśli ma aukcje

            // Oferta -> Aukcja
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Auction)
                .WithMany(a => a.Bids)
                .HasForeignKey(b => b.AuctionId)
                .OnDelete(DeleteBehavior.Cascade); // Jeśli usuniemy aukcję, usuną się też jej licytacje

            // Oferta -> Licytujący
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Bidder)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.BidderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
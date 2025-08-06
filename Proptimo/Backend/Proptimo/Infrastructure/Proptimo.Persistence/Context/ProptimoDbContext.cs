using Microsoft.EntityFrameworkCore;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Persistence.Context
{
    public class ProptimoDbContext : DbContext
    {
        public ProptimoDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<RealEstate> RealEstates { get; set; }
        public DbSet<RealEstateImage> RealEstateImages { get; set; }
        public DbSet<RealEstateAddress> RealEstateAddresses { get; set; }
        public DbSet<RealEstateType> RealEstateTypes { get; set; }
        public DbSet<RealEstateTypeFeature> RealEstateTypeFeatures { get; set; }
        public DbSet<RealEstateTypeFeatureValue> realEstateTypeFeatureValues { get; set; }
        public DbSet<Currency> Currencies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.Entity<RealEstateTypeFeatureValue>()
                .HasOne(fv => fv.RealEstate)
                .WithMany(re => re.FeatureValues)
                .HasForeignKey(fv => fv.RealEstateId)
                .OnDelete(DeleteBehavior.Cascade); // RealEstate silinince feature values da silinsin

            modelBuilder.Entity<RealEstateTypeFeatureValue>()
                .HasOne(fv => fv.RealEstateTypeFeature)
                .WithMany()
                .HasForeignKey(fv => fv.RealEstateTypeFeatureId)
                .OnDelete(DeleteBehavior.NoAction); // Feature silinince values silinmesin 

            // Diğer cascade davranışlarını da belirt
            modelBuilder.Entity<RealEstateImage>()
                .HasOne(img => img.RealEstate)
                .WithMany(re => re.Images)
                .HasForeignKey(img => img.RealEstateId)
                .OnDelete(DeleteBehavior.Cascade); // RealEstate silinince images da silinsin

            modelBuilder.Entity<RealEstateTypeFeature>()
                .HasOne(f => f.RealEstateType)
                .WithMany(rt => rt.RealEstateTypeFeatures)
                .HasForeignKey(f => f.RealEstateTypeId)
                .OnDelete(DeleteBehavior.Cascade); // RealEstateType silinince features da silinsin

            modelBuilder.Entity<RealEstate>()
                .Property(r => r.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<RealEstateAddress>()
                .Property(a => a.Latitude)
                .HasPrecision(9, 6);

            modelBuilder.Entity<RealEstateAddress>()
                .Property(a => a.Longitude)
                .HasPrecision(9, 6);

            modelBuilder.Entity<RealEstateTypeFeatureValue>()
                .Property(v => v.ValueDecimal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<RealEstate>()
                .HasOne(r => r.RealEstateAddress)
                .WithOne(a => a.RealEstate)
                .HasForeignKey<RealEstate>(r => r.RealEstateAddressId);

            base.OnModelCreating(modelBuilder);
        }
    }
}

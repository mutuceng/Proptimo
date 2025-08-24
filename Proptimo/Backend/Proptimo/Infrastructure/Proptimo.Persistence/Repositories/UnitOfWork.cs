using Proptimo.Application.Abstractions;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using Proptimo.Persistence.Context;
using Microsoft.EntityFrameworkCore.Storage; // IDbContextTransaction için
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Proptimo.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly ProptimoDbContext _context;
        private IDbContextTransaction? _transaction;

        public IWriteRepository<RealEstate> RealEstates { get; }
        public IWriteRepository<RealEstateImage> Images { get; }
        public IWriteRepository<RealEstateAddress> Addresses { get; }
        public IWriteRepository<RealEstateTypeFeatureValue> FeatureValues { get; }

        public UnitOfWork(
            ProptimoDbContext context,
            IWriteRepository<RealEstate> realEstates,
            IWriteRepository<RealEstateImage> images,
            IWriteRepository<RealEstateAddress> addresses,
            IWriteRepository<RealEstateTypeFeatureValue> featureValues)
        {
            _context = context;
            RealEstates = realEstates;
            Images = images;
            Addresses = addresses;
            FeatureValues = featureValues;
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task BeginTransactionAsync()
        {
            if (_transaction != null)
                return;

            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                if (_transaction != null)
                    await _transaction.CommitAsync();
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}

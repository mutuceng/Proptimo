using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Abstractions
{
    public interface IUnitOfWork : IDisposable
    {
        IWriteRepository<RealEstate> RealEstates { get; }
        IWriteRepository<RealEstateImage> Images { get; }
        IWriteRepository<RealEstateAddress> Addresses { get; }
        IWriteRepository<RealEstateTypeFeatureValue> FeatureValues { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}

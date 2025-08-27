using Proptimo.Domain.Entities.Address;
using Proptimo.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories
{
    public interface IWriteRepository<T> : IRepository<T> where T : BaseEntity
    {
        Task AddAsync(T entity);
        Task Update(T entity);
        Task<bool> DeleteAsync(string id);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task<bool> SaveChangesAsync();
    }
}

using Proptimo.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Application.Repositories
{
    public interface IReadRepository<T> : IRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(string id);
        Task<List<T>> GetAllAsync();
        IQueryable<T> GetWhere(Expression<Func<T, bool>> method);
        Task<T> GetSingleAsync(Expression<Func<T, bool>> method);
        Task<bool> AnyAsync();

    }
}

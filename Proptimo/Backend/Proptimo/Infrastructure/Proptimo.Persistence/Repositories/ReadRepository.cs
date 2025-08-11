using Microsoft.EntityFrameworkCore;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities.Common;
using Proptimo.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Persistence.Repositories
{
    public class ReadRepository<T> : IReadRepository<T> where T : BaseEntity
    {
        private readonly ProptimoDbContext _context;
        public DbSet<T> _dbSet;

        public ReadRepository(ProptimoDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<List<T>> GetAllAsync()
        {
            var list = await _dbSet.ToListAsync();
            return list;
        }
        public async Task<T> GetByIdAsync(string id)
        {
           return await _dbSet.FirstOrDefaultAsync( p => p.Id == id );
        }

        public async Task<T> GetSingleAsync(Expression<Func<T, bool>> method)
        {
            return await _dbSet.FirstOrDefaultAsync(method);
        }

        public async Task<bool> AnyAsync()
        {
            return await _dbSet.AnyAsync();
        }


        public IQueryable<T> GetWhere(Expression<Func<T, bool>> method)
        {
            return _dbSet.Where(method);
        }
    }
}

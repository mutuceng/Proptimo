using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Proptimo.Application.Repositories;
using Proptimo.Domain.Entities.Common;
using Proptimo.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proptimo.Persistence.Repositories
{
    public class WriteRepository<T> : IWriteRepository<T> where T : BaseEntity
    {
        private readonly ProptimoDbContext _context;
        private readonly DbSet<T> _dbSet;

        public WriteRepository(ProptimoDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public Task AddAsync(T entity)
        {
            return _dbSet.AddAsync(entity).AsTask();
        }

        public Task AddRangeAsync(IEnumerable<T> entities)
        {
            _dbSet.AddRange(entities);
            return Task.CompletedTask;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            T deletedEntity = await _dbSet.FirstOrDefaultAsync(p => p.Id == id);

            EntityEntry<T> entityEntry = _dbSet.Remove(deletedEntity);

            await _context.SaveChangesAsync();
            return entityEntry.State == EntityState.Deleted;
        }

        public async Task<bool> SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
            return true;
        }

        public Task Update(T entity)
        {
            _dbSet.Update(entity);
            return Task.CompletedTask;
        }
    }
}

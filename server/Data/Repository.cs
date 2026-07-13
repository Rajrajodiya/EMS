
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace server.Data
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected DbSet<T> _dbSet;
        private readonly AppDbContext appDbContext;

        public Repository(AppDbContext appDbContext)
        {
            _dbSet = appDbContext.Set<T>();
            this.appDbContext = appDbContext;
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await FindByIdAsync(id);
            _dbSet.Remove(entity); 
        }

        public async Task<T> FindByIdAsync (int id)
        {
            var entity = await _dbSet.FindAsync(id);

             return entity;
        }

        public async Task<List<T>> GetAll()
        {
            var list = await _dbSet.ToListAsync(); 
            return list ;
        }
        public async Task<List<T>> GetAll(Expression<Func<T,bool>> filter)
        {
            var list = await _dbSet.AsQueryable().Where(filter).ToListAsync();
            return list;
        }

        public void  Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public async Task<int> SaveChangeAsync()
        {
          return(await appDbContext.SaveChangesAsync());
        }
    }
}

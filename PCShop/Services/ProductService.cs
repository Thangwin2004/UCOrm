using PCShop.DesignPatterns.FactoryMethod;
using PCShop.DesignPatterns.Repository;
using PCShop.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PCShop.Services
{
    public class ProductService
    {
        private readonly IRepository<Product> _repository;
        private readonly IProductFactory _factory;

        public ProductService(IRepository<Product> repository, IProductFactory factory)
        {
            _repository = repository;
            _factory = factory;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(CategoryType category)
        {
            return await _repository.FindAsync(p => p.Category == category);
        }

        // Uses Factory Method
        public async Task AddNewProductAsync(CategoryType category, decimal price, string brand)
        {
            var newProduct = _factory.CreateProduct(category);
            newProduct.Price = price;
            newProduct.Brand = brand;

            await _repository.AddAsync(newProduct);
            await _repository.SaveChangesAsync();
        }
    }
}

using PCShop.Models;

namespace PCShop.DesignPatterns.FactoryMethod
{
    /// <summary>
    /// Pattern 2: Factory Method (Implementation)
    /// Centralizes the creation of different product types based on category.
    /// </summary>
    public class ProductFactory : IProductFactory
    {
        public Product CreateProduct(CategoryType category)
        {
            Product product;
            
            // Instantiating specific derived classes instead of the abstract Product class
            switch (category)
            {
                case CategoryType.CPU: product = new CpuProduct(); break;
                case CategoryType.GPU: product = new GpuProduct(); break;
                case CategoryType.RAM: product = new RamProduct(); break;
                case CategoryType.Motherboard: product = new MotherboardProduct(); break;
                case CategoryType.Storage: product = new StorageProduct(); break;
                case CategoryType.PowerSupply: product = new PowerSupplyProduct(); break;
                case CategoryType.Case: product = new CaseProduct(); break;
                case CategoryType.Cooler: product = new CoolerProduct(); break;
                default: product = new GenericProduct(); break;
            }

            product.Category = category;
            product.ImageUrl = GetDefaultImageForCategory(category);
            product.Specifications = "{}";
            switch (category)
            {
                case CategoryType.CPU:
                    product.Name = "New CPU";
                    break;
                case CategoryType.GPU:
                    product.Name = "New GPU";
                    break;
                case CategoryType.RAM:
                    product.Name = "New Memory";
                    break;
                case CategoryType.Motherboard:
                    product.Name = "New Motherboard";
                    break;
                case CategoryType.Storage:
                    product.Name = "New Storage Drive";
                    break;
                case CategoryType.PowerSupply:
                    product.Name = "New Power Supply";
                    break;
                case CategoryType.Case:
                    product.Name = "New PC Case";
                    break;
                case CategoryType.Cooler:
                default:
                    product.Name = "New Component";
                    break;
            }

            return product;
        }

        private string GetDefaultImageForCategory(CategoryType category)
        {
            return category switch
            {
                CategoryType.CPU => "/images/cpu.jpg",
                CategoryType.GPU => "/images/gpu.jpg",
                CategoryType.RAM => "/images/ram.jpg",
                CategoryType.Motherboard => "/images/mobo.jpg",
                CategoryType.Storage => "/images/ssd.jpg",
                CategoryType.PowerSupply => "/images/psu.jpg",
                CategoryType.Case => "/images/case.jpg",
                CategoryType.Cooler => "/images/cooler.jpg",
                _ => "/images/default.jpg"
            };
        }
    }
}

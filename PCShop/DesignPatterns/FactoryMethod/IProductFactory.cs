using PCShop.Models;

namespace PCShop.DesignPatterns.FactoryMethod
{
    /// <summary>
    /// Pattern 2: Factory Method (Interface)
    /// Defines an interface for creating an object, but let subclasses decide which class to instantiate.
    /// </summary>
    public interface IProductFactory
    {
        Product CreateProduct(CategoryType category);
    }
}

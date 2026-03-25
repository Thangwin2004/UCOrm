using PCShop.Models;

namespace PCShop.DesignPatterns.AbstractFactory
{
    /// <summary>
    /// Pattern 3: Abstract Factory (Concrete Intel Factory)
    /// Creates a family of related Intel components.
    /// </summary>
    public class IntelBuildFactory : IPCBuildFactory
    {
        public Product CreateCPU()
        {
            return new CpuProduct
            {
                Name = "Intel Core i9-14900K",
                Brand = "Intel",
                Category = CategoryType.CPU,
                Price = 399.99m,
                Description = "20 Cores (8P+12E), 28 Threads",
                ImageUrl = "/images/cpu.jpg"
            };
        }

        public Product CreateMotherboard()
        {
            return new MotherboardProduct
            {
                Name = "ASUS ROG MAXIMUS Z790 HERO",
                Brand = "ASUS",
                Category = CategoryType.Motherboard,
                Price = 499.99m,
                Description = "LGA 1700 ATX Motherboard",
                ImageUrl = "/images/mobo.jpg"
            };
        }

        public Product CreateRAM()
        {
            return new RamProduct
            {
                Name = "Corsair Vengeance DDR5 64GB (2x32GB) 6000MHz",
                Brand = "Corsair",
                Category = CategoryType.RAM,
                Price = 179.99m,
                Description = "Optimized for Intel XMP 3.0",
                ImageUrl = "/images/ram.jpg"
            };
        }

        public string GetPlatformName() => "Intel Enthusiast Build";
    }
}

using PCShop.Models;

namespace PCShop.DesignPatterns.AbstractFactory
{
    /// <summary>
    /// Pattern 3: Abstract Factory (Concrete AMD Factory)
    /// Creates a family of related AMD components.
    /// </summary>
    public class AmdBuildFactory : IPCBuildFactory
    {
        public Product CreateCPU()
        {
            return new CpuProduct
            {
                Name = "AMD Ryzen 9 7950X3D",
                Brand = "AMD",
                Category = CategoryType.CPU,
                Price = 399.99m,
                Description = "8 Cores, 16 Threads, 3D V-Cache",
                ImageUrl = "/images/cpu.jpg"
            };
        }

        public Product CreateMotherboard()
        {
            return new MotherboardProduct
            {
                Name = "MSI MEG X670E GODLIKE",
                Brand = "Gigabyte",
                Category = CategoryType.Motherboard,
                Price = 459.99m,
                Description = "AM5 ATX Motherboard",
                ImageUrl = "/images/mobo.jpg"
            };
        }

        public Product CreateRAM()
        {
            return new RamProduct
            {
                Name = "G.Skill Trident Z5 Neo RGB 64GB (2x32GB) 6000MHz",
                Brand = "G.Skill",
                Category = CategoryType.RAM,
                Price = 119.99m,
                Description = "Optimized for AMD EXPO",
                ImageUrl = "/images/ram.jpg"
            };
        }

        public string GetPlatformName() => "AMD Gaming Build";
    }
}

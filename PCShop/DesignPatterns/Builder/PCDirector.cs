using PCShop.Models;
using System.Linq;

namespace PCShop.DesignPatterns.Builder
{
    /// <summary>
    /// Pattern 4: Builder (Director)
    /// Controls the building process using a builder instance.
    /// E.g., Auto-generating specific builds.
    /// </summary>
    public class PCDirector
    {
        private IPCBuilder _builder;

        public PCDirector(IPCBuilder builder)
        {
            _builder = builder;
        }

        public void ChangeBuilder(IPCBuilder builder)
        {
            _builder = builder;
        }

        public void BuildHighEndGamingPC(IQueryable<Product> products)
        {
            _builder.SetBuildName("High-End 4K Gaming PC");
            _builder.SetCPU(products.FirstOrDefault(p => p.Name.Contains("7800X3D")));
            _builder.SetMotherboard(products.FirstOrDefault(p => p.Category == CategoryType.Motherboard && p.Price > 400));
            _builder.SetGPU(products.FirstOrDefault(p => p.Name.Contains("RTX 4090")));
            _builder.SetRAM(products.FirstOrDefault(p => p.Category == CategoryType.RAM && p.Price > 200));
            _builder.SetStorage(products.FirstOrDefault(p => p.Name.Contains("990 PRO")));
            _builder.SetPowerSupply(products.FirstOrDefault(p => p.Name.Contains("1000W")));
            _builder.SetCase(products.FirstOrDefault(p => p.Name.Contains("H9 Flow")));
            _builder.SetCooler(products.FirstOrDefault(p => p.Name.Contains("Kraken Elite")));
        }

        public void BuildBudgetGamingPC(IQueryable<Product> products)
        {
            _builder.SetBuildName("1080p Budget Gaming PC");
            _builder.SetCPU(products.FirstOrDefault(p => p.Name.Contains("7600X")));
            _builder.SetMotherboard(products.FirstOrDefault(p => p.Category == CategoryType.Motherboard && p.Price < 250));
            _builder.SetGPU(products.FirstOrDefault(p => p.Name.Contains("RX 7700 XT")));
            _builder.SetRAM(products.FirstOrDefault(p => p.Category == CategoryType.RAM && p.Price < 150));
            _builder.SetStorage(products.FirstOrDefault(p => p.Name.Contains("SN850X")));
            _builder.SetPowerSupply(products.FirstOrDefault(p => p.Name.Contains("850W")));
            _builder.SetCase(products.FirstOrDefault(p => p.Name.Contains("North")));
            // Stock cooler or cheap air cooler
        }
    }
}

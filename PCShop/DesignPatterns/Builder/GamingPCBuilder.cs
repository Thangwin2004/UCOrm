using PCShop.Models;

namespace PCShop.DesignPatterns.Builder
{
    /// <summary>
    /// Pattern 4: Builder (Concrete Builder)
    /// Implements steps to build a gaming-focused PC. Let's say user selects auto-build "Gaming PC".
    /// </summary>
    public class GamingPCBuilder : IPCBuilder
    {
        private PCBuild _build;

        public GamingPCBuilder()
        {
            this.Reset();
        }

        public void Reset()
        {
            this._build = new PCBuild();
        }

        public void SetBuildName(string name) => _build.BuildName = name;
        public void SetCPU(Product cpu) => _build.CPU = cpu;
        public void SetMotherboard(Product motherboard) => _build.Motherboard = motherboard;
        public void SetRAM(Product ram) => _build.RAM = ram;
        public void SetGPU(Product gpu) => _build.GPU = gpu;
        public void SetStorage(Product storage) => _build.Storage = storage;
        public void SetPowerSupply(Product psu) => _build.PowerSupply = psu;
        public void SetCase(Product pcCase) => _build.Case = pcCase;
        public void SetCooler(Product cooler) => _build.Cooler = cooler;

        public PCBuild GetBuild()
        {
            var result = this._build;
            this.Reset();
            return result;
        }
    }
}

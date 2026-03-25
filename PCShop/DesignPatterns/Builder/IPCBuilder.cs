using PCShop.Models;

namespace PCShop.DesignPatterns.Builder
{
    /// <summary>
    /// Pattern 4: Builder (Interface)
    /// Separates the construction of a complex object from its representation.
    /// Used for building customized PCs step by step.
    /// </summary>
    public interface IPCBuilder
    {
        void Reset();
        void SetBuildName(string name);
        void SetCPU(Product cpu);
        void SetMotherboard(Product motherboard);
        void SetRAM(Product ram);
        void SetGPU(Product gpu);
        void SetStorage(Product storage);
        void SetPowerSupply(Product psu);
        void SetCase(Product pcCase);
        void SetCooler(Product cooler);
        PCBuild GetBuild();
    }
}

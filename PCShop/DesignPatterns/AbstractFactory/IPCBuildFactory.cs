using PCShop.Models;

namespace PCShop.DesignPatterns.AbstractFactory
{
    /// <summary>
    /// Pattern 3: Abstract Factory (Interface)
    /// Provides an interface for creating families of related or dependent objects without specifying their concrete classes.
    /// E.g., An Intel Build vs an AMD Build.
    /// </summary>
    public interface IPCBuildFactory
    {
        Product CreateCPU();
        Product CreateMotherboard();
        Product CreateRAM();
        string GetPlatformName();
    }
}

namespace PCShop.DesignPatterns.Strategy
{
    /// <summary>
    /// Pattern 5: Strategy (Interface)
    /// Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
    /// Used for dynamic pricing calculations.
    /// </summary>
    public interface IPricingStrategy
    {
        decimal CalculatePrice(decimal basePrice);
        string GetStrategyName();
    }
}

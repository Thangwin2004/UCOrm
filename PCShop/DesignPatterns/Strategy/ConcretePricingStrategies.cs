namespace PCShop.DesignPatterns.Strategy
{
    /// <summary>
    /// Concrete Strategy: Regular Pricing (100% of price)
    /// </summary>
    public class RegularPricing : IPricingStrategy
    {
        public decimal CalculatePrice(decimal basePrice)
        {
            return basePrice;
        }

        public string GetStrategyName() => "Regular Price";
    }

    /// <summary>
    /// Concrete Strategy: Student Discount (15% off)
    /// </summary>
    public class StudentDiscountPricing : IPricingStrategy
    {
        public decimal CalculatePrice(decimal basePrice)
        {
            return basePrice * 0.85m; // 15% discount
        }

        public string GetStrategyName() => "Student Discount (-15%)";
    }

    /// <summary>
    /// Concrete Strategy: VIP Customer Pricing (20% off)
    /// </summary>
    public class VipPricing : IPricingStrategy
    {
        public decimal CalculatePrice(decimal basePrice)
        {
            return basePrice * 0.80m; // 20% discount
        }

        public string GetStrategyName() => "VIP Pricing (-20%)";
    }

    /// <summary>
    /// Strategy Context: Order Pricing Calculator
    /// </summary>
    public class PricingCalculator
    {
        private IPricingStrategy _pricingStrategy;

        public PricingCalculator(IPricingStrategy pricingStrategy)
        {
            _pricingStrategy = pricingStrategy;
        }

        public void SetStrategy(IPricingStrategy strategy)
        {
            _pricingStrategy = strategy;
        }

        public decimal CalculateFinalPrice(decimal orderTotal)
        {
            return _pricingStrategy.CalculatePrice(orderTotal);
        }
        
        public string GetCurrentStrategyName()
        {
            return _pricingStrategy.GetStrategyName();
        }
    }
}

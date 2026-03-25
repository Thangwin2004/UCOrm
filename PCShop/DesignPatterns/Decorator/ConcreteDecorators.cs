namespace PCShop.DesignPatterns.Decorator
{
    /// <summary>
    /// Concrete Decorator: Extended Warranty (+10% of base order OR fixed price)
    /// For simplicity, fixed $50.
    /// </summary>
    public class ExtendedWarrantyDecorator : OrderServiceDecorator
    {
        private const decimal WarrantyCost = 50.00m;

        public ExtendedWarrantyDecorator(IOrderService orderService) : base(orderService)
        {
        }

        public override decimal GetTotalCost()
        {
            return base.GetTotalCost() + WarrantyCost;
        }

        public override string GetDescription()
        {
            return base.GetDescription() + $", Extended 2-Year Warranty (+ ${WarrantyCost.ToString("0.00")})";
        }
    }

    /// <summary>
    /// Concrete Decorator: Express Shipping (Fixed $25)
    /// </summary>
    public class ExpressShippingDecorator : OrderServiceDecorator
    {
        private const decimal ShippingCost = 25.00m;

        public ExpressShippingDecorator(IOrderService orderService) : base(orderService)
        {
        }

        public override decimal GetTotalCost()
        {
            return base.GetTotalCost() + ShippingCost;
        }

        public override string GetDescription()
        {
            return base.GetDescription() + $", Express Shipping (+ ${ShippingCost.ToString("0.00")})";
        }
    }

    /// <summary>
    /// Concrete Decorator: PC Assembly Service ($150)
    /// </summary>
    public class AssemblyServiceDecorator : OrderServiceDecorator
    {
        private const decimal AssemblyCost = 150.00m;

        public AssemblyServiceDecorator(IOrderService orderService) : base(orderService)
        {
        }

        public override decimal GetTotalCost()
        {
            return base.GetTotalCost() + AssemblyCost;
        }

        public override string GetDescription()
        {
            return base.GetDescription() + $", Pro PC Assembly & Testing (+ ${AssemblyCost.ToString("0.00")})";
        }
    }
}

namespace PCShop.DesignPatterns.Decorator
{
    /// <summary>
    /// Pattern 7: Decorator (Component Interface)
    /// Attach additional responsibilities to an object dynamically.
    /// Decorators provide a flexible alternative to subclassing for extending functionality.
    /// Used for adding services like Extended Warranty, Express Delivery, or PC Assembly.
    /// </summary>
    public interface IOrderService
    {
        decimal GetTotalCost();
        string GetDescription();
    }

    /// <summary>
    /// Concrete Component
    /// </summary>
    public class BaseOrderService : IOrderService
    {
        private decimal _baseOrderPrice;

        public BaseOrderService(decimal baseOrderPrice)
        {
            _baseOrderPrice = baseOrderPrice;
        }

        public decimal GetTotalCost()
        {
            return _baseOrderPrice;
        }

        public string GetDescription()
        {
            return "PC Components (+ $0.00)";
        }
    }

    /// <summary>
    /// Base Decorator
    /// </summary>
    public abstract class OrderServiceDecorator : IOrderService
    {
        protected IOrderService _orderService;

        public OrderServiceDecorator(IOrderService orderService)
        {
            _orderService = orderService;
        }

        public virtual decimal GetTotalCost()
        {
            return _orderService.GetTotalCost();
        }

        public virtual string GetDescription()
        {
            return _orderService.GetDescription();
        }
    }
}

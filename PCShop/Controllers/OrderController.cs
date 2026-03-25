using Microsoft.AspNetCore.Mvc;
using PCShop.DesignPatterns.Adapter;
using PCShop.DesignPatterns.Decorator;
using PCShop.DesignPatterns.Observer;
using PCShop.DesignPatterns.Strategy;
using PCShop.Models;
using PCShop.Services;
using System.Linq;
using System.Threading.Tasks;

namespace PCShop.Controllers
{
    public class OrderController : Controller
    {
        private readonly CartService _cartService;
        private readonly PricingCalculator _pricingCalculator;
        private readonly IOrderSubject _orderNotificationManager;
        // Inject multiple payment processors to let user choose
        private readonly IEnumerable<IPaymentProcessor> _paymentProcessors;

        public OrderController(
            CartService cartService,
            PricingCalculator pricingCalculator,
            IOrderSubject orderNotificationManager,
            IEnumerable<IPaymentProcessor> paymentProcessors)
        {
            _cartService = cartService;
            _pricingCalculator = pricingCalculator;
            _orderNotificationManager = orderNotificationManager;
            _paymentProcessors = paymentProcessors;
        }

        public IActionResult Checkout()
        {
            if (!_cartService.Cart.Any())
            {
                return RedirectToAction("Index", "Cart");
            }

            ViewBag.PaymentMethods = _paymentProcessors.Select(p => p.GetType().Name).ToList();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder(Order orderForm, string paymentMethodName, bool addWarranty, bool addExpress, bool addAssembly)
        {
            if (!_cartService.Cart.Any()) return RedirectToAction("Index", "Cart");

            var order = new Order
            {
                CustomerName = orderForm.CustomerName,
                CustomerEmail = orderForm.CustomerEmail,
                PhoneNumber = orderForm.PhoneNumber,
                ShippingAddress = orderForm.ShippingAddress,
                OrderItems = _cartService.Cart.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    UnitPrice = c.Product.Price
                }).ToList()
            };

            // Calculate base cost
            decimal baseCost = order.OrderItems.Sum(i => i.UnitPrice * i.Quantity);
            
            // --- Pattern 5: Strategy Demo (Pricing) ---
            // For demo: if cart has >$2000, they get VIP pricing, if >$1000 student, else regular
            if (baseCost >= 2000)
                _pricingCalculator.SetStrategy(new VipPricing());
            else if (baseCost >= 1000)
                _pricingCalculator.SetStrategy(new StudentDiscountPricing());
            else
                _pricingCalculator.SetStrategy(new RegularPricing());

            decimal discountedCost = _pricingCalculator.CalculateFinalPrice(baseCost);

            // --- Pattern 7: Decorator Demo (Services) ---
            IOrderService orderService = new BaseOrderService(discountedCost);
            
            if (addWarranty) orderService = new ExtendedWarrantyDecorator(orderService);
            if (addExpress) orderService = new ExpressShippingDecorator(orderService);
            if (addAssembly) orderService = new AssemblyServiceDecorator(orderService);

            order.TotalAmount = orderService.GetTotalCost();
            order.ServicesFee = order.TotalAmount - discountedCost;
            order.ServicesDetails = orderService.GetDescription();
            order.PaymentMethod = paymentMethodName;

            // --- Pattern 9: Adapter Demo (Payment) ---
            var processor = _paymentProcessors.FirstOrDefault(p => p.GetType().Name == paymentMethodName);
            if (processor == null) processor = _paymentProcessors.First(); // Fallback

            bool paymentSuccess = await processor.ProcessPaymentAsync(order.TotalAmount, "ORD-" + System.DateTime.Now.Ticks);
            
            order.IsPaid = paymentSuccess;
            order.Status = paymentSuccess ? OrderStatus.Processing : OrderStatus.Pending;

            // --- Pattern 6: Observer Demo (Notifications) ---
            // The Subject was injected. Observers were added in DI.
            _orderNotificationManager.Notify(order);

            // Clear Cart (Pattern 10 Command)
            _cartService.ClearCart();

            ViewBag.Message = paymentSuccess ? "Order placed successfully!" : "Order placed but payment is pending.";
            return View("OrderConfirmation", order);
        }
    }
}

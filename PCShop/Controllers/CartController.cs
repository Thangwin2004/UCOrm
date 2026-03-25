using Microsoft.AspNetCore.Mvc;
using PCShop.Services;
using System.Threading.Tasks;

namespace PCShop.Controllers
{
    public class CartController : Controller
    {
        private readonly CartService _cartService;
        private readonly ProductService _productService;

        public CartController(CartService cartService, ProductService productService)
        {
            _cartService = cartService;
            _productService = productService;
        }

        public IActionResult Index()
        {
            return View(_cartService.Cart);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart(int productId, int quantity = 1)
        {
            var product = await _productService.GetProductByIdAsync(productId);
            if (product != null)
            {
                _cartService.AddItem(product, quantity);
                TempData["Message"] = $"{product.Name} added to cart! (Command Pattern)";
            }
            return RedirectToAction("Index", "Product");
        }

        [HttpPost]
        public async Task<IActionResult> AddMultipleToCart([FromBody] int[] productIds)
        {
            if (productIds == null || productIds.Length == 0) return BadRequest("No items selected");
            
            foreach (var id in productIds)
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product != null)
                {
                    _cartService.AddItem(product, 1);
                }
            }
            
            TempData["Message"] = "Custom build added to cart successfully!";
            return Json(new { success = true, redirectUrl = Url.Action("Index", "Cart") });
        }

        [HttpPost]
        public IActionResult RemoveFromCart(int productId)
        {
            _cartService.RemoveItem(productId);
            TempData["Message"] = "Item removed from cart. (Command Pattern)";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public IActionResult ClearCart()
        {
            _cartService.ClearCart();
            TempData["Message"] = "Cart cleared. (Command Pattern)";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        public IActionResult Undo()
        {
            _cartService.UndoLastAction();
            TempData["Message"] = "Last action undone. (Command Pattern)";
            return RedirectToAction(nameof(Index));
        }
    }
}

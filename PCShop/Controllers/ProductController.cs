using Microsoft.AspNetCore.Mvc;
using PCShop.Models;
using PCShop.Services;

namespace PCShop.Controllers
{
    public class ProductController : Controller
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        public async Task<IActionResult> Index(CategoryType? category)
        {
            IEnumerable<Product> products;
            
            if (category.HasValue)
            {
                products = await _productService.GetProductsByCategoryAsync(category.Value);
                ViewBag.CurrentCategory = category.Value.ToString();
            }
            else
            {
                products = await _productService.GetAllProductsAsync();
                ViewBag.CurrentCategory = "All Products";
            }

            return View(products);
        }

        public async Task<IActionResult> Details(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }
    }
}

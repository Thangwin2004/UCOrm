using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PCShop.DesignPatterns.AbstractFactory;
using PCShop.DesignPatterns.Builder;
using PCShop.Models;
using PCShop.Services;

namespace PCShop.Controllers
{
    public class PCBuilderController : Controller
    {
        private readonly ProductService _productService;
        private readonly PCDirector _pcDirector;
        private readonly IPCBuilder _gamingBuilder;
        private readonly IntelBuildFactory _intelFactory;
        private readonly AmdBuildFactory _amdFactory;

        public PCBuilderController(
            ProductService productService,
            PCDirector pcDirector,
            IPCBuilder gamingBuilder,
            IntelBuildFactory intelFactory,
            AmdBuildFactory amdFactory)
        {
            _productService = productService;
            _pcDirector = pcDirector;
            _gamingBuilder = gamingBuilder;
            _intelFactory = intelFactory;
            _amdFactory = amdFactory;
        }

        public IActionResult Index()
        {
            return RedirectToAction("InteractiveBuild");
        }

        public IActionResult InteractiveBuild()
        {
            var categories = Enum.GetValues(typeof(CategoryType)).Cast<CategoryType>().ToList();
            return View(categories);
        }

        [HttpGet]
        public async Task<IActionResult> GetProductsByCategory(CategoryType category)
        {
            var products = await _productService.GetAllProductsAsync();
            var filtered = products.Where(p => p.Category == category).ToList();
            return PartialView("_ProductSelectionModal", filtered);
        }

        // --- Pattern 3: Abstract Factory Demo ---
        
        public IActionResult AbstractFactoryDemo()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GeneratePlatformBuild(string platform)
        {
            IPCBuildFactory factory = platform == "Intel" ? _intelFactory : _amdFactory;

            var cpu = factory.CreateCPU();
            var mobo = factory.CreateMotherboard();
            var ram = factory.CreateRAM();
            var platformName = factory.GetPlatformName();

            ViewBag.Message = $"Generated using Abstract Factory Pattern ({platformName})";
            ViewBag.Platform = platformName;
            ViewBag.CPU = cpu;
            ViewBag.Motherboard = mobo;
            ViewBag.RAM = ram;
            
            return View("AbstractFactoryResult");
        }

        // --- Pattern 4: Builder Demo ---

        public async Task<IActionResult> BuilderDemo()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GenerateAutoBuild(string buildType)
        {
            var products = (await _productService.GetAllProductsAsync()).AsQueryable();

            if (buildType == "HighEnd")
            {
                _pcDirector.BuildHighEndGamingPC(products);
            }
            else
            {
                _pcDirector.BuildBudgetGamingPC(products);
            }

            var build = _gamingBuilder.GetBuild();
            
            ViewBag.Message = $"Generated using Builder Pattern for {build.BuildName}";
            
            return View("BuilderResult", build);
        }
    }
}

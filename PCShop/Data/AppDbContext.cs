using Microsoft.EntityFrameworkCore;
using PCShop.Models;

namespace PCShop.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed internal Categories - usually Products would have specific sub-classes
            // Since EF Core needs them mapped, we use TPH (Table-Per-Hierarchy) or just a single table with Category enum
            
            modelBuilder.Entity<CpuProduct>().HasData(
                new CpuProduct { Id = 1, Name = "Intel Core i9-14900K", Brand = "Intel", Category = CategoryType.CPU, Price = 599.99m, Description = "24 cores (8 P-cores + 16 E-cores), 32 threads, up to 6.0 GHz", ImageUrl = "/images/cpu.jpg", Specifications = "{}" },
                new CpuProduct { Id = 2, Name = "AMD Ryzen 9 7950X3D", Brand = "AMD", Category = CategoryType.CPU, Price = 699.99m, Description = "16 cores, 32 threads, up to 5.7 GHz with 3D V-Cache", ImageUrl = "/images/cpu.jpg", Specifications = "{}" },
                new CpuProduct { Id = 3, Name = "Intel Core i5-13600K", Brand = "Intel", Category = CategoryType.CPU, Price = 299.99m, Description = "14 cores (6 P-cores + 8 E-cores), 20 threads", ImageUrl = "/images/cpu.jpg", Specifications = "{}" },
                new CpuProduct { Id = 4, Name = "AMD Ryzen 5 7600X", Brand = "AMD", Category = CategoryType.CPU, Price = 249.99m, Description = "6 cores, 12 threads", ImageUrl = "/images/cpu.jpg", Specifications = "{}" }
            );

            modelBuilder.Entity<GpuProduct>().HasData(
                new GpuProduct { Id = 5, Name = "NVIDIA GeForce RTX 4090", Brand = "NVIDIA", Category = CategoryType.GPU, Price = 1599.99m, Description = "24GB GDDR6X, DLSS 3", ImageUrl = "/images/gpu.jpg", Specifications = "{}" },
                new GpuProduct { Id = 6, Name = "AMD Radeon RX 7900 XTX", Brand = "AMD", Category = CategoryType.GPU, Price = 999.99m, Description = "24GB GDDR6", ImageUrl = "/images/gpu.jpg", Specifications = "{}" },
                new GpuProduct { Id = 7, Name = "NVIDIA GeForce RTX 4070", Brand = "NVIDIA", Category = CategoryType.GPU, Price = 599.99m, Description = "12GB GDDR6X", ImageUrl = "/images/gpu.jpg", Specifications = "{}" },
                new GpuProduct { Id = 8, Name = "AMD Radeon RX 7700 XT", Brand = "AMD", Category = CategoryType.GPU, Price = 449.99m, Description = "12GB GDDR6", ImageUrl = "/images/gpu.jpg", Specifications = "{}" }
            );

            modelBuilder.Entity<RamProduct>().HasData(
                new RamProduct { Id = 9, Name = "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz", Brand = "Corsair", Category = CategoryType.RAM, Price = 129.99m, Description = "DDR5 memory CL30", ImageUrl = "/images/ram.jpg", Specifications = "{}" },
                new RamProduct { Id = 10, Name = "G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz", Brand = "G.Skill", Category = CategoryType.RAM, Price = 249.99m, Description = "DDR5 memory CL32", ImageUrl = "/images/ram.jpg", Specifications = "{}" }
            );

            modelBuilder.Entity<MotherboardProduct>().HasData(
                new MotherboardProduct { Id = 11, Name = "ASUS ROG Maximus Z790 Hero", Brand = "ASUS", Category = CategoryType.Motherboard, Price = 599.99m, Description = "LGA 1700 ATX", ImageUrl = "/images/mobo.jpg", Specifications = "{}" },
                new MotherboardProduct { Id = 12, Name = "MSI MAG B650 TOMAHAWK WIFI", Brand = "MSI", Category = CategoryType.Motherboard, Price = 219.99m, Description = "AM5 ATX", ImageUrl = "/images/mobo.jpg", Specifications = "{}" },
                new MotherboardProduct { Id = 13, Name = "GIGABYTE Z790 AORUS ELITE AX", Brand = "Gigabyte", Category = CategoryType.Motherboard, Price = 249.99m, Description = "LGA 1700 ATX", ImageUrl = "/images/mobo.jpg", Specifications = "{}" }
            );

            modelBuilder.Entity<StorageProduct>().HasData(
                new StorageProduct { Id = 14, Name = "Samsung 990 PRO 2TB PCIe 4.0 NVMe", Brand = "Samsung", Category = CategoryType.Storage, Price = 169.99m, Description = "Up to 7450 MB/s read", ImageUrl = "/images/ssd.jpg", Specifications = "{}" },
                new StorageProduct { Id = 15, Name = "WD Black SN850X 1TB PCIe 4.0 NVMe", Brand = "Western Digital", Category = CategoryType.Storage, Price = 89.99m, Description = "Up to 7300 MB/s read", ImageUrl = "/images/ssd.jpg", Specifications = "{}" }
            );

            modelBuilder.Entity<PowerSupplyProduct>().HasData(
                new PowerSupplyProduct { Id = 16, Name = "Corsair RM850x (2021) 850W", Brand = "Corsair", Category = CategoryType.PowerSupply, Price = 139.99m, Description = "80+ Gold Fully Modular", ImageUrl = "/images/psu.jpg", Specifications = "{}" },
                new PowerSupplyProduct { Id = 17, Name = "Seasonic FOCUS GX-1000 1000W", Brand = "Seasonic", Category = CategoryType.PowerSupply, Price = 169.99m, Description = "80+ Gold Fully Modular", ImageUrl = "/images/psu.jpg", Specifications = "{}" }
            );

            modelBuilder.Entity<CaseProduct>().HasData(
                new CaseProduct { Id = 18, Name = "NZXT H9 Flow", Brand = "NZXT", Category = CategoryType.Case, Price = 159.99m, Description = "ATX Mid Tower Dual Chamber", ImageUrl = "/images/case.jpg", Specifications = "{}" },
                new CaseProduct { Id = 19, Name = "Fractal Design North", Brand = "Fractal Design", Category = CategoryType.Case, Price = 139.99m, Description = "ATX Mid Tower with wood front", ImageUrl = "/images/case.jpg", Specifications = "{}" }
            );

            modelBuilder.Entity<CoolerProduct>().HasData(
                new CoolerProduct { Id = 20, Name = "NZXT Kraken Elite 360", Brand = "NZXT", Category = CategoryType.Cooler, Price = 279.99m, Description = "360mm AIO Liquid Cooler with LCD display", ImageUrl = "/images/cooler.jpg", Specifications = "{}" },
                new CoolerProduct { Id = 21, Name = "Noctua NH-D15", Brand = "Noctua", Category = CategoryType.Cooler, Price = 109.99m, Description = "Premium Dual-Tower CPU Cooler", ImageUrl = "/images/cooler.jpg", Specifications = "{}" }
            );
        }
    }
}

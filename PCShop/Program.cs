using Microsoft.EntityFrameworkCore;
using PCShop.Data;
using PCShop.DesignPatterns.AbstractFactory;
using PCShop.DesignPatterns.Adapter;
using PCShop.DesignPatterns.Builder;
using PCShop.DesignPatterns.FactoryMethod;
using PCShop.DesignPatterns.Observer;
using PCShop.DesignPatterns.Repository;
using PCShop.DesignPatterns.Singleton;
using PCShop.DesignPatterns.Strategy;
using PCShop.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// 1. Singleton Pattern for DbContext (EF Core uses Scoped by default, so we'll configure it, though truly it should be Scoped for web apps)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")),
    ServiceLifetime.Scoped); // Best practice is Scoped, Singleton for configs

// ConfigurationManager is already a Singleton internally

// 2. Factory Method
builder.Services.AddScoped<IProductFactory, ProductFactory>();

// 3. Abstract Factory (Can be grouped together or injected specifically)
builder.Services.AddScoped<IntelBuildFactory>();
builder.Services.AddScoped<AmdBuildFactory>();

// 4. Builder Pattern
builder.Services.AddScoped<IPCBuilder, GamingPCBuilder>();
builder.Services.AddScoped<PCDirector>();

// 5. Strategy Pattern
builder.Services.AddScoped<PricingCalculator>();
builder.Services.AddScoped<IPricingStrategy, RegularPricing>(); // Default Strategy

// 6. Observer Pattern
builder.Services.AddScoped<IOrderSubject, OrderNotificationManager>();
builder.Services.AddTransient<IOrderObserver, EmailNotification>();
builder.Services.AddTransient<IOrderObserver, SmsNotification>();
builder.Services.AddTransient<IOrderObserver, SystemLogObserver>();

// 8. Repository Pattern
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// 9. Adapter Pattern
builder.Services.AddScoped<MoMoApi>();
builder.Services.AddScoped<VNPaySystem>();
builder.Services.AddScoped<IPaymentProcessor, MoMoAdapter>(); // Example binding
builder.Services.AddScoped<IPaymentProcessor, VNPayAdapter>();
builder.Services.AddScoped<IPaymentProcessor, CodAdapter>();

// Application Services
builder.Services.AddScoped<ProductService>();
builder.Services.AddSingleton<CartService>(); // Singleton for simple in-memory cart demo

var app = builder.Build();

// Seed database on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();

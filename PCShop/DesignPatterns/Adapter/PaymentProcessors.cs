using System;
using System.Threading.Tasks;

namespace PCShop.DesignPatterns.Adapter
{
    /// <summary>
    /// Pattern 9: Adapter (Target Interface)
    /// Converts the interface of a class into another interface clients expect.
    /// Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.
    /// </summary>
    public interface IPaymentProcessor
    {
        Task<bool> ProcessPaymentAsync(decimal amount, string orderId);
        string GetPaymentMethodName();
    }

    // --- Simulated External Systems (Adaptees) ---

    public class MoMoApi
    {
        public async Task<string> CreateMomoPaymentRequest(double moneyAmount, string orderRef)
        {
            Console.WriteLine($"[MoMo API] Processing request for internal order {orderRef}, amount: {moneyAmount} VND");
            await Task.Delay(500); // Simulate network
            return "SUCCESS_MOMO_TXN_889922";
        }
    }

    public class VNPaySystem
    {
        public async Task<int> ExecuteTransaction(float amount, string txnReference)
        {
            Console.WriteLine($"[VNPay API] Executing transaction {txnReference}, amount: {amount} VND");
            await Task.Delay(600); // Simulate network
            return 0; // 0 means success in this hypothetical API
        }
    }

    // --- Adapters ---

    /// <summary>
    /// Adapter for MoMo API
    /// </summary>
    public class MoMoAdapter : IPaymentProcessor
    {
        private readonly MoMoApi _momoApi;

        public MoMoAdapter(MoMoApi momoApi)
        {
            _momoApi = momoApi;
        }

        public async Task<bool> ProcessPaymentAsync(decimal amount, string orderId)
        {
            // Convert decimal to double for MoMo API, multiply by 25000 (hypothetical USD to VND rate if amount was USD)
            // Assuming amount is already in correct currency for simplicity of this demo, just cast
            var momoResult = await _momoApi.CreateMomoPaymentRequest((double)amount, orderId);
            return momoResult.StartsWith("SUCCESS");
        }

        public string GetPaymentMethodName() => "MoMo E-Wallet";
    }

    /// <summary>
    /// Adapter for VNPay API
    /// </summary>
    public class VNPayAdapter : IPaymentProcessor
    {
        private readonly VNPaySystem _vnPaySystem;

        public VNPayAdapter(VNPaySystem vnPaySystem)
        {
            _vnPaySystem = vnPaySystem;
        }

        public async Task<bool> ProcessPaymentAsync(decimal amount, string orderId)
        {
            // Convert decimal to float
            var code = await _vnPaySystem.ExecuteTransaction((float)amount, orderId);
            return code == 0;
        }

        public string GetPaymentMethodName() => "VNPay Gateway";
    }

    /// <summary>
    /// Adapter for simple Cash On Delivery (no external API needed, but implements interface)
    /// </summary>
    public class CodAdapter : IPaymentProcessor
    {
        public Task<bool> ProcessPaymentAsync(decimal amount, string orderId)
        {
            Console.WriteLine($"[COD] Order {orderId} marked for Cash On Delivery. Amount to collect: {amount:C}");
            return Task.FromResult(true);
        }

        public string GetPaymentMethodName() => "Cash On Delivery (COD)";
    }
}

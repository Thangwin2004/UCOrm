using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCShop.Models
{
    public enum OrderStatus
    {
        Pending,
        Processing,
        Shipped,
        Delivered,
        Cancelled
    }

    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CustomerEmail { get; set; }

        [Required]
        public string CustomerName { get; set; }

        [Required]
        public string ShippingAddress { get; set; }

        public string PhoneNumber { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public string PaymentMethod { get; set; }
        
        public bool IsPaid { get; set; }

        // Added properties from Decorator (services)
        [Column(TypeName = "decimal(18,2)")]
        public decimal ServicesFee { get; set; }
        
        public string ServicesDetails { get; set; } // JSON format

        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
    }
}

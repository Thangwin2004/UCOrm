using System.ComponentModel.DataAnnotations;

namespace PCShop.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public string CartId { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int Quantity { get; set; }
        
        public System.DateTime DateCreated { get; set; }
    }
}

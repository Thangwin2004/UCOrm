using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PCShop.Models
{
    public enum CategoryType
    {
        CPU,
        GPU,
        RAM,
        Motherboard,
        Storage,
        PowerSupply,
        Case,
        Cooler
    }

    public abstract class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public string ImageUrl { get; set; }

        [Required]
        public CategoryType Category { get; set; }

        [Required]
        [StringLength(50)]
        public string Brand { get; set; }

        // JSON format for flexible specifications
        public string Specifications { get; set; }
    }
}

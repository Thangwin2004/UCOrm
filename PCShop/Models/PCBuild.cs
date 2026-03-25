using System.Collections.Generic;
using System.Linq;

namespace PCShop.Models
{
    public class PCBuild
    {
        public string BuildName { get; set; }
        public Product CPU { get; set; }
        public Product Motherboard { get; set; }
        public Product RAM { get; set; }
        public Product GPU { get; set; }
        public Product Storage { get; set; }
        public Product PowerSupply { get; set; }
        public Product Case { get; set; }
        public Product Cooler { get; set; }

        public decimal TotalPrice 
        {
            get 
            {
                decimal total = 0;
                if (CPU != null) total += CPU.Price;
                if (Motherboard != null) total += Motherboard.Price;
                if (RAM != null) total += RAM.Price;
                if (GPU != null) total += GPU.Price;
                if (Storage != null) total += Storage.Price;
                if (PowerSupply != null) total += PowerSupply.Price;
                if (Case != null) total += Case.Price;
                if (Cooler != null) total += Cooler.Price;
                return total;
            }
        }

        public List<Product> GetComponents()
        {
            var components = new List<Product>();
            if (CPU != null) components.Add(CPU);
            if (Motherboard != null) components.Add(Motherboard);
            if (RAM != null) components.Add(RAM);
            if (GPU != null) components.Add(GPU);
            if (Storage != null) components.Add(Storage);
            if (PowerSupply != null) components.Add(PowerSupply);
            if (Case != null) components.Add(Case);
            if (Cooler != null) components.Add(Cooler);
            return components;
        }

        public string ValidateBuild()
        {
            if (CPU == null || Motherboard == null || RAM == null || PowerSupply == null || Case == null)
                return "Missing essential components (CPU, Motherboard, RAM, PSU, or Case).";
            
            // Simplified compatibility check
            if (CPU.Brand == "Intel" && !Motherboard.Description.Contains("LGA"))
                return "CPU and Motherboard are incompatible (Intel CPU needs LGA socket).";
            
            if (CPU.Brand == "AMD" && !Motherboard.Description.Contains("AM"))
                return "CPU and Motherboard are incompatible (AMD CPU needs AM socket).";

            return "Build is valid and compatible.";
        }
    }
}

using PCShop.DesignPatterns.Command;
using PCShop.Models;
using System.Collections.Generic;

namespace PCShop.Services
{
    public class CartService
    {
        private readonly CartCommandInvoker _invoker;
        public List<CartItem> Cart { get; private set; }

        public CartService()
        {
            _invoker = new CartCommandInvoker();
            Cart = new List<CartItem>();
        }

        public void AddItem(Product product, int quantity)
        {
            var command = new AddToCartCommand(Cart, product, quantity);
            _invoker.ExecuteCommand(command);
        }

        public void RemoveItem(int productId)
        {
            var command = new RemoveFromCartCommand(Cart, productId);
            _invoker.ExecuteCommand(command);
        }

        public void ClearCart()
        {
            var command = new ClearCartCommand(Cart);
            _invoker.ExecuteCommand(command);
        }

        public void UndoLastAction()
        {
            _invoker.UndoLastCommand();
        }
    }
}

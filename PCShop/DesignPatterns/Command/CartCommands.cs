using PCShop.Models;
using System.Collections.Generic;
using System.Linq;

namespace PCShop.DesignPatterns.Command
{
    // The "Receiver" for these commands is essentially a List<CartItem> in memory for demo purposes,
    // though in a real app it would likely be a database or session wrapper.

    /// <summary>
    /// Concrete Command: Add to Cart
    /// </summary>
    public class AddToCartCommand : ICartCommand
    {
        private List<CartItem> _cart;
        private Product _product;
        private int _quantity;
        private bool _isNewItemAdded;

        public AddToCartCommand(List<CartItem> cart, Product product, int quantity)
        {
            _cart = cart;
            _product = product;
            _quantity = quantity;
        }

        public void Execute()
        {
            var cartItem = _cart.SingleOrDefault(c => c.ProductId == _product.Id);
            if (cartItem == null)
            {
                cartItem = new CartItem
                {
                    ProductId = _product.Id,
                    Product = _product,
                    Quantity = _quantity,
                    DateCreated = System.DateTime.Now
                };
                _cart.Add(cartItem);
                _isNewItemAdded = true;
            }
            else
            {
                cartItem.Quantity += _quantity;
                _isNewItemAdded = false;
            }
        }

        public void Undo()
        {
            if (_isNewItemAdded)
            {
                var item = _cart.FirstOrDefault(c => c.ProductId == _product.Id);
                if (item != null) _cart.Remove(item);
            }
            else
            {
                var item = _cart.FirstOrDefault(c => c.ProductId == _product.Id);
                if (item != null) item.Quantity -= _quantity;
            }
        }
    }

    /// <summary>
    /// Concrete Command: Remove from Cart
    /// </summary>
    public class RemoveFromCartCommand : ICartCommand
    {
        private List<CartItem> _cart;
        private int _productId;
        private CartItem _removedItem;

        public RemoveFromCartCommand(List<CartItem> cart, int productId)
        {
            _cart = cart;
            _productId = productId;
        }

        public void Execute()
        {
            _removedItem = _cart.FirstOrDefault(c => c.ProductId == _productId);
            if (_removedItem != null)
            {
                _cart.Remove(_removedItem);
            }
        }

        public void Undo()
        {
            if (_removedItem != null)
            {
                _cart.Add(_removedItem);
            }
        }
    }

    /// <summary>
    /// Concrete Command: Clear Cart
    /// </summary>
    public class ClearCartCommand : ICartCommand
    {
        private List<CartItem> _cart;
        private List<CartItem> _previousState;

        public ClearCartCommand(List<CartItem> cart)
        {
            _cart = cart;
            // Save state for undo
            _previousState = new List<CartItem>(cart);
        }

        public void Execute()
        {
            _cart.Clear();
        }

        public void Undo()
        {
            _cart.AddRange(_previousState);
        }
    }
}

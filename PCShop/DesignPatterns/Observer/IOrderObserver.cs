using PCShop.Models;

namespace PCShop.DesignPatterns.Observer
{
    /// <summary>
    /// Pattern 6: Observer (Interfaces)
    /// Defines a one-to-many dependency between objects so that when one object changes state, 
    /// all its dependents are notified and updated automatically.
    /// Used for Order Status Notifications.
    /// </summary>
    public interface IOrderObserver
    {
        void Update(Order order);
    }

    public interface IOrderSubject
    {
        void Attach(IOrderObserver observer);
        void Detach(IOrderObserver observer);
        void Notify(Order order);
    }
}

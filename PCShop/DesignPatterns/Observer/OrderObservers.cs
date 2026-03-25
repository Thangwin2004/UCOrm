using System;
using System.Collections.Generic;
using PCShop.Models;

namespace PCShop.DesignPatterns.Observer
{
    /// <summary>
    /// Concrete Subject: Order Notification Manager
    /// </summary>
    public class OrderNotificationManager : IOrderSubject
    {
        private List<IOrderObserver> _observers = new List<IOrderObserver>();

        public void Attach(IOrderObserver observer)
        {
            Console.WriteLine($"OrderNotificationManager: Attached an observer {observer.GetType().Name}.");
            _observers.Add(observer);
        }

        public void Detach(IOrderObserver observer)
        {
            _observers.Remove(observer);
            Console.WriteLine($"OrderNotificationManager: Detached an observer {observer.GetType().Name}.");
        }

        public void Notify(Order order)
        {
            Console.WriteLine("\nOrderNotificationManager: Notifying observers...");

            foreach (var observer in _observers)
            {
                observer.Update(order);
            }
        }
    }

    /// <summary>
    /// Concrete Observer 1: Email Notification
    /// </summary>
    public class EmailNotification : IOrderObserver
    {
        public void Update(Order order)
        {
            // Simulate sending an email
            Console.WriteLine($"[Email Notification] Order #{order.Id} status has changed to: {order.Status}");
            Console.WriteLine($"[Email Notification] Sending email to {order.CustomerEmail}...\n");
        }
    }

    /// <summary>
    /// Concrete Observer 2: SMS Notification
    /// </summary>
    public class SmsNotification : IOrderObserver
    {
        public void Update(Order order)
        {
            if (!string.IsNullOrEmpty(order.PhoneNumber))
            {
                // Simulate sending an SMS
                Console.WriteLine($"[SMS Notification] Order #{order.Id} is now {order.Status}");
                Console.WriteLine($"[SMS Notification] Sending SMS to {order.PhoneNumber}...\n");
            }
        }
    }

    /// <summary>
    /// Concrete Observer 3: System Logger
    /// </summary>
    public class SystemLogObserver : IOrderObserver
    {
        public void Update(Order order)
        {
            // In a real app, this would write to a database or text file
            Console.WriteLine($"[System Log] {DateTime.UtcNow}: Order {order.Id} updated by user. Status = {order.Status}");
        }
    }
}

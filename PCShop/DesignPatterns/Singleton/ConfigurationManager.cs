using System.Collections.Concurrent;

namespace PCShop.DesignPatterns.Singleton
{
    /// <summary>
    /// Pattern 1: Singleton
    /// Ensures a class has only one instance, and provide a global point of access to it.
    /// Used here to manage application-wide configuration like tax rates, shipping fees, etc.
    /// </summary>
    public sealed class ConfigurationManager
    {
        private static readonly Lazy<ConfigurationManager> _instance = 
            new Lazy<ConfigurationManager>(() => new ConfigurationManager());

        private readonly ConcurrentDictionary<string, string> _settings;

        private ConfigurationManager()
        {
            _settings = new ConcurrentDictionary<string, string>();
            
            // Default settings
            _settings.TryAdd("TaxRate", "0.10"); // 10% tax
            _settings.TryAdd("BaseShippingFee", "5.00");
            _settings.TryAdd("FreeShippingThreshold", "1000.00");
        }

        public static ConfigurationManager Instance => _instance.Value;

        public string GetSetting(string key)
        {
            return _settings.TryGetValue(key, out var value) ? value : null;
        }

        public T GetSetting<T>(string key, T defaultValue = default)
        {
            if (_settings.TryGetValue(key, out var value))
            {
                try
                {
                    return (T)Convert.ChangeType(value, typeof(T));
                }
                catch
                {
                    return defaultValue;
                }
            }
            return defaultValue;
        }

        public void SetSetting(string key, string value)
        {
            _settings.AddOrUpdate(key, value, (k, oldValue) => value);
        }
    }
}

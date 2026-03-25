using System.Collections.Generic;

namespace PCShop.DesignPatterns.Command
{
    /// <summary>
    /// Pattern 10: Command (Interface)
    /// Encapsulates a request as an object, thereby letting you parameterize clients with different requests,
    /// queue or log requests, and support undoable operations.
    /// </summary>
    public interface ICartCommand
    {
        void Execute();
        void Undo();
    }

    /// <summary>
    /// Invoker
    /// </summary>
    public class CartCommandInvoker
    {
        private Stack<ICartCommand> _commandHistory;

        public CartCommandInvoker()
        {
            _commandHistory = new Stack<ICartCommand>();
        }

        public void ExecuteCommand(ICartCommand command)
        {
            command.Execute();
            _commandHistory.Push(command);
        }

        public void UndoLastCommand()
        {
            if (_commandHistory.Count > 0)
            {
                var command = _commandHistory.Pop();
                command.Undo();
            }
        }
    }
}

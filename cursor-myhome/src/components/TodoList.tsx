import { useState } from 'react';
import { TodoItem } from '@/types';

type FilterType = 'all' | 'active' | 'completed';

export default function TodoList() {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');

    const addTodo = () => {
        if (newTodo.trim()) {
            const todo: TodoItem = {
                id: Date.now().toString(),
                content: newTodo.trim(),
                completed: false,
                createdAt: new Date(),
            };
            setTodos([...todos, todo]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id: string) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo,
            ),
        );
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl text-gray-800 font-bold mb-4">
                할 일 목록
            </h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addTodo()}
                    placeholder="Add a new todo"
                    className="flex-1 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={addTodo}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                    Add
                </button>
            </div>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded transition-colors ${
                        filter === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    전체
                </button>
                <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded transition-colors ${
                        filter === 'active'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    미완료
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded transition-colors ${
                        filter === 'completed'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    완료
                </button>
            </div>
            <ul className="space-y-2">
                {filteredTodos.map(todo => (
                    <li
                        key={todo.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                                className="w-4 h-4 cursor-pointer"
                            />
                            <span
                                className={`${
                                    todo.completed
                                        ? 'line-through text-gray-500'
                                        : ''
                                }`}
                            >
                                {todo.content}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

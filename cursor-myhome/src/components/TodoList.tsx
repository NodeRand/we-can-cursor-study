import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TodoItem } from '../types';

type FilterType = 'all' | 'active' | 'completed';

const FILTER_TYPES: FilterType[] = ['all', 'active', 'completed'];

export default function TodoList() {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const todo: TodoItem = {
            id: Date.now().toString(),
            content: newTodo.trim(),
            completed: false,
            createdAt: new Date(),
        };

        setTodos([...todos, todo]);
        setNewTodo('');
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
        <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2
                className="text-xl font-semibold mb-4 text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                할 일 목록
            </motion.h2>

            <motion.form
                onSubmit={addTodo}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={e => setNewTodo(e.target.value)}
                        placeholder="새로운 할 일을 입력하세요"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    />
                    <motion.button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        추가
                    </motion.button>
                </div>
            </motion.form>

            <motion.div
                className="flex gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                {FILTER_TYPES.map(filterType => (
                    <motion.button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-4 py-2 rounded-lg ${
                            filter === filterType
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {filterType === 'all'
                            ? '전체'
                            : filterType === 'active'
                            ? '미완료'
                            : '완료'}
                    </motion.button>
                ))}
            </motion.div>

            <motion.ul
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
            >
                <AnimatePresence>
                    {filteredTodos.map(todo => (
                        <motion.li
                            key={todo.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                    className="w-5 h-5 text-blue-600"
                                />
                                <motion.span
                                    className={
                                        todo.completed
                                            ? 'line-through text-gray-500'
                                            : 'text-gray-900'
                                    }
                                    animate={{
                                        scale: todo.completed ? 0.95 : 1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {todo.content}
                                </motion.span>
                            </div>
                            <motion.button
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-700"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                삭제
                            </motion.button>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </motion.ul>
        </motion.div>
    );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() { //home page component
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:4001/todo/fetch", {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setTodos(response.data.todos);
                setError(null);
            } catch (err) {
                setError("Failed to Fetch Todos");
            } finally {
                setLoading(false);
            }
        };
        fetchTodos();
    }, []);

    const todoCreate = async () => {
        if (!newTodo) return;
        try {
            const response = await axios.post(
                "http://localhost:4001/todo/create",
                { text: newTodo, completed: false },
                { withCredentials: true }
            );
            setTodos([response.data.newTodo, ...todos]);
            setNewTodo("");
        } catch (err) {
            setError("Failed to Create Todo");
        }
    };

    const todoStatus = async (id) => {
        const todo = todos.find((t) => t._id === id);
        try {
            const response = await axios.put(
                `http://localhost:4001/todo/update/${id}`,
                { ...todo, completed: !todo.completed },
                { withCredentials: true }
            );
            setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
        } catch (err) {
            setError("Failed to Update Todo Status");
        }
    };

    const todoDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4001/todo/delete/${id}`, {
                withCredentials: true,
            });
            setTodos(todos.filter((t) => t._id !== id));
        } catch (err) {
            setError("Failed to Delete Todo");
        }
    };
    const navigateTo = useNavigate();
    const logout = async () => {
        try {
            await axios.get("http://localhost:4001/user/logout", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }); 
            toast.success("User logged out successfully");
            navigateTo("/login");
            localStorage.removeItem("jwt");
        } catch (error) {
            toast.error("error logging out user")
        }
    }

    const remainingTodos = todos.filter((todo) => !todo.completed).length;

    return (
        <div className="bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6 my-20">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Todo App</h1>
            <div className="mb-4 flex">
                <input
                    type="text"
                    placeholder="Add a new Todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && todoCreate()}
                    className="flex-grow p-2 border rounded-l-md focus:outline-none"
                />
                <button
                    onClick={todoCreate}
                    className="bg-blue-600 border rounded-r-md text-white py-2 px-4 hover:bg-red-600 duration-300"
                >
                    Add
                </button>
            </div>
            {loading ? (<div className="text-center justify-center"><span className="text-gray-500">Loading...</span></div>) : error ? (<div className="text-center justify-center text-red-500 font-semibold">{error}</div>) :
                <ul className="space-y-2">
                    {todos.map((todo, index) => (
                        <li
                            key={todo._id || index}
                            className="flex items-center justify-between bg-white p-4 rounded-md shadow-md"
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => todoStatus(todo._id)}
                                    className="mr-2"
                                />
                                <span
                                    className={`${todo.completed ? "line-through text-gray-800 font-semibold" : ""
                                        }`}
                                >
                                    {todo.text}
                                </span>
                            </div>
                            <button
                                onClick={() => todoDelete(todo._id)}
                                className="text-red-500 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            }
            <p className="mt-4 text-center text-sm text-gray-700">{remainingTodos} remaining Todos</p>
            <button onClick={() => logout()} className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-500 mx-auto block">
                Logout
            </button>
        </div>
    );
}

export default Home;
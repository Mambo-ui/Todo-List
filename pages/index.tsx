import { useState } from "react";
import axios from "axios";
import "./globals.css";

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface TodosProps {
  todos: Todo[];
}

export default function Todos({ todos }: TodosProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<Todo[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const number = parseInt(inputValue, 10);

    if (number >= 1 && number <= 100) {
      try {
        const response = await axios.get<Todo[]>(
          `https://jsonplaceholder.typicode.com/todos?_limit=${number}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
  };

  const sortTodos = (todosData: Todo[]) => {
    const completedTrue = todosData.filter((todo) => todo.completed);
    const completedFalse = todosData.filter((todo) => !todo.completed);

    const sortedCompletedTrue = completedTrue.sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    const sortedCompletedFalse = completedFalse.sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    return [...sortedCompletedFalse, ...sortedCompletedTrue];
  };

  return (
    <div className=" bg-gray-50 flex flex-col place-content-center">
      <div>
        <div className="max-w-md mx-auto mt-4 flex px-4 font-sans text-xl">
          <h1 className="text-3xl block font-bold ">Todo List</h1>
        </div>
        <div className="px-5">
          <p>Enter number of Todos below:</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <div className="flex flex-col p-6 rounded-md max-w-md mx-5 mt-4 bg-white border border-gray-300 gap-y-8  justify-center items-center grid-cols-2 gap-4">
          <div className="p-5">
            {" "}
            <input
              className="flex w-full border p-2 border-black rounded-lg shadow-sm focus:outine-none "
              type="number"
              min="1"
              max="100"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="p-5">
            <button
              className="flex md:w-auto bg-transparent hover:bg-blue-400 text-blue-700 font-semibold hover:text-white py-2 px-10 border-2 border-blue-500 hover:border-transparent rounded-full"
              type="submit"
            >
              Fetch Todos
            </button>
          </div>
        </div>
      </form>
      <div className="mt-5 mx-8">
        <h2 className="font-medium text-3xl">Todos: </h2>
      </div>
      <div className="mx-8">
        {searchResults.length > 0 && (
          <ul>
            {sortTodos(searchResults).map((todo) => (
              <li className="list-inside list-decimal mx-8" key={todo.id}>
                <span>{todo.title}</span>
                <span>
                  {todo.completed ? " - Completed" : " - Not Completed"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      todos: [],
    },
  };
}

import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export interface Todo {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export const loader: LoaderFunction = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10')
    return response.json()
}

export default function Index() {
    const todos = useLoaderData<Todo[]>();

    return (
        <>
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">Todos</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Novo todo 
                        </button>
                    </div>
                </div>
                <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>

                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                >
                                    Titulo
                                </th>

                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only"></span>
                                </th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {todos.map((todo) => (
                                <tr key={todo.id}>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{todo.title}</td>
                                    {/* <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{todo.body}</td> */}
                                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2">
                                            Editar<span className="sr-only">, {todo.id}</span>
                                        </a>
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                            Delete<span className="sr-only">, {todo.id}</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

        </>
    );
}





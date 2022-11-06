import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useFormAction, useLoaderData } from "@remix-run/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export interface Todo {
    id: string;
    title: string;
}

export const loader: LoaderFunction = async () => {
    const response = await fetch(`${process.env.API_URL }/todo`)
    return response.json()
}

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData()
    const action = form.get("action");
    const id = form.get("id");

    try {
        if (action === 'delete') {
            await fetch(`${process.env.API_URL }/todo/${id}`, {
                method: "DELETE"
            })
        }
        return null;
    } catch (error) {
        console.log("error", error)
    }
}

function deleteTodo(id: string) {
    console.log(id)
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
                        <div className="flex justify-between items-center">
                            <Link to="todo/new"> Novo</Link>
                        </div>
                    </button>
                </div>
            </div>
            <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>

                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
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
                                <td className="px-3 py-4 text-sm text-gray-500 ">{todo.title}</td>
                                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 justify-between">

                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

                                    >
                                        <Link to={`todo/${todo.id}`} >
                                            <FiEdit size={15} /><span className="sr-only">, {todo.id}</span>
                                        </Link>
                                    </button>
                                    <Form method="post">
                                        <input type="hidden" name="action" value="delete" />
                                        <input type="hidden" name="id" value={todo.id} />
                                        <button
                                            type="submit"
                                            className="inline-flex items-center rounded border border-transparent bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"

                                        >
                                            <FiTrash2 size={15} /><span className="sr-only">, {todo.id}</span>
                                        </button>
                                    </Form>



                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    );
}





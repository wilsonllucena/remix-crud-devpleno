import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
    const { id } = params;

    try {
        return await fetch(`${process.env.URI_API}/todo/${id}`, {
            method: 'DELETE'
        });

    } catch (error) {
        console.log(error)
        console.error("Opa aconteceu algo de errado")
    }
}


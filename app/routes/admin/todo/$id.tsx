import Input from "~/components/input";
import { Form as FormReact, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { z } from "zod";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";

type ActionData = { errors: z.ZodIssue[] }

const schema = z.object({
    title: z.string().min(5, "Por favor preencha o campo ")
})

export const loader: LoaderFunction = async ({ params }) => {
    const { id } = params;

    try {
        const response = await fetch(`${ process.env.URI_API }/todo/${id}`);
        return response.json();
    } catch (error) {
        console.log(error)
        console.error("Opa aconteceu algo de errado")
    }
}

export const action: ActionFunction = async ({ request, params }) => {
    const { id } = params;
    const formValues = Object.fromEntries(await request.formData())
    const result = schema.safeParse(formValues)

    if (!result.success) {
        return json<ActionData>({ errors: result.error.issues })
    }

    try {
        await fetch(`${process.env.URI_API }/todo/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: formValues.title,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        return redirect("/admin");
    } catch (error) {
        console.log("Verifique os logs algo deu errado!");
        console.log(error)
    }
}

function Error(props: JSX.IntrinsicElements['div']) {
    return <div {...props} className="text-xs text-red-500 w-full tracking-wide" />
}

function ServerError({ name }: { name: string }) {
    const errors = useActionData<ActionData>()?.errors
    const message = errors?.find(({ path }) => path[0] === name)?.message

    if (!message) return null

    return <Error>{message}</Error>
}

function FieldError({ name, errors }: { name: string; errors: any }) {
    const message = errors[name]?.message

    if (message) {
        return <Error>{message}</Error>
    }

    return <ServerError name={name} />
}
export default function TodoEdit() {
    const resolver = zodResolver(schema)
    const { register, handleSubmit, formState } = useForm({ resolver })
    const { errors } = formState
    const submit = useSubmit()
    const data = useLoaderData()
    return (
        <FormReact
            method="post"
            onSubmit={(event: any) => {
                handleSubmit(() => submit(event.target))
            }}
        >
            <div className="flex justify-around">
                <Input  {...register("title")} placeholder="Titulo" defaultValue={data.title} />
                <FieldError name="title" errors={errors} />

                <button type="submit" className=" ml-1  justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Atualizar
                </button>
            </div>
        </FormReact>

    )
}
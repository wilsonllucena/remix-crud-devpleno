import Input from "~/components/input";
import { Form as FormReact, useActionData, useSubmit } from "@remix-run/react";
import { z } from "zod";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";

type ActionData = { errors: z.ZodIssue[] }

const schema = z.object({
    title: z.string().min(5, "Por favor preencha o campo ")
})

export const action: ActionFunction = async ({ request }) => {
    const formValues = Object.fromEntries(await request.formData())
    const result = schema.safeParse(formValues)

    if (!result.success) {
        return json<ActionData>({ errors: result.error.issues })
    }
    
    await fetch(`${process.env.URI_API}/todo`, {
        method: 'POST',
        body: JSON.stringify({
            title: formValues.title,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })

    return redirect("/admin");
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
export default function New() {
    const resolver = zodResolver(schema)
    const { register, handleSubmit, formState } = useForm({ resolver })
    const { errors } = formState
    const submit = useSubmit()
    return (
        <FormReact
            method="post"
            onSubmit={(event: any) => {
                handleSubmit(() => submit(event.target))
            }}
        >
            <div className="flex justify-around">
                <Input  {...register("title")} placeholder="Titulo" />
                <FieldError name="title" errors={errors} />

                <button type="submit" className=" ml-1  justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Cadastrar
                </button>
            </div>
        </FormReact>

    )
}
import type { ActionFunction } from 'remix';
import { Form, redirect } from 'remix';
import { db } from '~/utils/db.server';
import Container from '~/components/Container';
import { PlusIcon } from '@heroicons/react/solid';
import { useEffect, useRef } from 'react';

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const title = form.get('title');
    if (typeof title !== 'string') {
        throw new Error(`Form not submitted correctly.`);
    }

    const fields = { title };

    // const task = await db.task.create({ data: fields });
    return await db.task.create({ data: fields });
    // return redirect(`/tasks/new`);
};

{
    /* <button
    type="submit"
    className="transition-colors button py-2 px-4 bg-black text-white rounded-lg hover:bg-white border border-black hover:text-black hover:border-black"
>
    <PlusIcon className="w-5 h-5" />
    <span className="sr-only">Add task</span>
</button> */
}

export default function NewTaskRoute() {
    return (
        <Container>
            <h1 className="text-3xl font-bold">New Task</h1>
            <Form method="post">
                <div>
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <label htmlFor="title" className="sr-only">
                            Task:
                        </label>
                        <input
                            autoFocus
                            id="title"
                            type="text"
                            name="title"
                            className="block w-full rounded-none rounded-l-md border-black focus:border-black focus:ring-black sm:text-sm"
                        />
                        <button
                            type="submit"
                            className="group relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        >
                            <PlusIcon className="h-5 w-5 " aria-hidden="true" />
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </Form>
        </Container>
    );
}

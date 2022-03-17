import { LoaderFunction, ActionFunction, useTransition } from 'remix';
import { Form, json, Link, Outlet, useLoaderData } from 'remix';
import Container from '~/components/Container';
import { Task } from '@prisma/client';
import { CheckIcon, PlusIcon } from '@heroicons/react/solid';
import { addTask, archiveTask, getActiveTasks } from '~/utils/db.tasks';
import { useEffect, useRef } from 'react';

type LoaderData = { tasks: Array<Task> };
export const loader: LoaderFunction = async () => {
    const data: LoaderData = await getActiveTasks();
    return json(data);
};

export const action: ActionFunction = async ({ request }) => {
    let form = await request.formData();
    let { _action, ...values } = Object.fromEntries(form);

    console.log('_action');
    console.log(_action);
    console.log(values);

    if (_action === 'create') {
        const title = form.get('title');
        // TODO: validate title length

        if (String(title).length < 3) {
            throw new Error(`Too short.`);
        }
        if (typeof title !== 'string') {
            throw new Error(`Form not submitted correctly.`);
        }
        return await addTask(title);
    }

    if (_action === 'close') {
        console.log(values.completed);
        console.log(values.completed === 'true');
        console.log('archiving task: ' + values.id);
        return await archiveTask(String(values.id));
    }
};

export default function Tasks() {
    const tasks = useLoaderData<LoaderData>().tasks;
    let transition = useTransition();
    let isAdding =
        transition.state === 'submitting' &&
        transition.submission.formData.get('_action') === 'create';

    let formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        if (!isAdding) {
            formRef.current?.reset();
        }
    }, [isAdding]);
    // console.log(tasks);
    // TODO: pending UI

    return (
        <Container>
            <h1 className="text-3xl font-bold">Tasks</h1>
            {!tasks.length && 'Add your first task'}
            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center">
                        <Form method="post" className="pr-3">
                            <input type="hidden" name="id" value={task.id} />
                            <input
                                type="hidden"
                                name="completed"
                                value={Number(task.completed)}
                            />
                            <input
                                type="hidden"
                                name="created"
                                value={task.created.toString()}
                            />
                            <button
                                type="submit"
                                aria-label="close"
                                name="_action"
                                value="close"
                                className="rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:bg-black hover:text-white"
                            >
                                <CheckIcon className="h-5 w-5" />
                            </button>
                            {/* <div className="prose">
                                    <pre>{JSON.stringify(task, null, 2)}</pre>
                                </div> */}
                        </Form>
                        {task.title}
                    </li>
                ))}
                <li>
                    <Form ref={formRef} replace method="post">
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
                                    className="block w-full rounded-none rounded-l-md border-2 border-black focus:border-black focus:ring-0 sm:text-sm"
                                />
                                <button
                                    type="submit"
                                    aria-label="create"
                                    name="_action"
                                    value="create"
                                    className=" group relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                >
                                    <PlusIcon
                                        className="h-5 w-5 "
                                        aria-hidden="true"
                                    />
                                    <span>Add</span>
                                </button>
                            </div>
                        </div>
                    </Form>
                </li>
            </ul>

            <div className="">
                <Outlet />
            </div>
        </Container>
    );
}

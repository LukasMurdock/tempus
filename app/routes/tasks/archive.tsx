import type { LoaderFunction, ActionFunction } from 'remix';
import { Form, json, Outlet, useLoaderData, redirect } from 'remix';
import { db } from '~/utils/db.server';
import Container from '~/components/Container';
import { Task } from '@prisma/client';
import { CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid';
import { getArchivedTasks } from '~/utils/db.tasks.server';

type LoaderData = { tasks: Array<Task> };
export const loader: LoaderFunction = async () => {
    const data: LoaderData = await getArchivedTasks();
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

        const fields = { title };

        return await db.task.create({ data: fields });
    }

    if (_action === 'close') {
        console.log(values.completed);
        console.log(values.completed === 'true');
        await db.task.update({
            where: {
                id: String(values.id),
            },
            data: {
                completed: true,
            },
        });
        // await db.task.delete({ where: { id: String(values.id) } });
        return redirect('/tasks');
    }

    if (_action === 'delete') {
        return await db.task.delete({
            where: {
                id: String(values.id),
            },
        });
    }
};

export default function ArchivedTasks() {
    const tasks = useLoaderData<LoaderData>().tasks;
    // console.log(tasks);
    // TODO: pending UI

    return (
        <Container>
            <h1 className="text-3xl font-bold">Archive</h1>
            {!tasks.length && 'Empty archive!'}
            <ul>
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center py-2">
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
                                aria-label="delete"
                                name="_action"
                                value="delete"
                                className="rounded-md border-2 border-black bg-white p-1 text-black transition-colors hover:bg-black hover:text-white"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                            {/* <div className="prose">
                                    <pre>{JSON.stringify(task, null, 2)}</pre>
                                </div> */}
                        </Form>
                        <div className="flex w-full">
                            <span className="flex-grow">{task.title}</span>
                            <span>{task.updated.toString().split('T')[0]}</span>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="">
                <Outlet />
            </div>
        </Container>
    );
}

import {
    LoaderFunction,
    ActionFunction,
    useTransition,
    useActionData,
} from 'remix';
import { Form, json, Link, Outlet, useLoaderData } from 'remix';
import Container from '~/components/Container';
import { CalendarEvent } from '@prisma/client';
import {
    CheckIcon,
    PencilAltIcon,
    PencilIcon,
    PlusIcon,
} from '@heroicons/react/solid';
import { useEffect, useRef } from 'react';
import {
    addCalendarEvent,
    getCalendarEvents,
} from '~/utils/db.calendarEvent.server';
import { parseISO } from 'date-fns';
import Occurrence from '~/components/Occurence';

type LoaderData = { tasks: Array<CalendarEvent> };
export const loader: LoaderFunction = async () => {
    const data: LoaderData = await getCalendarEvents();
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
        const timeForm = form.get('time');

        if (typeof title !== 'string') {
            throw new Error(`Form not submitted correctly.`);
        }

        if (title.length < 3) {
            return json({ errors: { title: 'Make an actual title' } });
        }
        const time = new Date(String(timeForm));

        return await addCalendarEvent({ title, time });
    }
};

export default function Tasks() {
    const tasks = useLoaderData<LoaderData>().tasks;
    const actionData = useActionData();
    console.log(actionData);
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
    // TODO: pending UI
    const currentDate = new Date();

    return (
        <Container>
            <h1 className="text-3xl font-bold">Events</h1>
            {!tasks.length && 'Add your first event'}
            <ul className="space-y-2">
                {tasks.map((calendarEvent) => (
                    <Occurrence
                        key={calendarEvent.id}
                        event={calendarEvent}
                        currentDate={currentDate}
                    />
                ))}
                <li>
                    <Form ref={formRef} replace method="post">
                        <div className="space-y-2">
                            <input
                                required
                                type="datetime-local"
                                id="time"
                                name="time"
                                className="block w-full rounded-md border-2 border-black focus:border-black focus:ring-0 sm:text-sm"
                            />

                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                <label htmlFor="title" className="sr-only">
                                    Event:
                                </label>
                                <input
                                    autoFocus
                                    id="title"
                                    placeholder="Event title"
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
                    {actionData?.errors?.title ? (
                        <p className="text-red-400">
                            {actionData.errors.title}
                        </p>
                    ) : null}
                </li>
            </ul>

            <div className="">
                <Outlet />
            </div>
        </Container>
    );
}

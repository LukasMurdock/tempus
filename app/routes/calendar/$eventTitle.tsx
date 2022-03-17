import { CalendarEvent } from '@prisma/client';
import { json, LoaderFunction, useLoaderData } from 'remix';
import { getCalendarEvent } from '~/utils/db.calendarEvent.server';

type LoaderData = { events: CalendarEvent[] };
export const loader: LoaderFunction = async ({ params }) => {
    console.log(params);
    const eventTitle = params.eventTitle ?? null;
    if (!eventTitle) throw new Error('Event not found');
    // if (!eventTitle) {
    //     return json({ error: { title: 'Event does not exist' } });
    // }
    return await getCalendarEvent(eventTitle);
};

export default function EditCalendarEvent() {
    console.log();
    const calendarEvents = useLoaderData<LoaderData>().events;
    console.log(calendarEvents);
    return (
        <div>
            {calendarEvents.map((event) => (
                <div key={event.id}>
                    <p>{event.title}</p>
                </div>
            ))}
        </div>
    );
}

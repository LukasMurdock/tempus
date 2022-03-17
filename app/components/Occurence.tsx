import { PencilIcon } from '@heroicons/react/solid';
import { CalendarEvent } from '@prisma/client';
import {
    format,
    formatDuration,
    intervalToDuration,
    isAfter,
    parseISO,
} from 'date-fns';
import { Form, Link } from 'remix';

export default function Occurrence({
    event,
    currentDate,
}: {
    event: CalendarEvent;
    currentDate: Date;
}) {
    const eventDate = parseISO(String(event.time));
    const isPassed = isAfter(currentDate, eventDate); // isStartPassed?
    const duration = intervalToDuration({
        start: currentDate,
        end: eventDate,
    });
    const timeUntil = formatDuration(duration, {
        //   delimiter: ' ',
        format: ['months', 'weeks', 'days', 'hours', 'minutes'],
    });
    return (
        <li key={event.id} className="flex items-center">
            <Form method="post" className="pr-3">
                <input type="hidden" name="id" value={event.id} />
                <input
                    type="hidden"
                    name="time"
                    value={event.time.toString()}
                />
                <input
                    type="hidden"
                    name="created"
                    value={event.created.toString()}
                />
                <Link to={`/calendar/${event.title}`}>
                    <div className="rounded-md border-2 border-white bg-white p-1 text-black transition-colors hover:border-black hover:bg-black hover:text-white">
                        <PencilIcon className="h-5 w-5" />
                    </div>
                </Link>
                {/* <div className="prose">
                <pre>{JSON.stringify(task, null, 2)}</pre>
            </div> */}
            </Form>
            <div>
                <p>{event.title}</p>
                <p>
                    <time>
                        {isPassed
                            ? format(
                                  parseISO(String(event.time)),
                                  'yyyy-mm-dd hh:mm aa'
                              )
                            : timeUntil}
                    </time>
                </p>
            </div>
        </li>
    );
}

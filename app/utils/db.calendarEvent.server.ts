import { db } from '~/utils/db.server';

export async function addCalendarEvent({
    title,
    time,
}: {
    title: string;
    time: Date;
}) {
    return db.calendarEvent.create({ data: { title, time } });
}

export async function getCalendarEvent(title: string) {
    const data = await db.calendarEvent.findMany({
        where: {
            title: title,
        },
    });
    return {
        events: data,
    };
}

export async function getCalendarEvents() {
    const data = await db.calendarEvent.findMany();
    return {
        tasks: data,
    };
}

export async function deleteCalendarEvent(id: string) {
    return db.task.delete({
        where: {
            id: id,
        },
    });
}

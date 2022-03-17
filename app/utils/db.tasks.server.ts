import { db } from '~/utils/db.server';

export async function addTask(title: string) {
    return db.task.create({ data: { title } });
}

export async function getActiveTasks() {
    const data = await db.task.findMany({ where: { completed: false } });
    return {
        tasks: data,
    };
}

export async function getArchivedTasks() {
    const data = await db.task.findMany({ where: { completed: true } });
    return {
        tasks: data,
    };
}

export async function archiveTask(id: string) {
    return db.task.update({
        where: {
            id: id,
        },
        data: {
            completed: true,
        },
    });
}

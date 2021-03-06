import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
    await Promise.all(
        getTasks().map((task) => {
            return db.task.create({ data: task })
        })
    )
}

seed()

function getTasks() {
    return [
        {
            title: 'First',
        },
        {
            title: 'Second',
        },
    ]
}

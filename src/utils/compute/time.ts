export function isInClassTime(
    weekday: number,
    startTime: string,
    endTime: string
): boolean {
    const now = new Date()
    const currentWeekday = now.getDay() === 0 ? 7 : now.getDay()
    if (currentWeekday !== weekday) return false

    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)

    const start = new Date(now)
    start.setHours(sh, sm, 0, 0)

    const end = new Date(now)
    end.setHours(eh, em, 0, 0)

    return now >= start && now <= end
}
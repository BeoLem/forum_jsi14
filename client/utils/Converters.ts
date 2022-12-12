export const ElapsedTimeConverter = (timestamp: Date): string => {
    const created = timestamp.getTime()
    let periods = {
        year: 365 * 30 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000,
    }
    let diff = Date.now() - created

    let finalResult = 'Just now'

    Object.entries(periods)
        .reverse()
        .map((entry: [string, number]) => {
            if (diff >= entry[1]) {
                let result = Math.floor(diff / entry[1])
                finalResult = `${result} ${
                    result === 1 ? entry[0] : entry[0] + 's'
                } ago`
            }
        })

    return finalResult
}

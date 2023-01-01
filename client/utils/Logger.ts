import chalk from 'chalk'

class Logger {
    constructor() {}

    public info(...args: any[]) {
        const date = new Date(Date.now())
        let string = ``
        string += chalk.blue(
            `[${date.getDate()}-${date.getMonth()}-${date.getFullYear()} | ${date.toLocaleTimeString()}] `
        )
        string += chalk.green(`[CLIENT] [INFO] `)
        string += chalk.greenBright(
            args
                .filter((v) => typeof v == 'string' || typeof v == 'number')
                .join(' || ')
        )
        console.log(string)
        args.filter((v) => typeof v !== 'string' && typeof v !== 'number').map(
            (v) => console.log(v)
        )
    }

    public warn(...args: any[]) {
        const date = new Date(Date.now())
        let string = ``
        string += chalk.blue(
            `[${date.getDate()}-${date.getMonth()}-${date.getFullYear()} | ${date.toLocaleTimeString()}] `
        )
        string += chalk.yellow(`[CLIENT] [WARN] `)
        string += chalk.yellowBright(
            args
                .filter((v) => typeof v == 'string' || typeof v == 'number')
                .join(' || ')
        )
        console.log(string)
        args.filter((v) => typeof v !== 'string' && typeof v !== 'number').map(
            (v) => console.log(v)
        )
    }

    public error(...args: any[]) {
        const date = new Date(Date.now())
        let string = ``
        string += chalk.blue(
            `[${date.getDate()}-${date.getMonth()}-${date.getFullYear()} | ${date.toLocaleTimeString()}] `
        )
        string += chalk.red(`[CLIENT] [ERROR] `)
        string += chalk.redBright(
            args
                .filter((v) => typeof v == 'string' || typeof v == 'number')
                .join(' || ')
        )
        console.log(string)
        args.filter((v) => typeof v !== 'string' && typeof v !== 'number').map(
            (v) => console.log(v)
        )
    }

    public log(...args: any[]) {
        this.info(...args)
    }
}

const logger = new Logger()

export = logger

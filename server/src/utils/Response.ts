import { Response, OResponseCode } from '../typings/Response'

export const CreateRespond = (
    message: string | null = null,
    code: number,
    additional: object | null | undefined = {}
) => {
    if (Object.keys(OResponseCode).includes(code.toString()) && !message) {
        const index = Object.keys(OResponseCode).findIndex(
            (v) => v == `${code}`
        )
        message = Object.entries(OResponseCode)[index][1]
    }

    return {
        message,
        statusCode: code,
        timestamp: new Date().toISOString(),
        ...additional,
    }
}

import { NextFunction, Request, Response } from 'express'
import { CreateRespond } from '../utils/Response'

type ValidateType = 'string' | 'number' | 'array' | 'object' | 'email'

interface ValidateOptions {
    name: string
    type: ValidateType
    required: true | false
}

const CheckType = (type: ValidateType, value: any) => {
    switch (type) {
        case 'array':
            if (!Array.isArray(value)) return false
            break
        case 'email':
            if (typeof value != 'string') return false
            const emailRegex =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            if (!value.match(emailRegex)) return false
            break
        default:
            if (typeof value !== type) return false
            break
    }
    return true
}

export const ValidateBody = (options: ValidateOptions[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const body = req.body
        const failures: string[] = []
        options.map((data) => {
            if (!data.required && !body[data.name]) return
            CheckType(data.type, body[data.name])
                ? null
                : failures.push(data.name)
        })
        if (failures.length > 0)
            return res
                .status(400)
                .send(
                    CreateRespond(
                        `Validation Failed! Missing or sending wrong type of ${failures.join(
                            ', '
                        )} fields.`,
                        400
                    )
                )
        next()
    }
}

export const ValidateHeader = (options: ValidateOptions[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const headers = req.headers
        const failures: string[] = []
        options.map((data) => {
            data.name = data.name.toLowerCase()
            if (!data.required && !headers[data.name]) return
            CheckType(data.type, headers[data.name])
                ? null
                : failures.push(data.name)
        })
        if (failures.length > 0)
            return res
                .status(400)
                .send(
                    CreateRespond(
                        `Validation Failed! Missing or sending wrong type of ${failures.join(
                            ', '
                        )} fields.`,
                        400
                    )
                )
        next()
    }
}

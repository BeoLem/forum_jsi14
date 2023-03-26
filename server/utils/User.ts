import argon2 from "argon2"
import config from 'config'

export const HashPassword = async(password: string) => {
    return await argon2.hash(password)
}

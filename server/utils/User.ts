import bcrypt from 'bcrypt'
import config from 'config'

const salt = config.get('backend.bcrypt.salt') as number

export const HashPassword = (password: string) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(salt))
}

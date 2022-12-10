export const JWTCheck = (token: string): boolean => {
    const regex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    return regex.test(token)
}

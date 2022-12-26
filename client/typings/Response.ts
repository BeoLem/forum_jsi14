import express from 'express'
import { CUser } from '../documents/User'
import { CSession } from '../documents/Session'

export interface Response extends express.Response {
    locals: {
        user?: TResponseLocalsUser
        session?: TResponseLocalsSession
    }
}

export type TResponseLocalsUser = CUser & {
    id: string
}

export type TResponseLocalsSession = CSession & {
    id: string
}
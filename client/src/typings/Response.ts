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

export const OResponseCode = {
    // Information
    '100': 'Continue',
    '101': 'Switching Protocols',
    '102': 'Processing',
    '103': 'Early Hints',

    // Successful
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '207': 'Multi-Status',
    '208': 'Already Reported',
    '209': 'IM Used',

    // Redirection
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Unused',
    '307': 'Temporary Redirect',
    '308': 'Permanent Redirect',

    // Client Error
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '407': 'Proxy Authentication Required',
    '409': 'Conflict',
    '429': 'Too Many Requests',

    // Server Error
    '500': 'Internal Server Error',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
}

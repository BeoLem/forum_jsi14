import { Request } from 'express';
import config from 'config';

export function getHost(req: Request) {
    return req.protocol + '://' + req.get('host');
}
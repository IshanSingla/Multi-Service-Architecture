import { Response } from 'express';
import { logger } from './logger';
import morgan from 'morgan';

export const morganInstance = morgan(
    (tokens: any, req: any, res: Response) => {
        return [
            'method=' + tokens.method(req, res),
            'host=' + req.hostname,
            'uri=' + tokens.url(req, res),
            'ssl=' + (req.secure ? 'true' : 'false'),
            'user=' +
                (req.user
                    ? `${req.user.id}[${req.user.role}]`
                    : 'UnAuthorise'),
            'address[ip]=' + tokens['remote-addr'](req, res),
            'user_agent=' + tokens['user-agent'](req, res), // Log user agent
            'body=' + JSON.stringify(req.body), // Log request body
            'query=' + JSON.stringify(req.query),
            'response_time=' +
                tokens['response-time'](req, res) +
                'ms',
            'status=' + tokens.status(req, res),
            'bytes=' +
                (tokens.res(req, res, 'content-length') ?? '0'),
        ].join(' ');
    },
    {
        stream: {
            write: function (message) {
                logger.http(message);
            },
        },
    }
);

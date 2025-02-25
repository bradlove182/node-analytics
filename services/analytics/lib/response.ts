export function ok(res: any, data: object = {}) {
    return json(res, data);
}

export function json(res: any, data: object = {}) {
    return res.status(200).json(data);
}

export function send(res: any, data: any, type = "text/plain") {
    res.setHeader("Content-Type", type);

    return res.status(200).send(data);
}

export function redirect(res: any, url: string) {
    res.setHeader("Location", url);

    return res.status(303).end();
}

export function badRequest(res: any, msg = "400 Bad Request") {
    return res.status(400).end(msg);
}

export function unauthorized(res: any, msg = "401 Unauthorized") {
    return res.status(401).end(msg);
}

export function forbidden(res: any, msg = "403 Forbidden") {
    return res.status(403).end(msg);
}

export function notFound(res: any, msg = "404 Not Found") {
    return res.status(404).end(msg);
}

export function methodNotAllowed(res: any, msg = "405 Method Not Allowed") {
    res.status(405).end(msg);
}

export function tooManyRequest(res: any, msg = "429 Too Many Request") {
    return res.status(429).end(msg);
}

export function serverError(res: any, msg = "500 Internal Server Error") {
    res.status(500).end(msg);
}

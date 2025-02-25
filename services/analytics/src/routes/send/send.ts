import ipaddr from "ipaddr.js";
import { FastifyPluginCallback, fastify } from "fastify";
import { isbot } from "isbot";
import { safeDecodeURI } from "@lib/client/url";
import { badRequest, forbidden, methodNotAllowed, ok, send } from "@lib/response";
import { env } from "@repo/environment"
// import { createToken } from "@lib/token";
import { COLLECTION_TYPE, HOSTNAME_REGEX, IP_REGEX } from "lib/constants";
// import { secret, visitSalt, uuid } from "lib/crypto";
import { getClientInfo, getIpAddress } from "@lib/detect";
// import { useCors, useSession, useValidate } from "lib/middleware";
import { CollectionType, RequestType } from "@lib/types";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { saveEventQuery } from "@api/events/saveEvent";
import { z } from "zod";
import { IncomingMessage } from "http";
import { uuid } from "@lib/crypto";

export interface CollectRequestBody {
    payload: {
        website: string;
        data?: { [key: string]: any };
        hostname?: string;
        ip?: string;
        language?: string;
        name?: string;
        referrer?: string;
        screen?: string;
        tag?: string;
        title?: string;
        url: string;
    };
    type: CollectionType;
}

export interface NextApiRequestCollect extends IncomingMessage {
    body: CollectRequestBody;
    session: {
        id: string;
        websiteId: string;
        visitId: string;
        hostname: string;
        browser: string;
        os: string;
        device: string;
        screen: string;
        language: string;
        country: string;
        subdivision1: string;
        subdivision2: string;
        city: string;
        iat: number;
    };
    headers: { [key: string]: any };
}

const schema = {
    POST: z.object({
        payload: z
            .object({
                data: z.object({}),
                hostname: z.string().max(100).regex(HOSTNAME_REGEX),
                ip: z.string().regex(IP_REGEX),
                langauge: z.string().max(35),
                referrer: z.string(),
                screen: z.string().max(11),
                title: z.string(),
                url: z.string(),
                website: z
                    .string({
                        required_error: "WebsiteId is required",
                    })
                    .uuid(),
                name: z.string().max(50),
                tag: z.string().max(50).nullable(),
            })
            .required(),
        type: z
            .string({
                required_error: "Type is required",
            })
            .regex(/event|identify/i),
    }),
};

// export default async (req: Request, res: NextApiResponse) => {
//     // await useCors(req, res);

//     if (req.method === "POST") {
//         if (!process.env.DISABLE_BOT_CHECK && isbot(req.headers["user-agent"])) {
//             return ok(res);
//         }

//         // await useValidate(schema, req, res);

//         if (hasBlockedIp(req)) {
//             return forbidden(res);
//         }

//         const { type, payload } = req.body;
//         const { url, referrer, name: eventName, data, title } = payload;
//         const pageTitle = safeDecodeURI(title);

//         // await useSession(req, res);

//         // const session = req.session;
//         // const iat = Math.floor(new Date().getTime() / 1000);

//         // expire visitId after 30 minutes
//         // if (session.iat && iat - session.iat > 1800) {
//         //     session.visitId = uuid(session.id, visitSalt());
//         // }

//         // session.iat = iat;

//         if (type === COLLECTION_TYPE.event) {
//             // eslint-disable-next-line prefer-const
//             let [urlPath, urlQuery] = safeDecodeURI(url)?.split("?") || [];
//             let [referrerPath, referrerQuery] = safeDecodeURI(referrer)?.split("?") || [];
//             let referrerDomain = "";

//             if (!urlPath) {
//                 urlPath = "/";
//             }

//             if (referrerPath?.startsWith("http")) {
//                 const refUrl = new URL(referrer);
//                 referrerPath = refUrl.pathname;
//                 referrerQuery = refUrl.search.substring(1);
//                 referrerDomain = refUrl.hostname.replace(/www\./, "");
//             }

//             if (process.env.REMOVE_TRAILING_SLASH) {
//                 urlPath = urlPath.replace(/(.+)\/$/, "$1");
//             }

//             await saveEventQuery({
//                 urlPath,
//                 urlQuery,
//                 referrerPath,
//                 referrerQuery,
//                 referrerDomain,
//                 pageTitle,
//                 eventName,
//                 eventData: data,
//                 sessionId: "asdas",
//                 visitId: "asdasd",
//             });
//         }

//         // if (type === COLLECTION_TYPE.identify) {
//         //     if (!data) {
//         //         return badRequest(res, "Data required.");
//         //     }

//         //     await saveSessionData({
//         //         websiteId: session.websiteId,
//         //         sessionId: session.id,
//         //         sessionData: data,
//         //     });
//         // }

//         // const token = createToken(session, secret());

//         return send(res, token);
//     }

//     return methodNotAllowed(res);
// };

// function hasBlockedIp(req: NextApiRequestCollect) {
//     const ignoreIps = process.env.IGNORE_IP;

//     if (ignoreIps) {
//         const ips = [];

//         if (ignoreIps) {
//             ips.push(...ignoreIps.split(",").map((n) => n.trim()));
//         }

//         const clientIp = getIpAddress(req);

//         return ips.find((ip) => {
//             if (ip === clientIp) return true;

//             // CIDR notation
//             if (ip.indexOf("/") > 0 && clientIp) {
//                 const addr = ipaddr.parse(clientIp);
//                 const range = ipaddr.parseCIDR(ip);

//                 if (addr.kind() === range[0].kind() && addr.match(range)) return true;
//             }
//         });
//     }

//     return false;
// }

export const sendData: FastifyPluginCallback = (fastify, _, done) => {
    fastify.withTypeProvider<ZodTypeProvider>().post(
        "/",
        {
            schema
        },
        async (request, response) => {
            if (request.method === "POST") {
                console.log(!env.DISABLE_BOT_CHECK && isbot(request.headers["user-agent"]), "ASDASDASDASDASDS")
                if (!env.DISABLE_BOT_CHECK && isbot(request.headers["user-agent"])) {
                    return ok(response);
                }

                // dont need this as fastify will validate on
                // await useValidate(schema, req, res);

                // console.log(request, "request Object");
                // if (hasBlockedIp(request)) {
                //     return forbidden(response);
                // }

                const { type, payload } = request.body;
                // console.log(type, "TYPE ")
                // console.log(payload, "PAYLOAD")
                // const { url, referrer, name: eventName, data, title } = payload;
                const {
                    website: websiteId,
                    url,
                    referrer,
                    name: eventName,
                    data,
                    title,
                    hostname,
                    screen,
                    language,
                    tag
                } = payload;

                // const pageTitle = safeDecodeURI(title);

                // await useSession(request, response);

                // const session = request.session;
                const { ip, userAgent, device, browser, os, country, subdivision1, subdivision2, city } =
                await getClientInfo(request, payload);
                const sessionId = uuid(websiteId, ip, userAgent);
                console.log(sessionId, ip, userAgent, device, browser, os, country, subdivision1, subdivision2, city)
                // console.log(session, "SEESSION")
                // const iat = Math.floor(new Date().getTime() / 1000);

                // expire visitId after 30 minutes
                // if (session.iat && iat - session.iat > 1800) {
                //     session.visitId = uuid(session.id, visitSalt());
                // }

                // session.iat = iat;

                if (type === COLLECTION_TYPE.event) {
                    // eslint-disable-next-line prefer-const
                    let [urlPath, urlQuery] = safeDecodeURI(url)?.split("?") || [];
                    let [referrerPath, referrerQuery] = safeDecodeURI(referrer)?.split("?") || [];
                    let referrerDomain = "";

                    if (!urlPath) {
                        urlPath = "/";
                    }

                    if (referrerPath?.startsWith("http")) {
                        const refUrl = new URL(referrer);
                        referrerPath = refUrl.pathname;
                        referrerQuery = refUrl.search.substring(1);
                        referrerDomain = refUrl.hostname.replace(/www\./, "");
                    }

                    if (process.env.REMOVE_TRAILING_SLASH) {
                        urlPath = urlPath.replace(/(.+)\/$/, "$1");
                    }

                    await saveEventQuery({
                        urlPath,
                        urlQuery,
                        referrerPath,
                        referrerQuery,
                        referrerDomain,
                        pageTitle: title ?? "testing",
                        eventName,
                        ...session,
                        eventData: data,
                        websiteId: '1',
                        sessionId: "1",
                        visitId: "1",
                    }, request.db);
                }

                // if (type === COLLECTION_TYPE.identify) {
                //     if (!data) {
                //         return badRequest(res, "Data required.");
                //     }

                //     await saveSessionData({
                //         websiteId: session.websiteId,
                //         sessionId: session.id,
                //         sessionData: data,
                //     });
                // }

                // const token = createToken(session, secret());

                return send(response, token);
            }
        }
    );

    done();
};

import ipaddr from "ipaddr.js";
import { FastifyPluginCallback, fastify } from "fastify";
import { isbot } from "isbot";
import { safeDecodeURI } from "@lib/client/url";
import { badRequest, forbidden, json, methodNotAllowed, ok, send } from "@lib/response";
import { env } from "@repo/environment"
// import { createToken } from "@lib/token";
import { COLLECTION_TYPE, DOMAIN_REGEX, HOSTNAME_REGEX, IP_REGEX } from "lib/constants";
// import { secret, visitSalt, uuid } from "lib/crypto";
import { getClientInfo, getIpAddress } from "@lib/detect";
// import { useCors, useSession, useValidate } from "lib/middleware";
import { CollectionType, RequestType } from "@lib/types";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { saveEvent } from "@api/events/saveEvent";
import { z } from "zod";
import { IncomingMessage } from "http";
import { secret, uuid, visitSalt } from "@lib/crypto";
import { urlOrPathParam } from "@lib/shema";
import { createToken } from "@lib/token";

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


const schema = z.object({
    type: z.enum(['event', 'identify']),
    payload: z.object({
      website: z.string().uuid(),
      data: z.object({}).passthrough().optional(),
      hostname: z.string().regex(DOMAIN_REGEX).max(100).optional(),
      language: z.string().max(35).optional(),
      referrer: urlOrPathParam.optional(),
      screen: z.string().max(11).optional(),
      title: z.string().optional(),
      url: urlOrPathParam,
      name: z.string().max(50).optional(),
      tag: z.string().max(50).optional(),
      ip: z.string().ip().optional(),
      userAgent: z.string().optional(),
    }),
  });

export const sendData: FastifyPluginCallback = (fastify, _, done) => {
    fastify.withTypeProvider<ZodTypeProvider>().post(
        "/",
        {
            schema
        },
        async (request, response) => {
            if (request.method === "POST") {
                if (!env.DISABLE_BOT_CHECK && isbot(request.headers["user-agent"])) {
                    return json({ beep: 'boop' });
                }

                const { type, payload } = request.body;


                const {
                    website: websiteId,
                    hostname,
                    screen,
                    language,
                    url,
                    referrer,
                    name,
                    data,
                    title,
                    tag,
                  } = payload;

                // Cache check
                // let cache: { websiteId: string; sessionId: string; visitId: string; iat: number } | null = null;

                const { ip, userAgent, device, browser, os, country, subdivision1, subdivision2, city } = await getClientInfo(request, payload);
                
                const sessionId = uuid(websiteId, ip, userAgent);

                // Visit info
                const now = Math.floor(new Date().getTime() / 1000);
                let visitId = uuid(sessionId, visitSalt());
                let iat = now;

                // Expire visit after 30 minutes
                if (now - iat > 1800) {
                    visitId = uuid(sessionId, visitSalt());
                    iat = now;
                }

                if (type === COLLECTION_TYPE.event) {
                    const base = hostname ? `https://${hostname}` : 'https://localhost';
                    const currentUrl = new URL(url, base);
                    let urlPath = currentUrl.pathname;
                    const urlQuery = currentUrl.search.substring(1);
                    const urlDomain = currentUrl.hostname.replace(/^www./, '');

                    if (process.env.REMOVE_TRAILING_SLASH) {
                        urlPath = urlPath.replace(/(.+)\/$/, "$1");
                    }

                    let referrerPath: string | undefined;
                    let referrerQuery: string | undefined;
                    let referrerDomain: string | undefined;

                    if (referrer) {
                        const referrerUrl = new URL(referrer, base);
                
                        referrerPath = referrerUrl.pathname;
                        referrerQuery = referrerUrl.search.substring(1);
                
                        if (referrerUrl.hostname !== 'localhost') {
                          referrerDomain = referrerUrl.hostname.replace(/^www\./, '');
                        }
                    }

                    await saveEvent({
                        websiteId,
                        sessionId,
                        visitId,
                        urlPath,
                        urlQuery,
                        pageTitle: title,
                        eventName: name,
                        eventData: data,
                        hostname: hostname || urlDomain,
                        browser,
                        os,
                        device,
                        screen,
                        language,
                        country,
                        subdivision1,
                        subdivision2,
                        city,
                        tag,
                        referrerPath,
                        referrerDomain,
                        referrerQuery,
                    });
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

                const token = createToken({ websiteId, sessionId, visitId, iat }, secret());

                return json({ cache: token });
            }
        }
    );

    done();
};

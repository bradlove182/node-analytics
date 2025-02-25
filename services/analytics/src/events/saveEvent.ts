import { FastifyCookie } from "@fastify/cookie";
import { FastifySessionObject } from "@fastify/session";
import { EVENT_NAME_LENGTH, EVENT_TYPE, PAGE_TITLE_LENGTH, URL_LENGTH } from "@lib/constants";
import { uuid } from "@lib/crypto";
import { FastifyRequest } from "fastify";

interface DataInterface {
    websiteId: string;
    sessionId: string;
    visitId: string;
    urlPath: string;
    urlQuery?: string;
    referrerPath?: string;
    referrerQuery?: string;
    referrerDomain?: string;
    pageTitle?: string;
    eventName?: string;
    eventData?: any;
    hostname?: string;
    browser?: string;
    os?: string;
    device?: string;
    screen?: string;
    language?: string;
    country?: string;
    subdivision1?: string;
    subdivision2?: string;
    city?: string;
}


export async function saveEventQuery(data: DataInterface, db: FastifyRequest["db"]) {
    const {
        websiteId,
        sessionId,
        visitId,
        urlPath,
        urlQuery,
        referrerPath,
        referrerQuery,
        referrerDomain,
        pageTitle,
        eventData,
        eventName,
        country,
        subdivision1,
        subdivision2,
        city,
        ...args
    } = data;

    console.log(args, "args")

    // Remove cookie and other non-database fields from args
    const { cookie, ...cleanArgs } = args;

    const message = {
        website_id: String(websiteId || ''),
        session_id: String(sessionId || ''),
        visit_id: String(visitId || ''),
        event_id: String(uuid()),
        country: String(country || 'cape town'),
        subdivision1: subdivision1 ? String(subdivision1) : null,
        subdivision2: subdivision2 ? String(subdivision2) : null,
        city: city ? String(city) : null,
        url_path: String(urlPath || '').substring(0, URL_LENGTH),
        url_query: urlQuery ? String(urlQuery).substring(0, URL_LENGTH) : null,
        referrer_path: referrerPath ? String(referrerPath).substring(0, URL_LENGTH) : null,
        referrer_query: referrerQuery ? String(referrerQuery).substring(0, URL_LENGTH) : null,
        referrer_domain: referrerDomain ? String(referrerDomain).substring(0, URL_LENGTH) : null,
        page_title: pageTitle ? String(pageTitle).substring(0, PAGE_TITLE_LENGTH) : null,
        event_type: Number(eventName ? EVENT_TYPE.customEvent : EVENT_TYPE.pageView),
        event_name: eventName ? String(eventName).substring(0, EVENT_NAME_LENGTH) : null,
        // Format date for ClickHouse
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        ...Object.fromEntries(
            Object.entries(cleanArgs)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => [key, value ? String(value) : null])
        )
    };

    console.log('Prepared message for insertion:', JSON.stringify(message, null, 2));

    try {
        await db.insert({
            table: 'honeycomb.website_event',
            values: [message],
            format: 'JSONEachRow',
            clickhouse_settings: {
                date_time_input_format: 'best_effort'
            }
        });
        
        console.log(`Event saved with ID: ${message.event_id}`);
    } catch (error) {
        console.error('Error inserting event into ClickHouse:', error);
        console.error('Failed message:', JSON.stringify(message, null, 2));
        throw error;
    }
}
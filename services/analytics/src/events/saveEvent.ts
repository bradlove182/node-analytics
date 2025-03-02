import { Logger } from "@api/utils";
import clickhouse from "@lib/clickhouse";
import { EVENT_NAME_LENGTH, EVENT_TYPE, PAGE_TITLE_LENGTH, URL_LENGTH } from "@lib/constants";
import { uuid } from "@lib/crypto";
import { CLICKHOUSE, runQuery } from "@lib/db";
import kafka from "@lib/kafka";
import { FastifyRequest } from "fastify";
import { saveEventData } from "./saveEventData";

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
    tag?: string;
    // db: FastifyRequest["db"]
}

export async function saveEvent(args: DataInterface) {
    return runQuery({
      [CLICKHOUSE]: () => clickhouseQuery(args),
    });
  }

  async function clickhouseQuery(data: DataInterface, ){

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
        tag,
        ...args
    } = data;

    const { insert, getUTCString } = clickhouse;
    const { sendMessage } = kafka
    const eventId = uuid();
    const createdAt = getUTCString();

    const message = {
        ...args,
        website_id: websiteId,
        session_id: sessionId,
        visit_id: visitId,
        event_id: eventId,
        country: country,
        subdivision1:
          country && subdivision1
            ? subdivision1.includes('-')
              ? subdivision1
              : `${country}-${subdivision1}`
            : null,
        subdivision2: subdivision2,
        city: city,
        url_path: urlPath?.substring(0, URL_LENGTH),
        url_query: urlQuery?.substring(0, URL_LENGTH),
        referrer_path: referrerPath?.substring(0, URL_LENGTH),
        referrer_query: referrerQuery?.substring(0, URL_LENGTH),
        referrer_domain: referrerDomain?.substring(0, URL_LENGTH),
        page_title: pageTitle?.substring(0, PAGE_TITLE_LENGTH),
        event_type: eventName ? EVENT_TYPE.customEvent : EVENT_TYPE.pageView,
        event_name: eventName ? eventName?.substring(0, EVENT_NAME_LENGTH) : null,
        tag: tag,
        created_at: createdAt,
      };

    if(kafka.enabled){
        Logger.info("Honeycomb", "Kafka")
    } else {
        console.log("SAVING EVENT")
        await insert("honeycomb.website_event", [message])
    }

    if (eventData) {
        await saveEventData({
          websiteId,
          sessionId,
          eventId,
          urlPath: urlPath?.substring(0, URL_LENGTH),
          eventName: eventName?.substring(0, EVENT_NAME_LENGTH),
          eventData,
          createdAt,
        });
      }
    
      return data;
  }
import { Logger } from "@api/utils";
import clickhouse from "@lib/clickhouse";
import { DATA_TYPE } from "@lib/constants";
import { flattenJSON, getStringValue } from "@lib/data";
import { CLICKHOUSE, runQuery } from "@lib/db";
import kafka from "@lib/kafka";
import { DynamicData } from "@lib/types";

interface EventData {
    websiteId: string
    eventId: string;
    sessionId?: string;
    urlPath?: string;
    eventName?: string;
    eventData: DynamicData;
    createdAt?: string;
}

export async function saveEventData(data: EventData){
    return runQuery({
        [CLICKHOUSE]: () => clickhouseQuery(data),
    })
}

async function clickhouseQuery(data: EventData){
    const { websiteId, eventData, eventId, eventName, sessionId, urlPath, createdAt} = data;

    const { insert, getUTCString } = clickhouse;
    const { sendMessage } = kafka;

    const jsonKeys = flattenJSON(eventData)

    const messages = jsonKeys.map(({key, value, dataType}) => {
        return {
            website_id: websiteId,
            session_id: sessionId,
            event_id: eventId,
            url_path: urlPath,
            data_key: key,
            data_type: dataType,
            string_value: getStringValue(value, dataType),
            number_value: dataType === DATA_TYPE.number ? value : null,
            date_value: dataType === DATA_TYPE.date ? getUTCString(value) : null,
            created_at: createdAt,
        }
    })


  if (kafka.enabled) {
    Logger.info("Honeycomb", "Kafka")
  } else {
    await insert('honeycomb.event_data', messages);
  }

  return data;
}
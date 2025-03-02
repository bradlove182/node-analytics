import { env } from "@repo/environment";

export const CLICKHOUSE = 'clickhouse';
export const KAFKA = 'kafka';
export const KAFKA_PRODUCER = 'kafka-producer';


export async function runQuery(queries: any) {
    if (env.CLICKHOUSE_DATABASE_URL) {
      if (queries[KAFKA]) {
        return queries[KAFKA]();
      }
  
      return queries[CLICKHOUSE]();
    }
  }
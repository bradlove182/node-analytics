import { db } from "@api/database";
import { Logger } from "@api/utils";
import { ClickHouseClient } from '@clickhouse/client';
import { env } from "@repo/environment";
import { formatInTimeZone } from 'date-fns-tz';


  const log = Logger.info("honeycomb", "clickhouse")

  let clickhouse: ClickHouseClient;
  const enabled = Boolean(env.CLICKHOUSE_DATABASE_URL)

  async function insert(table: string, values: any[]) {
    await connect();
    return clickhouse.insert({ table, values, format: 'JSONEachRow' });
  }

  async function connect() {
    if (enabled && !clickhouse && env.CLICKHOUSE_DATABASE_URL) {
      clickhouse = db;
    }
  
    return clickhouse;
  }

  function getUTCString(date?: Date | string | number) {
    return formatInTimeZone(date || new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss');
  }

  export default { 
    enabled,
    log,
    insert,
    getUTCString
  }
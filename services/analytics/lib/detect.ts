import { FastifyRequest } from "fastify";
import { ClientRequest, IncomingMessage } from "http";
import { getClientIp } from "request-ip";
import isLocalhost from 'is-localhost-ip';
import { browserName, detectOS } from 'detect-browser';
import { env } from "@repo/environment";

export function getIpAddress(req: IncomingMessage) {
    const customHeader = String(env.CLIENT_IP_HEADER).toLowerCase();

    if (customHeader !== "undefined" && req.headers[customHeader]) {
        return req.headers[customHeader];
    }
}

function decodeHeader(s: string | undefined | null): string | undefined | null {
    if (s === undefined || s === null) {
      return s;
    }
  
    return Buffer.from(s, 'latin1').toString('utf-8');
  }
  
  function getRegionCode(country: string, region: string) {
    if (!country || !region) {
      return undefined;
    }
  
    return region.includes('-') ? region : `${country}-${region}`;
  }

export async function getClientInfo(request: Request, payload: Record<string, any>) {
    const userAgent = payload?.userAgent || request.headers.get('user-agent');
    const ip = payload?.ip || getIpAddress(request.headers);
    const location = await getLocation(ip, request.headers, !!payload?.ip);
    const country = payload?.userAgent || location?.country;
    const subdivision1 = location?.subdivision1;
    const subdivision2 = location?.subdivision2;
    const city = location?.city;
    const browser = browserName(userAgent);
    const os = detectOS(userAgent) as string;
    const device = getDevice(payload?.screen, os);
  
    return { userAgent, browser, os, ip, country, subdivision1, subdivision2, city, device };
  }

  export async function getLocation(ip: string = '', headers: Headers, hasPayloadIP: boolean) {
    // Ignore local ips
    if (await isLocalhost(ip)) {
      return;
    }
  
    if (!hasPayloadIP && !process.env.SKIP_LOCATION_HEADERS) {
      // Cloudflare headers
      if (headers.get('cf-ipcountry')) {
        const country = decodeHeader(headers.get('cf-ipcountry'));
        const subdivision1 = decodeHeader(headers.get('cf-region-code'));
        const city = decodeHeader(headers.get('cf-ipcity'));
  
        return {
          country,
          subdivision1: getRegionCode(country, subdivision1),
          city,
        };
      }
  
      // Vercel headers
      if (headers.get('x-vercel-ip-country')) {
        const country = decodeHeader(headers.get('x-vercel-ip-country'));
        const subdivision1 = decodeHeader(headers.get('x-vercel-ip-country-region'));
        const city = decodeHeader(headers.get('x-vercel-ip-city'));
  
        return {
          country,
          subdivision1: getRegionCode(country, subdivision1),
          city,
        };
      }
    }
  
    // Database lookup
    if (!global[MAXMIND]) {
      const dir = path.join(process.cwd(), 'geo');
  
      global[MAXMIND] = await maxmind.open(path.resolve(dir, 'GeoLite2-City.mmdb'));
    }
  
    const result = global[MAXMIND].get(ip);
  
    if (result) {
      const country = result.country?.iso_code ?? result?.registered_country?.iso_code;
      const subdivision1 = result.subdivisions?.[0]?.iso_code;
      const subdivision2 = result.subdivisions?.[1]?.names?.en;
      const city = result.city?.names?.en;
  
      return {
        country,
        subdivision1: getRegionCode(country, subdivision1),
        subdivision2,
        city,
      };
    }
  }

  export function getDevice(screen: string, os: string) {
    if (!screen) return;
  
    const [width] = screen.split('x');

    return "laptop"
  
    // if (DESKTOP_OS.includes(os)) {
    //   if (os === 'Chrome OS' || +width < DESKTOP_SCREEN_WIDTH) {
    //     return 'laptop';
    //   }
    //   return 'desktop';
    // } else if (MOBILE_OS.includes(os)) {
    //   if (os === 'Amazon OS' || +width > MOBILE_SCREEN_WIDTH) {
    //     return 'tablet';
    //   }
    //   return 'mobile';
    // }
  
    // if (+width >= DESKTOP_SCREEN_WIDTH) {
    //   return 'desktop';
    // } else if (+width >= LAPTOP_SCREEN_WIDTH) {
    //   return 'laptop';
    // } else if (+width >= MOBILE_SCREEN_WIDTH) {
    //   return 'tablet';
    // } else {
    //   return 'mobile';
    // }
  }
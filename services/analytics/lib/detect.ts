import { FastifyRequest, RequestHeadersDefault } from "fastify";
import { ClientRequest, IncomingMessage } from "http";
import { getClientIp, RequestHeaders } from "request-ip";
import isLocalhost from 'is-localhost-ip';
import { browserName, detectOS } from 'detect-browser';
import { env } from "@repo/environment";
import { IP_ADDRESS_HEADERS } from "./constants";

export function getIpAddress(headers: Record<string, string | string[] | undefined>) {
    const customHeader = env.CLIENT_IP_HEADER;
  
    if (customHeader && headers[customHeader]) {
      return headers[customHeader] as string;
    }
  
    const header = IP_ADDRESS_HEADERS.find(name => {
      return headers[name];
    });
  
    const ip = header && (headers[header] as string);
    
    if (!ip) return undefined;
  
    if (header === 'x-forwarded-for') {
      return ip.split(',')[0]?.trim();
    }
  
    if (header === 'forwarded') {
      const match = ip.match(/for=(\[?[0-9a-fA-F:.]+\]?)/);
  
      if (match) {
        return match[1];
      }
    }
  
    return ip;
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

export async function getClientInfo(request: FastifyRequest, payload: Record<string, any>) {
    const userAgent = payload?.userAgent || request.headers["user-agent"];
    const ip = payload?.ip || getIpAddress(request.headers);
    const location = await getLocation(ip, request.headers, !!payload?.ip);
    const country = payload?.userAgent || location?.country;
    const subdivision1 = location?.subdivision1;
    const subdivision2 = location?.subdivision2;
    const city = location?.city ?? '';
    const browser = browserName(userAgent) as string;
    const os = detectOS(userAgent) as string;
    const device = getDevice(payload?.screen, os);
  
    return { userAgent, browser, os, ip, country, subdivision1, subdivision2, city, device };
  }

  export async function getLocation(ip: string = '', headers: Headers, hasPayloadIP: boolean) {
    // Ignore local ips
    if (await isLocalhost(ip)) {
      return;
    }
  
    if (!hasPayloadIP && !env.SKIP_LOCATION_HEADERS) {
      // Cloudflare headers
      if (headers['cf-ipcountry']) {
        const country = decodeHeader(headers['cf-ipcountry']);
        const subdivision1 = decodeHeader(headers['cf-region-code']);
        const city = decodeHeader(headers['cf-ipcity']);
  
        return {
          country,
          subdivision1: getRegionCode(country, subdivision1),
          city,
        };
      }
  
      // Vercel headers
      if (headers['x-vercel-ip-country']) {
        const country = decodeHeader(headers['x-vercel-ip-country']);
        const subdivision1 = decodeHeader(headers['x-vercel-ip-country-region']);
        const city = decodeHeader(headers['x-vercel-ip-city']);
  
        return {
          country,
          subdivision1: getRegionCode(country, subdivision1),
          city,
        };
      }
    }
  
    // Database lookup
    // if (!global[MAXMIND]) {
    //   const dir = path.join(process.cwd(), 'geo');
  
    //   global[MAXMIND] = await maxmind.open(path.resolve(dir, 'GeoLite2-City.mmdb'));
    // }
  
    // const result = global[MAXMIND].get(ip);
  
    // if (result) {
    //   const country = result.country?.iso_code ?? result?.registered_country?.iso_code;
    //   const subdivision1 = result.subdivisions?.[0]?.iso_code;
    //   const subdivision2 = result.subdivisions?.[1]?.names?.en;
    //   const city = result.city?.names?.en;
  
    //   return {
    //     country,
    //     subdivision1: getRegionCode(country, subdivision1),
    //     subdivision2,
    //     city,
    //   };
    // }
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


// export function hasBlockedIp(clientIp: string) {
//     const ignoreIps = env.IGNORE_IP;
  
//     if (ignoreIps) {
//       const ips = [];
  
//       if (ignoreIps) {
//         ips.push(...ignoreIps.split(',').map(n => n.trim()));
//       }
  
//       return ips.find(ip => {
//         if (ip === clientIp) {
//           return true;
//         }
  
//         // CIDR notation
//         if (ip.indexOf('/') > 0) {
//           const addr = ipaddr.parse(clientIp);
//           const range = ipaddr.parseCIDR(ip);
  
//           if (addr.kind() === range[0].kind() && addr.match(range)) {
//             return true;
//           }
//         }
//       });
//     }
  
//     return false;
//   }
  
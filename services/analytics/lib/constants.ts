export const HOSTNAME_REGEX =
    /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;

export const DOMAIN_REGEX =
  /^(localhost(:[1-9]\d{0,4})?|((?=[a-z0-9-_]{1,63}\.)(xn--)?[a-z0-9-_]+(-[a-z0-9-_]+)*\.)+(xn--)?[a-z0-9-_]{2,63})$/;

export const IP_REGEX = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;

export const DATETIME_REGEX =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{3}(Z|\+[0-9]{2}:[0-9]{2})?)?$/;

export const COLLECTION_TYPE = {
    event: "event",
    identify: "identify",
};

export const DATA_TYPE = {
    string: 1,
    number: 2,
    boolean: 3,
    date: 4,
    array: 5,
  } as const;

export const URL_LENGTH = 500;  
export const PAGE_TITLE_LENGTH = 500
export const EVENT_NAME_LENGTH = 50


export const EVENT_TYPE = {
    pageView: 1,
    customEvent: 2,
} as const;

export const IP_ADDRESS_HEADERS = [
    'cf-connecting-ip',
    'x-client-ip',
    'x-forwarded-for',
    'do-connecting-ip',
    'fastly-client-ip',
    'true-client-ip',
    'x-real-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded',
    'x-appengine-user-ip',
  ];
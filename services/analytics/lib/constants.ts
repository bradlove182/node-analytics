export const HOSTNAME_REGEX =
    /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;

export const IP_REGEX = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;

export const COLLECTION_TYPE = {
    event: "event",
    identify: "identify",
};

export const URL_LENGTH = 500;  
export const PAGE_TITLE_LENGTH = 500
export const EVENT_NAME_LENGTH = 50


export const EVENT_TYPE = {
    pageView: 1,
    customEvent: 2,
} as const;

import { COLLECTION_TYPE } from "@lib/constants";
import z from "zod";

type ObjectValues<T> = T[keyof T];

export type CollectionType = ObjectValues<typeof COLLECTION_TYPE>;

export interface RequestType {
    GET?: z.Schema<any>;
    POST?: z.Schema<any>;
    PUT?: z.Schema<any>;
    DELTE?: z.Schema<any>;
}

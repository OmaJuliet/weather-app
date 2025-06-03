import type { BCMSEntryContentParsed } from '../content';
import type { BCMSEntryStatuses } from '../status';

export interface WeatherhistoryEntryMetaItem {
    title: string;
    slug: string;
    humidity?: number;
    wind?: number;
    temperature?: string;
    condition?: string;
    condition_description?: string;
    latitude?: number;
    longitude?: number;
    max_temp?: number;
    min_temp?: number;
}

export interface WeatherhistoryEntryMeta {
    en?: WeatherhistoryEntryMetaItem;
}

export interface WeatherhistoryEntry {
    _id: string;
    createdAt: number;
    updatedAt: number;
    instanceId: string;
    templateId: string;
    userId: string;
    statuses: BCMSEntryStatuses;
    meta: WeatherhistoryEntryMeta;
    content: BCMSEntryContentParsed;
}
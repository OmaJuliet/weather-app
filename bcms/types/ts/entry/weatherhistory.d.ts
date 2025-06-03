import type { BCMSEntryContentParsed } from '../content';
import type { BCMSEntryStatuses } from '../status';
import type { PropValueDateData } from '@thebcms/types';

export interface WeatherhistoryEntryMetaItem {
    title: string;
    slug: string;
    location?: string;
    timestamp?: PropValueDateData;
    temperature?: string;
    condition?: string;
    latitude?: number;
    longitude?: number;
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
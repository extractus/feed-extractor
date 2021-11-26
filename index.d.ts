// Type definitions

export function parse(url: string): Promise<FeedData>;


export interface FeedData {
    link?: string;
    title?: string;
    description?: string;
    generator?: string;
    language?: string;
    published?: date;
    entries?: array;
}

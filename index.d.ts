// Type definitions

export function read(url: string): Promise<FeedData>;


export interface FeedData {
    link?: string;
    title?: string;
    description?: string;
    generator?: string;
    language?: string;
    published?: date;
    entries?: array;
}

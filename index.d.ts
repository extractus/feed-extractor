// Type definitions

export interface FeedEntry {
    link?: string;
    title?: string;
    description?: string;
    published?: Date;
}

export interface FeedData {
    link?: string;
    title?: string;
    description?: string;
    generator?: string;
    language?: string;
    published?: Date;
    entries?: Array<FeedEntry>;
}

export interface ReaderOptions {
  /**
   * normalize feed data or keep original
   * default: true
   */
  normalization?: Boolean;
  /**
   * include full content of feed entry if present
   * default: false
   */
   includeEntryContent?: Boolean;
  /**
   * include optional elements if any
   * default: false
   */
   includeOptionalElements?: Boolean;
  /**
   * convert datetime to ISO format
   * default: true
   */
   useISODateFormat?: Boolean;
  /**
   * to truncate description
   * default: 210
   */
   descriptionMaxLen?: number;
}

export function read(url: string, options?: ReaderOptions): Promise<FeedData>;

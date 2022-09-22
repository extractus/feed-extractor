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

export interface ProxyConfig {
  target?: string;
  headers?: string[];
}

export interface ReaderOptions {
  /**
   * normalize feed data or keep original
   * default: true
   */
  normalization?: boolean;
  /**
   * include full content of feed entry if present
   * default: false
   */
  includeEntryContent?: boolean;
  /**
   * include optional elements if any
   * default: false
   */
  includeOptionalElements?: boolean;
  /**
   * convert datetime to ISO format
   * default: true
   */
  useISODateFormat?: boolean;
  /**
   * to truncate description
   * default: 210
   */
  descriptionMaxLen?: number;
}

export interface FetchOptions {
  /**
   * list of request headers
   * default: null
   */
  headers?: string[];
  /**
   * the values to configure proxy
   * default: null
   */
  proxy?: ProxyConfig;
}

export function read(url: string, options?: ReaderOptions, fetchOptions?: FetchOptions): Promise<FeedData>;

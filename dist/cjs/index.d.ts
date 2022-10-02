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
  /**
   * fast-xml-parser options
   * https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
   */
  xmlParserOptions?: any;
  /**
   * merge extra feed fields in result
   */
  extraFeedFields?: (feedData: object) => object;
  /**
   * merge extra entry fields in result
   */
  extraEntryFields?: (entryData: object) => object;
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
  /**
   * an optional fetch function override
   * default: fetch from cross-fetch
   */
  fetchFn?: (
    ...args: Parameters<typeof fetch>
  ) => Promise<Pick<Response, "headers" | "text" | "status">>;
}

export function read(
  url: string,
  options?: ReaderOptions,
  fetchOptions?: FetchOptions
): Promise<FeedData>;

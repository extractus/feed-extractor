// Type definitions

export interface FeedEntry {
  /**
   * id, guid, or generated identifier for the entry
   */
  id: string;
  link?: string;
  title?: string;
  description?: string;
  published?: string;
}

export interface FeedData {
  link?: string;
  title?: string;
  description?: string;
  generator?: string;
  language?: string;
  published?: string;
  entries?: Array<FeedEntry>;
}

export interface ProxyConfig {
  target?: string;
  headers?: any;
}

export interface ReaderOptions {
  /**
   * normalize feed data or keep original
   * default: true
   */
  normalization?: boolean;
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
   * fill in the baseurl when it does not exist in the link
   * default: ''
   */
  baseUrl?: string;
  /**
   * merge extra feed fields in result
   */
  getExtraFeedFields?: (feedData: object) => object;
  /**
   * merge extra entry fields in result
   */
  getExtraEntryFields?: (entryData: object) => object;
}

export interface FetchOptions {
  //  Definitions by: Ryan Graham <https://github.com/ryan-codingintrigue>
  method?: "GET" | "POST" | "DELETE" | "PATCH" | "PUT" | "HEAD" | "OPTIONS" | "CONNECT";
  headers?: any;
  body?: any;
  mode?: "cors" | "no-cors" | "same-origin";
  credentials?: "omit" | "same-origin" | "include";
  cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
  redirect?: "follow" | "error" | "manual";
  referrer?: string;
  referrerPolicy?: "referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "unsafe-url";
  integrity?: any;
  proxy?: ProxyConfig;
  /**
   * http proxy agent
   * default: null
   */
  agent?: object;
  /**
   * signal to terminate request
   * default: null
   */
  signal?: object;
}

export function extractFromXml(xml: string, options?: ReaderOptions): FeedData;
export function extractFromJson(json: string, options?: ReaderOptions): FeedData;

export function extract(url: string, options?: ReaderOptions, fetchOptions?: FetchOptions): Promise<FeedData>;

export function read(url: string, options?: ReaderOptions, fetchOptions?: FetchOptions): Promise<FeedData>;

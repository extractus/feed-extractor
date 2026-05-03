// Type definitions

/**
 * A single normalized feed entry.
 */
export interface FeedEntry {
  /** Entry identifier (guid, id, or auto-generated) */
  id: string;
  /** Permalink to the entry */
  link?: string;
  /** Entry title */
  title?: string;
  /** Entry description (HTML stripped, optionally truncated) */
  description?: string;
  /** Publication date (ISO format or original) */
  published?: string;
}

/**
 * Normalized feed data returned by all extract functions.
 *
 * Extra fields may be present if `getExtraFeedFields` or `getExtraEntryFields` are used.
 */
export interface FeedData {
  /** Feed title */
  title?: string;
  /** Feed link */
  link?: string;
  /** Feed description */
  description?: string;
  /** Feed generator */
  generator?: string;
  /** Feed language */
  language?: string;
  /** Feed publication date */
  published?: string;
  /** List of feed entries */
  entries?: Array<FeedEntry>;
}

/**
 * Configuration for proxy-based feed fetching.
 */
export interface ProxyConfig {
  /** Proxy endpoint URL; the target feed URL is appended as query param */
  target?: string;
  /** Custom headers to send to the proxy */
  headers?: Record<string, string>;
}

/**
 * Options for feed parsing and normalization.
 */
export interface ReaderOptions {
  /**
   * Normalize feed data or keep original structure.
   * @default true
   */
  normalization?: boolean;
  /**
   * Convert dates to ISO 8601 format.
   * @default true
   */
  useISODateFormat?: boolean;
  /**
   * Maximum length for entry descriptions (0 = no limit).
   * @default 250
   */
  descriptionMaxLen?: number;
  /**
   * Options passed directly to fast-xml-parser.
   * @see https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
   */
  xmlParserOptions?: Record<string, unknown>;
  /**
   * Base URL for resolving relative links in the feed.
   * @default ''
   */
  baseUrl?: string;
  /**
   * Callback to extract extra fields from the raw feed data.
   * Returned properties are merged into the top-level result.
   */
  getExtraFeedFields?: (feedData: Record<string, unknown>) => Record<string, unknown>;
  /**
   * Callback to extract extra fields from each raw entry.
   * Returned properties are merged into each entry in the result.
   */
  getExtraEntryFields?: (entryData: Record<string, unknown>) => Record<string, unknown>;
}

/**
 * Options for the HTTP fetch request when using `extract()`.
 *
 * Only `headers`, `proxy`, `agent`, and `signal` are used by the library.
 * Other standard fetch options may be passed through to `fetch()` in non-proxy mode.
 */
export interface FetchOptions {
  /** Request headers (e.g. User-Agent) */
  headers?: Record<string, string>;
  /** Proxy configuration to route the request through an intermediary */
  proxy?: ProxyConfig;
  /** HTTP/HTTPS proxy agent (e.g. HttpsProxyAgent) */
  agent?: object;
  /** AbortSignal to cancel the request (e.g. AbortSignal.timeout()) */
  signal?: object;
}

/**
 * Parse an XML string into normalized feed data.
 *
 * Automatically detects RSS 2.0, Atom, and RDF/RSS 1.0 formats.
 *
 * @param xml - XML feed string
 * @param options - Parser options
 * @returns Normalized feed data
 */
export function extractFromXml(xml: string, options?: ReaderOptions): FeedData;

/**
 * Parse a JSON Feed object (or JSON string) into normalized feed data.
 *
 * Accepts both a parsed JavaScript object or a JSON string.
 *
 * @param json - JSON Feed object or JSON string
 * @param options - Parser options
 * @returns Normalized feed data
 */
export function extractFromJson(json: Record<string, unknown> | string, options?: ReaderOptions): FeedData;

/**
 * Fetch and parse a feed from a URL.
 *
 * Supports RSS, Atom, RDF, and JSON Feed formats.
 * Content type is auto-detected from the HTTP response.
 *
 * @param url - Feed source URL
 * @param options - Parser options
 * @param fetchOptions - HTTP fetch options
 * @returns Promise resolving to normalized feed data
 */
export function extract(url: string, options?: ReaderOptions, fetchOptions?: FetchOptions): Promise<FeedData>;

/**
 * @deprecated Use `extract()` instead.
 *
 * Fetch and parse a feed from a URL.
 *
 * @param url - Feed source URL
 * @param options - Parser options
 * @param fetchOptions - HTTP fetch options
 * @returns Promise resolving to normalized feed data
 */
export function read(url: string, options?: ReaderOptions, fetchOptions?: FetchOptions): Promise<FeedData>;

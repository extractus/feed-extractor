// main.ts

import { isValid as isValidUrl } from "./utils/linker.ts";

import retrieve from "./utils/retrieve.ts";
import { isAtom, isRdf, isRSS, validate, xml2obj } from "./utils/xmlparser.ts";
import parseJsonFeed from "./utils/parseJsonFeed.ts";
import parseRssFeed from "./utils/parseRssFeed.ts";
import parseAtomFeed from "./utils/parseAtomFeed.ts";
import parseRdfFeed from "./utils/parseRdfFeed.ts";

/** Represents a single entry (article/item) in a feed. */
export interface FeedEntry {
  /** Unique identifier for the entry */
  id: string;
  /** URL link to the entry */
  link?: string;
  /** Title of the entry */
  title?: string;
  /** Description or summary of the entry */
  description?: string;
  /** Publication date as ISO datetime string */
  published?: string;
  /** Additional fields from the original feed */
  [key: string]: unknown;
}

/** Represents parsed feed data with metadata and entries. */
export interface FeedData {
  /** Title of the feed */
  title?: string;
  /** URL link to the feed */
  link?: string;
  /** Description of the feed */
  description?: string;
  /** Generator or software that created the feed */
  generator?: string;
  /** Language of the feed content */
  language?: string;
  /** Publication date as ISO datetime string */
  published?: string;
  /** Array of feed entries */
  entries?: FeedEntry[];
  /** Additional fields from the original feed */
  [key: string]: unknown;
}

/** Custom fetch function type. Receives a URL and returns a Response promise. */
export type Fetcher = (url: string) => Promise<Response>;

/** Options for controlling feed parsing behavior. */
export interface ParserOptions {
  /** Normalize feed data to standard structure. Default: `true` */
  normalization?: boolean;
  /** Convert datetime strings to ISO format. Default: `true` */
  useISODateFormat?: boolean;
  /** Max description length before truncation. Default: `250`. Set to `0` for no truncation. */
  descriptionMaxLen?: number;
  /** Options passed to the underlying XML parser */
  xmlParserOptions?: Record<string, unknown>;
  /** Base URL to absolutify relative links in feed content */
  baseUrl?: string;
  /** Function to extract additional fields from feed metadata */
  getExtraFeedFields?: (
    feedData: Record<string, unknown>,
  ) => Record<string, unknown>;
  /** Function to extract additional fields from each entry */
  getExtraEntryFields?: (
    entryData: Record<string, unknown>,
  ) => Record<string, unknown>;
}

/** Internal normalized options with all defaults applied. */
interface NormalizedOptions {
  normalization: boolean;
  descriptionMaxLen: number;
  useISODateFormat: boolean;
  xmlParserOptions: Record<string, unknown>;
  baseUrl: string;
  getExtraFeedFields: (
    feedData: Record<string, unknown>,
  ) => Record<string, unknown>;
  getExtraEntryFields: (
    entryData: Record<string, unknown>,
  ) => Record<string, unknown>;
  [key: string]: unknown;
}

/** Apply default values to parser options. */
const getopt = (options: ParserOptions = {}): NormalizedOptions => {
  const {
    normalization = true,
    descriptionMaxLen = 250,
    useISODateFormat = true,
    xmlParserOptions = {},
    baseUrl = "",
    getExtraFeedFields = () => ({}),
    getExtraEntryFields = () => ({}),
  } = options;

  return {
    normalization,
    descriptionMaxLen,
    useISODateFormat,
    xmlParserOptions,
    baseUrl,
    getExtraFeedFields,
    getExtraEntryFields,
  };
};

/**
 * Extract feed data from a JSON object or string.
 *
 * @param json - JSON object or string from a JSON Feed resource
 * @param options - Parser options
 * @returns Parsed feed data
 */
export const extractFromJson = (
  json: Record<string, unknown> | string,
  options: ParserOptions = {},
): FeedData => {
  const data = typeof json === "string" ? JSON.parse(json) : json;
  return parseJsonFeed(data, getopt(options)) as FeedData;
};

/**
 * Extract feed data from an XML string.
 * Supports RSS, Atom, and RDF feed formats.
 *
 * @param xml - XML string from an RSS/Atom/RDF feed resource
 * @param options - Parser options
 * @returns Parsed feed data
 * @throws {Error} If XML is not well-formed or format is unrecognized
 */
export const extractFromXml = (
  xml: string,
  options: ParserOptions = {},
): FeedData => {
  if (!validate(xml)) {
    throw new Error("The XML document is not well-formed");
  }

  const opts = getopt(options);

  const data = xml2obj(xml, opts.xmlParserOptions);

  const result = isRSS(data)
    ? parseRssFeed(data, opts)
    : isAtom(data)
    ? parseAtomFeed(data, opts)
    : isRdf(data)
    ? parseRdfFeed(data, opts)
    : null;
  if (!result) {
    throw new Error("Unrecognized feed format");
  }
  return result as FeedData;
};

/**
 * Load and extract feed data from a remote URL.
 * Automatically detects RSS, Atom, RDF, or JSON feed formats.
 *
 * @param url - URL of the feed source
 * @param options - Parser options
 * @param fetcher - Custom fetch function (defaults to globalThis.fetch)
 * @returns Parsed feed data
 * @throws {Error} If URL is invalid or content cannot be loaded
 */
export const extract = async (
  url: string,
  options: ParserOptions = {},
  fetcher: Fetcher = globalThis.fetch,
): Promise<FeedData> => {
  if (!isValidUrl(url)) {
    throw new Error("Input param must be a valid URL");
  }

  const data = await retrieve(url, fetcher);
  if (!data.text && !data.json) {
    throw new Error(`Failed to load content from "${url}"`);
  }

  const { type, json, text } = data;

  return type === "json"
    ? extractFromJson(json as Record<string, unknown>, options)
    : extractFromXml(text!, options);
};

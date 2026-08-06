// main.ts

import { isValid as isValidUrl } from "./utils/linker.ts";

import retrieve from "./utils/retrieve.ts";
import { isAtom, isRdf, isRSS, validate, xml2obj } from "./utils/xmlparser.ts";
import parseJsonFeed from "./utils/parseJsonFeed.ts";
import parseRssFeed from "./utils/parseRssFeed.ts";
import parseAtomFeed from "./utils/parseAtomFeed.ts";
import parseRdfFeed from "./utils/parseRdfFeed.ts";

export interface FeedEntry {
  id: string;
  link?: string;
  title?: string;
  description?: string;
  published?: string;
  [key: string]: unknown;
}

export interface FeedData {
  title?: string;
  link?: string;
  description?: string;
  generator?: string;
  language?: string;
  published?: string;
  entries?: FeedEntry[];
  [key: string]: unknown;
}

export type Fetcher = (url: string) => Promise<Response>;

export interface ParserOptions {
  normalization?: boolean;
  useISODateFormat?: boolean;
  descriptionMaxLen?: number;
  xmlParserOptions?: Record<string, unknown>;
  baseUrl?: string;
  getExtraFeedFields?: (
    feedData: Record<string, unknown>,
  ) => Record<string, unknown>;
  getExtraEntryFields?: (
    entryData: Record<string, unknown>,
  ) => Record<string, unknown>;
}

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

export const extractFromJson = (
  json: Record<string, unknown> | string,
  options: ParserOptions = {},
): FeedData => {
  const data = typeof json === "string" ? JSON.parse(json) : json;
  return parseJsonFeed(data, getopt(options)) as FeedData;
};

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

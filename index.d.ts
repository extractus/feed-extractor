// Type definitions

export interface FeedEntry {
  /**
   * id, guid, or generated identifier for the entry
   */
  id: string;
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

export type MergedFeedEntry<TFeedExtraField extends object, TFeedEntryExtraField extends object> = Omit<FeedData, 'entries'> & TFeedExtraField & {
  entries?: (FeedEntry & TFeedEntryExtraField)[]
}

export interface ProxyConfig {
  target?: string;
  headers?: any;
}

export interface ReaderOptions<TFeedExtraField extends object, TFeedEntryExtraField extends object> {
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
   * merge extra feed fields in result
   */
  getExtraFeedFields?: (feedData: Record<keyof any, unknown>) => TFeedExtraField;
  /**
   * merge extra entry fields in result
   */
  getExtraEntryFields?: (entryData: Record<keyof any, unknown>) => TFeedEntryExtraField;
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
}

export function extractFromXml<TFeedExtraField extends object = {}, TFeedEntryExtraField extends object = {}>(xml: string, options?: ReaderOptions<TFeedExtraField, TFeedEntryExtraField>): MergedFeedEntry<TFeedExtraField, TFeedEntryExtraField>;
export function extractFromJson<TFeedExtraField extends object = {}, TFeedEntryExtraField extends object = {}>(json: string, options?: ReaderOptions<TFeedExtraField, TFeedEntryExtraField>): MergedFeedEntry<TFeedExtraField, TFeedEntryExtraField>;

export function extract<TFeedExtraField extends object = {}, TFeedEntryExtraField extends object = {}>(url: string, options?: ReaderOptions<TFeedExtraField, TFeedEntryExtraField>, fetchOptions?: FetchOptions): Promise<MergedFeedEntry<TFeedExtraField, TFeedEntryExtraField>>;

export function read<TFeedExtraField extends object = {}, TFeedEntryExtraField extends object = {}>(url: string, options?: ReaderOptions<TFeedExtraField, TFeedEntryExtraField>, fetchOptions?: FetchOptions): Promise<MergedFeedEntry<TFeedExtraField, TFeedEntryExtraField>>;

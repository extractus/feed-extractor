// Type definitions

export function read(
  url: string,
  requestFn: (
    url: string,
    getRequestOptions: () => any
  ) => Promise<{ data: any; headers: any }>
): Promise<FeedData>;

export interface FeedData {
  link?: string;
  title?: string;
  description?: string;
  generator?: string;
  language?: string;
  published?: string;
  entries?: Array<any>;
}

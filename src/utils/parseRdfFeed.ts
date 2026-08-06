// parseRdfFeed.ts

// specs: https://www.rssboard.org/rss-specification

import { isArray } from "@pwshub/bellajs";

import {
  buildDescription,
  getEntryId,
  getPureUrl,
  getText,
  toISODateString,
} from "./normalizer.ts";

const transform = (
  item: Record<string, unknown>,
  options: Record<string, unknown>,
): Record<string, unknown> => {
  const {
    useISODateFormat,
    descriptionMaxLen,
    baseUrl,
    getExtraEntryFields,
  } = options as {
    useISODateFormat: boolean;
    descriptionMaxLen: number;
    baseUrl: string;
    getExtraEntryFields: (
      data: Record<string, unknown>,
    ) => Record<string, unknown>;
  };

  const {
    guid = "",
    title = "",
    link = "",
    "dc:date": pubDate = "",
    description = "",
    "content:encoded": content = "",
  } = item as Record<string, unknown>;

  const published = useISODateFormat
    ? toISODateString(pubDate as string)
    : pubDate;
  const htmlContent = getText(description || content);
  const entry = {
    id: getEntryId(guid, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, guid, baseUrl),
    published,
    description: buildDescription(htmlContent, descriptionMaxLen),
  };

  const extraFields = getExtraEntryFields(item);

  return {
    ...entry,
    ...extraFields,
  };
};

const flatten = (
  feed: Record<string, unknown>,
  baseUrl: string,
): Record<string, unknown> => {
  const {
    title = "",
    link = "",
    item,
  } = feed as Record<string, unknown>;

  const items = isArray(item) ? item as unknown[] : [item];
  const entries = items.map((entry) => {
    const {
      id,
      title = "",
      link = "",
    } = entry as Record<string, unknown>;

    const item = {
      ...entry as Record<string, unknown>,
      title: getText(title),
      link: getPureUrl(link, id, baseUrl),
    };

    return item;
  });

  const output = {
    ...feed as Record<string, unknown>,
    title: getText(title),
    link: getPureUrl(link, "", baseUrl),
    item: isArray(item) ? entries : entries[0],
  };
  return output;
};

const parseRdf = (
  data: Record<string, unknown>,
  options: Record<string, unknown> = {},
): Record<string, unknown> => {
  const {
    normalization,
    baseUrl,
    getExtraFeedFields,
  } = options as {
    normalization: boolean;
    baseUrl: string;
    getExtraFeedFields: (
      data: Record<string, unknown>,
    ) => Record<string, unknown>;
  };

  const feedData = (data as Record<string, Record<string, unknown>>)["rdf:RDF"];

  if (!normalization) {
    return flatten(feedData, baseUrl);
  }

  const {
    title = "",
    link = "",
    description = "",
    generator = "",
    "dc:language": language = "",
    "dc:date": lastBuildDate = "",
  } = feedData.channel as Record<string, unknown>;

  const { item } = feedData as Record<string, unknown>;

  const extraFields = getExtraFeedFields(feedData);

  const items = isArray(item) ? item as unknown[] : [item];

  const published = (options as { useISODateFormat: boolean }).useISODateFormat
    ? toISODateString(lastBuildDate as string)
    : lastBuildDate;

  return {
    title: getText(title),
    link: getPureUrl(link, "", baseUrl),
    description: getText(description),
    language,
    generator,
    published,
    ...extraFields,
    entries: items.map((item) => {
      return transform(item as Record<string, unknown>, options);
    }),
  };
};

export default (
  data: Record<string, unknown>,
  options: Record<string, unknown> = {},
): Record<string, unknown> => {
  return parseRdf(data, options);
};

// parseAtomFeed.ts

// specs: https://datatracker.ietf.org/doc/html/rfc5023
// refer: https://validator.w3.org/feed/docs/atom.html

import { hasProperty, isArray } from "@pwshub/bellajs";

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
    id = "",
    title = "",
    issued = "",
    modified = "",
    updated = "",
    published = "",
    link = "",
    summary = "",
    content = "",
  } = item as Record<string, unknown>;

  const pubDate = updated || modified || published || issued;
  const htmlContent = getText(summary || content);
  const entry = {
    id: getEntryId(id, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, id, baseUrl),
    published: useISODateFormat ? toISODateString(pubDate as string) : pubDate,
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
    id,
    title = "",
    link = "",
    entry,
  } = feed as Record<string, unknown>;

  const entries = isArray(entry) ? entry as unknown[] : [entry];
  const items = entries.map((entry) => {
    const {
      id,
      title = "",
      link = "",
      summary = "",
      content = "",
    } = entry as Record<string, unknown>;
    const item = {
      ...entry as Record<string, unknown>,
      title: getText(title),
      link: getPureUrl(link, id, baseUrl),
    };
    if (hasProperty(entry as Record<string, unknown>, "summary")) {
      (item as Record<string, unknown>).summary = getText(summary);
    }
    if (hasProperty(entry as Record<string, unknown>, "content")) {
      (item as Record<string, unknown>).content = getText(content);
    }
    return item;
  });

  const output = {
    ...feed as Record<string, unknown>,
    title: getText(title),
    link: getPureUrl(link, id, baseUrl),
    entry: isArray(entry) ? items : items[0],
  };
  return output;
};

const parseAtom = (
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

  const feedData = (data as Record<string, Record<string, unknown>>).feed;

  if (!normalization) {
    return flatten(feedData, baseUrl);
  }

  const {
    id = "",
    title = "",
    link = "",
    subtitle = "",
    generator = "",
    language = feedData.language || feedData["@_xml:lang"] || "",
    updated = "",
    entry: item = [],
  } = feedData as Record<string, unknown>;

  const extraFields = getExtraFeedFields(feedData);

  const items = isArray(item) ? item as unknown[] : [item];

  const published = (options as { useISODateFormat: boolean }).useISODateFormat
    ? toISODateString(updated as string)
    : updated;

  return {
    title: getText(title),
    link: getPureUrl(link, id, baseUrl),
    description: getText(subtitle),
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
  return parseAtom(data, options);
};

// parseJsonFeed.ts

// specs: https://www.jsonfeed.org/version/1.1/

import { isArray } from "@pwshub/bellajs";

import {
  buildDescription,
  getEntryId,
  getPureUrl,
  toISODateString,
} from "./normalizer.ts";

import { absolutify, purify as purifyUrl } from "./linker.ts";

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
    url: link = "",
    date_published: pubDate = "",
    summary = "",
    content_html: htmlContent = "",
    content_text: textContent = "",
  } = item as Record<string, string>;

  const published = useISODateFormat ? toISODateString(pubDate) : pubDate;
  const extraFields = getExtraEntryFields(item);

  const entry = {
    id: getEntryId(id, link, pubDate),
    title,
    link: getPureUrl(link, "", baseUrl),
    published,
    description: buildDescription(
      textContent || htmlContent || summary,
      descriptionMaxLen,
    ),
  };

  return {
    ...entry,
    ...extraFields,
  };
};

const parseJson = (
  data: Record<string, unknown>,
  options: Record<string, unknown>,
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

  if (!normalization) {
    return data;
  }

  const {
    title = "",
    home_page_url: homepageUrl = "",
    date_published: pubDate = "",
    date_modified: modDate = "",
    description = "",
    language = "",
    items: item = [],
  } = data as Record<string, unknown>;

  const extraFields = getExtraFeedFields(data);

  const items = isArray(item) ? item as unknown[] : [item];

  return {
    title,
    link: purifyUrl(homepageUrl as string) ||
      absolutify(baseUrl, homepageUrl as string),
    description,
    language,
    published: pubDate || modDate,
    generator: "",
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
  return parseJson(data, options);
};

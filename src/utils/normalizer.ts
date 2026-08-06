// normalizer

import {
  hasProperty,
  isArray,
  isObject,
  isString,
  stripTags,
  truncateByChar,
} from "@pwshub/bellajs";

import { unescape as unescapeHtmlEntities } from "@std/html/entities";

import {
  absolutify,
  isValid as isValidUrl,
  purify as purifyUrl,
} from "./linker.ts";

export const toISODateString = (dstr: unknown): string => {
  try {
    return dstr ? (new Date(dstr as string)).toISOString() : "";
  } catch {
    return "";
  }
};

export const buildDescription = (val: unknown, maxlen = 0): string => {
  const stripped = stripTags(
    String(val).trim().replace(/^<!\[CDATA\[|\]\]>$/g, ""),
  );
  const text = maxlen > 0 ? truncateByChar(stripped, maxlen) : stripped;
  return text.replace(/\n+/g, " ");
};

export const getText = (val: unknown): string => {
  const txt = isObject(val)
    ? ((val as Record<string, unknown>)._text ||
      (val as Record<string, unknown>)["#text"] ||
      (val as Record<string, unknown>)._cdata ||
      (val as Record<string, unknown>).$t)
    : val;
  return txt ? unescapeHtmlEntities(String(txt).trim()) : "";
};

export const getLink = (val: unknown = [], id: unknown = ""): string => {
  if (
    isObject(id) &&
    hasProperty(id as Record<string, unknown>, "@_isPermaLink") &&
    (id as Record<string, unknown>)["@_isPermaLink"] === "true"
  ) {
    return getText(id);
  }
  const getEntryLink = (links: unknown[]): string => {
    const items = links.map((item) => {
      return getLink(item);
    });
    return items.length > 0 ? items[0] : "";
  };
  const url = isString(val)
    ? getText(val)
    : isObject(val) && hasProperty(val as Record<string, unknown>, "href")
    ? getText((val as Record<string, unknown>).href)
    : isObject(val) && hasProperty(val as Record<string, unknown>, "@_href")
    ? getText((val as Record<string, unknown>)["@_href"])
    : isObject(val) && hasProperty(val as Record<string, unknown>, "@_url")
    ? getText((val as Record<string, unknown>)["@_url"])
    : isObject(val) &&
        hasProperty(val as Record<string, unknown>, "_attributes")
    ? getText(
      ((val as Record<string, unknown>)._attributes as Record<string, unknown>)
        .href,
    )
    : isArray(val)
    ? getEntryLink(val as unknown[])
    : "";

  return url ? url : isValidUrl(id as string) ? id as string : "";
};

export const getPureUrl = (
  url: unknown,
  id: unknown = "",
  baseUrl: string = "",
): string => {
  const link = getLink(url, id);
  const pu = purifyUrl(link);

  return link ? pu ? pu : absolutify(baseUrl, link) : "";
};

const hash = (str: string): string =>
  Math.abs(
    str.split("").reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0),
  ).toString(36);

export const getEntryId = (
  id: unknown,
  url: unknown,
  pubDate: unknown,
): string => {
  return id
    ? getText(id)
    : hash(getPureUrl(url)) + "-" + (new Date(pubDate as string)).getTime();
};

export const getEnclosure = (
  val: Record<string, unknown>,
): { url: string; type: string; length: number } | null => {
  const url = hasProperty(val, "@_url") ? val["@_url"] as string : "";
  const type = hasProperty(val, "@_type") ? val["@_type"] as string : "";
  const length = Number(hasProperty(val, "@_length") ? val["@_length"] : 0);
  return !url || !type ? null : {
    url,
    type,
    length,
  };
};

const getCategory = (v: unknown): unknown => {
  return isObject(v)
    ? {
      text: getText(v),
      domain: (v as Record<string, unknown>)["@_domain"],
    }
    : v;
};

export const getOptionalTags = (val: unknown, key: string): unknown => {
  if (key === "source") {
    return {
      text: getText(val),
      url: getLink(val),
    };
  }
  if (key === "category") {
    return isArray(val)
      ? (val as unknown[]).map(getCategory)
      : getCategory(val);
  }
  if (key === "enclosure") {
    return getEnclosure(val as Record<string, unknown>);
  }
  return val;
};

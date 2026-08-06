// utils / xmlparser

import { hasProperty, isString } from "@pwshub/bellajs";

import { XMLParser, XMLValidator } from "fast-xml-parser";

export const isRSS = (data: Record<string, unknown> = {}): boolean => {
  return hasProperty(data, "rss") &&
    hasProperty(
      (data as Record<string, unknown>).rss as Record<string, unknown>,
      "channel",
    );
};

export const isAtom = (data: Record<string, unknown> = {}): boolean => {
  return hasProperty(data, "feed") &&
    hasProperty(
      (data as Record<string, unknown>).feed as Record<string, unknown>,
      "entry",
    );
};

export const isRdf = (data: Record<string, unknown> = {}): boolean => {
  return hasProperty(data, "rdf:RDF") &&
    hasProperty(
      (data as Record<string, unknown>)["rdf:RDF"] as Record<string, unknown>,
      "channel",
    );
};

export const validate = (xml: unknown): boolean => {
  if (!isString(xml) || !(xml as string).length) return false;
  return XMLValidator.validate(xml as string) === true;
};

export const xml2obj = (
  xml = "",
  extraOptions: Record<string, unknown> = {},
): Record<string, unknown> => {
  const options = {
    attributeNamePrefix: "@_",
    ignoreAttributes: false,
    ...extraOptions,
  };
  const parser = new XMLParser(options);
  const jsonObj = parser.parse(xml);
  return jsonObj as Record<string, unknown>;
};

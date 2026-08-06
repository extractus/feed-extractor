// utils -> retrieve

import { XMLParser } from "fast-xml-parser";

const getCharsetFromText = (text: string): string => {
  try {
    const firstLine = text.split("\n")[0].trim().replace("<?", "<").replace(
      "?>",
      ">",
    );
    const parser = new XMLParser({
      ignoreAttributes: false,
    });
    const obj = parser.parse(firstLine);
    const { xml: root = {} } = obj as Record<string, Record<string, unknown>>;
    return (root["@_encoding"] as string) || "utf8";
  } catch {
    return "utf8";
  }
};

export default async (
  url: string,
  fetcher: (url: string) => Promise<Response>,
): Promise<{
  type: string;
  text?: string;
  json?: unknown;
  status: number;
  contentType: string | null;
}> => {
  const res = await fetcher(url);

  const status = res.status;
  if (status >= 400) {
    throw new Error(`Request failed with error code ${status}`);
  }
  const contentType = res.headers.get("content-type");
  const buffer = await res.arrayBuffer();
  const text = buffer ? new TextDecoder().decode(buffer).trim() : "";

  if (/(\+|\/)json/.test(contentType || "")) {
    try {
      const data = JSON.parse(text);
      return { type: "json", json: data, status, contentType };
    } catch {
      throw new Error("Failed to convert data to JSON object");
    }
  }

  const arr = (contentType || "").split("charset=");
  const charset = arr.length === 2 ? arr[1].trim() : getCharsetFromText(text);
  const decoder = new TextDecoder(charset);
  const xml = decoder.decode(buffer);

  const startTokens = [
    "<?xml",
    "<rss/",
    "<feed/",
    "<rdf:",
  ];

  if (
    /(\+|\/)(xml|html)/.test(contentType || "") ||
    startTokens.some((x) => xml.startsWith(x))
  ) {
    return { type: "xml", text: xml.trim(), status, contentType };
  }

  throw new Error(`Invalid content type: ${contentType}`);
};

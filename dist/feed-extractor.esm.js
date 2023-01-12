// @extractus/feed-extractor@6.2.1, by @extractus - built with esbuild at 2023-01-12T04:44:59.011Z - published under MIT license
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a, arrayMode) {
      if (a) {
        const keys = Object.keys(a);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          if (arrayMode === "strict") {
            target[keys[i]] = [a[keys[i]]];
          } else {
            target[keys[i]] = a[keys[i]];
          }
        }
      }
    };
    exports.getValue = function(v) {
      if (exports.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i = 0; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
          i += 2;
          i = readPI(xmlData, i);
          if (i.err)
            return i;
        } else if (xmlData[i] === "<") {
          let tagStartPos = i;
          i++;
          if (xmlData[i] === "!") {
            i = readCommentAndCDATA(xmlData, i);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i] === "/") {
              closingTag = true;
              i++;
            }
            let tagName = "";
            for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
              tagName += xmlData[i];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
            }
            const result = readAttributeStr(xmlData, i);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
            }
            let attrStr = result.value;
            i = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid2 = validateAttributeString(attrStr, options);
              if (isValid2 === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid2.err.code, isValid2.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid2.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid2 = validateAttributeString(attrStr, options);
              if (isValid2 !== true) {
                return getErrorObject(isValid2.err.code, isValid2.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid2.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i++; i < xmlData.length; i++) {
              if (xmlData[i] === "<") {
                if (xmlData[i + 1] === "!") {
                  i++;
                  i = readCommentAndCDATA(xmlData, i);
                  continue;
                } else if (xmlData[i + 1] === "?") {
                  i = readPI(xmlData, ++i);
                  if (i.err)
                    return i;
                } else {
                  break;
                }
              } else if (xmlData[i] === "&") {
                const afterAmp = validateAmpersand(xmlData, i);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
                i = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
                }
              }
            }
            if (xmlData[i] === "<") {
              i--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    function readPI(xmlData, i) {
      const start = i;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] == "?" || xmlData[i] == " ") {
          const tagname = xmlData.substr(start, i - start);
          if (i > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
          } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
            i++;
            break;
          } else {
            continue;
          }
        }
      }
      return i;
    }
    function readCommentAndCDATA(xmlData, i) {
      if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
        for (i += 3; i < xmlData.length; i++) {
          if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
        let angleBracketsCount = 1;
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      }
      return i;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i];
          } else if (startChar !== xmlData[i]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
        }
        const attrName = matches[i][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i) {
      let re = /\d/;
      if (xmlData[i] === "x") {
        i++;
        re = /[\da-fA-F]/;
      }
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === ";")
          return i;
        if (!xmlData[i].match(re))
          break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i) {
      i++;
      if (xmlData[i] === ";")
        return -1;
      if (xmlData[i] === "#") {
        i++;
        return validateNumberAmpersand(xmlData, i);
      }
      let count = 0;
      for (; i < xmlData.length; i++, count++) {
        if (xmlData[i].match(/\w/) && count < 20)
          continue;
        if (xmlData[i] === ";")
          break;
        return -1;
      }
      return i;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true
      },
      tagValueProcessor: function(tagName, val) {
        return val;
      },
      attributeValueProcessor: function(attrName, val) {
        return val;
      },
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false
    };
    var buildOptions = function(options) {
      return Object.assign({}, defaultOptions, options);
    };
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module) {
    "use strict";
    var XmlNode = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val) {
        this.child.push({ [key]: val });
      }
      addChild(node) {
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module.exports = XmlNode;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module) {
    function readDocType(xmlData, i) {
      const entities = {};
      if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
        i = i + 9;
        let angleBracketsCount = 1;
        let hasBody = false, entity = false, comment = false;
        let exp = "";
        for (; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            if (hasBody && xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "N" && xmlData[i + 4] === "T" && xmlData[i + 5] === "I" && xmlData[i + 6] === "T" && xmlData[i + 7] === "Y") {
              i += 7;
              entity = true;
            } else if (hasBody && xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "L" && xmlData[i + 4] === "E" && xmlData[i + 5] === "M" && xmlData[i + 6] === "E" && xmlData[i + 7] === "N" && xmlData[i + 8] === "T") {
              i += 8;
            } else if (hasBody && xmlData[i + 1] === "!" && xmlData[i + 2] === "A" && xmlData[i + 3] === "T" && xmlData[i + 4] === "T" && xmlData[i + 5] === "L" && xmlData[i + 6] === "I" && xmlData[i + 7] === "S" && xmlData[i + 8] === "T") {
              i += 8;
            } else if (hasBody && xmlData[i + 1] === "!" && xmlData[i + 2] === "N" && xmlData[i + 3] === "O" && xmlData[i + 4] === "T" && xmlData[i + 5] === "A" && xmlData[i + 6] === "T" && xmlData[i + 7] === "I" && xmlData[i + 8] === "O" && xmlData[i + 9] === "N") {
              i += 9;
            } else if (
              //comment
              xmlData[i + 1] === "!" && xmlData[i + 2] === "-" && xmlData[i + 3] === "-"
            ) {
              comment = true;
            } else {
              throw new Error("Invalid DOCTYPE");
            }
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i] === ">") {
            if (comment) {
              if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
                comment = false;
              } else {
                throw new Error(`Invalid XML comment in DOCTYPE`);
              }
            } else if (entity) {
              parseEntityExp(exp, entities);
              entity = false;
            }
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i };
    }
    var entityRegex = RegExp(`^\\s([a-zA-z0-0]+)[ 	](['"])([^&]+)\\2`);
    function parseEntityExp(exp, entities) {
      const match = entityRegex.exec(exp);
      if (match) {
        entities[match[1]] = {
          regx: RegExp(`&${match[1]};`, "g"),
          val: match[3]
        };
      }
    }
    module.exports = readDocType;
  }
});

// node_modules/.pnpm/strnum@1.0.5/node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/.pnpm/strnum@1.0.5/node_modules/strnum/strnum.js"(exports, module) {
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
    if (!Number.parseInt && window.parseInt) {
      Number.parseInt = window.parseInt;
    }
    if (!Number.parseFloat && window.parseFloat) {
      Number.parseFloat = window.parseFloat;
    }
    var consider = {
      hex: true,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string")
        return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr))
        return str;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return Number.parseInt(trimmedStr, 16);
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          const eNotation = match[4] || match[6];
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".")
            return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".")
            return str;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation)
                return num;
              else
                return str;
            } else if (eNotation) {
              if (options.eNotation)
                return num;
              else
                return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "")
                return num;
              else if (numStr === numTrimmedByZeros)
                return num;
              else if (sign && numStr === "-" + numTrimmedByZeros)
                return num;
              else
                return str;
            }
            if (leadingZeros) {
              if (numTrimmedByZeros === numStr)
                return num;
              else if (sign + numTrimmedByZeros === numStr)
                return num;
              else
                return str;
            }
            if (trimmedStr === numStr)
              return num;
            else if (trimmedStr === sign + numStr)
              return num;
            return str;
          }
        } else {
          return str;
        }
      }
    }
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".")
          numStr = "0";
        else if (numStr[0] === ".")
          numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".")
          numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    module.exports = toNumber;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module) {
    "use strict";
    var util = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    var regx = "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, util.nameRegexp);
    var OrderedObjParser = class {
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "¢" },
          "pound": { regex: /&(pound|#163);/g, val: "£" },
          "yen": { regex: /&(yen|#165);/g, val: "¥" },
          "euro": { regex: /&(euro|#8364);/g, val: "€" },
          "copyright": { regex: /&(copy|#169);/g, val: "©" },
          "reg": { regex: /&(reg|#174);/g, val: "®" },
          "inr": { regex: /&(inr|#8377);/g, val: "₹" }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i = 0; i < entKeys.length; i++) {
        const ent = entKeys[i];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val = val.trim();
        }
        if (val.length > 0) {
          if (!escapeEntities)
            val = this.replaceEntitiesValue(val);
          const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val;
          } else if (typeof newval !== typeof val || newval !== val) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val.trim();
            if (trimmedVal === val) {
              return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val;
            }
          }
        }
      }
    }
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath) {
      if (!this.options.ignoreAttributes && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i = 0; i < len; i++) {
          const attrName = this.resolveNameSpace(matches[i][1]);
          let oldVal = matches[i][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var parseXml = function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i = 0; i < xmlData.length; i++) {
        const ch = xmlData[i];
        if (ch === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            let tagData = readTagExp(xmlData, i, false, "?>");
            if (!tagData)
              throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath);
              }
              currentNode.addChild(childNode);
            }
            i = tagData.closeIndex + 1;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i = endIndex;
          } else if (xmlData.substr(i + 1, 2) === "!D") {
            const result = readDocType(xmlData, i);
            this.docTypeEntities = result.entities;
            i = result.i;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true);
              if (val == void 0)
                val = "";
              currentNode.add(this.options.textNodeName, val);
            }
            i = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
            let tagName = result.tagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                i = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, tagName, closeIndex + 1);
                if (!result2)
                  throw new Error(`Unexpected end of ${tagName}`);
                i = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              currentNode.addChild(childNode);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
                }
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
                currentNode.addChild(childNode);
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
                }
                currentNode.addChild(childNode);
                currentNode = childNode;
              }
              textData = "";
              i = closeIndex;
            }
          }
        } else {
          textData += xmlData[i];
        }
      }
      return xmlObj.child;
    };
    var replaceEntitiesValue = function(val) {
      if (this.options.processEntities) {
        for (let entityName in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName];
          val = val.replace(entity.regx, entity.val);
        }
        for (let entityName in this.lastEntities) {
          const entity = this.lastEntities[entityName];
          val = val.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName in this.htmlEntities) {
            const entity = this.htmlEntities[entityName];
            val = val.replace(entity.regex, entity.val);
          }
        }
        val = val.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val;
    };
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0)
          isLeafNode = Object.keys(currentNode.child).length === 0;
        textData = this.parseTextData(
          textData,
          currentNode.tagname,
          jPath,
          false,
          currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp)
          return true;
      }
      return false;
    }
    function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i; index < xmlData.length; index++) {
        let ch = xmlData[index];
        if (attrBoundary) {
          if (ch === attrBoundary)
            attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    function findClosingIndex(xmlData, str, i, errMsg) {
      const closingIndex = xmlData.indexOf(str, i);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
      if (!result)
        return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, "");
        tagExp = tagExp.substr(separatorIndex + 1);
      }
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent
      };
    }
    function readStopNodeData(xmlData, tagName, i) {
      const startIndex = i;
      let openTagCount = 1;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i),
                  i: closeIndex
                };
              }
            }
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
            i = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i = tagData.closeIndex;
            }
          }
        }
      }
    }
    function parseValue(val, shouldParse, options) {
      if (shouldParse && typeof val === "string") {
        const newval = val.trim();
        if (newval === "true")
          return true;
        else if (newval === "false")
          return false;
        else
          return toNumber(val, options);
      } else {
        if (util.isExist(val)) {
          return val;
        } else {
          return "";
        }
      }
    }
    module.exports = OrderedObjParser;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    "use strict";
    function prettify(node, options) {
      return compress(node, options);
    }
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0)
          newJpath = property;
        else
          newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0)
            text = tagObj[property];
          else
            text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val, options);
          if (tagObj[":@"]) {
            assignAttributes(val, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val = val[options.textNodeName];
          } else if (Object.keys(val).length === 0) {
            if (options.alwaysCreateTextNode)
              val[options.textNodeName] = "";
            else
              val = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val];
            } else {
              compressedObj[property] = val;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0)
          compressedObj[options.textNodeName] = text;
      } else if (text !== void 0)
        compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== ":@")
          return key;
      }
    }
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          const atrrName = keys[i];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    function isLeafTag(obj, options) {
      const propCount = Object.keys(obj).length;
      if (propCount === 0 || propCount === 1 && obj[options.textNodeName])
        return true;
      return false;
    }
    exports.prettify = prettify;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module) {
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true)
            validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0)
          return orderedResult;
        else
          return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module.exports = XMLParser2;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module) {
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);
        let newJPath = "";
        if (jPath.length === 0)
          newJPath = tagName;
        else
          newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode)
            xmlStr += tagStart + ">";
          else
            xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== ":@")
          return key;
      }
    }
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName)
          return true;
      }
      return false;
    }
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i = 0; i < options.entities.length; i++) {
          const entity = options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    module.exports = toXml;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module) {
    "use strict";
    var buildFromOrderedJs = require_orderedJs2Xml();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: function(key, a) {
        return a;
      },
      attributeValueProcessor: function(attrName, a) {
        return a;
      },
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: []
      // transformTagName: false,
      // transformAttributeName: false,
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
      if (this.options.suppressEmptyNode) {
        this.buildTextNode = buildEmptyTextNode;
        this.buildObjNode = buildEmptyObjNode;
      } else {
        this.buildTextNode = buildTextValNode;
        this.buildObjNode = buildObjectNode;
      }
      this.buildTextValNode = buildTextValNode;
      this.buildObjectNode = buildObjectNode;
      this.replaceEntitiesValue = replaceEntitiesValue;
      this.buildAttrPairStr = buildAttrPairStr;
    }
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val = "";
      for (let key in jObj) {
        if (typeof jObj[key] === "undefined") {
        } else if (jObj[key] === null) {
          if (key[0] === "?")
            val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          else
            val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        } else if (jObj[key] instanceof Date) {
          val += this.buildTextNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val += this.replaceEntitiesValue(newval);
            } else {
              val += this.buildTextNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          for (let j = 0; j < arrLen; j++) {
            const item = jObj[key][j];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?")
                val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else
                val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              val += this.processTextOrObjNode(item, key, level);
            } else {
              val += this.buildTextNode(item, key, "", level);
            }
          }
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j = 0; j < L; j++) {
              attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
            }
          } else {
            val += this.processTextOrObjNode(jObj[key], key, level);
          }
        }
      }
      return { attrStr, val };
    };
    function buildAttrPairStr(attrName, val) {
      val = this.options.attributeValueProcessor(attrName, "" + val);
      val = this.replaceEntitiesValue(val);
      if (this.options.suppressBooleanAttributes && val === "true") {
        return " " + attrName;
      } else
        return " " + attrName + '="' + val + '"';
    }
    function processTextOrObjNode(object, key, level) {
      const result = this.j2x(object, level + 1);
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjNode(result.val, key, result.attrStr, level);
      }
    }
    function buildObjectNode(val, key, attrStr, level) {
      let tagEndExp = "</" + key + this.tagEndChar;
      let piClosingChar = "";
      if (key[0] === "?") {
        piClosingChar = "?";
        tagEndExp = "";
      }
      if (attrStr && val.indexOf("<") === -1) {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
      }
    }
    function buildEmptyObjNode(val, key, attrStr, level) {
      if (val !== "") {
        return this.buildObjectNode(val, key, attrStr, level);
      } else {
        if (key[0] === "?")
          return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else
          return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
      }
    }
    function buildTextValNode(val, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else {
        let textValue = this.options.tagValueProcessor(key, val);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "" && this.options.unpairedTags.indexOf(key) !== -1) {
          if (this.options.suppressUnpairedNode) {
            return this.indentate(level) + "<" + key + this.tagEndChar;
          } else {
            return this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          }
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    }
    function replaceEntitiesValue(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i = 0; i < this.options.entities.length; i++) {
          const entity = this.options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    function buildEmptyTextNode(val, key, attrStr, level) {
      if (val === "" && this.options.unpairedTags.indexOf(key) !== -1) {
        if (this.options.suppressUnpairedNode) {
          return this.indentate(level) + "<" + key + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        }
      } else if (val !== "") {
        return this.buildTextValNode(val, key, attrStr, level);
      } else {
        if (key[0] === "?")
          return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else
          return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
      }
    }
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix)) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    module.exports = Builder;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.0.13/node_modules/fast-xml-parser/src/fxp.js"(exports, module) {
    "use strict";
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// node_modules/.pnpm/html-entities@2.3.3/node_modules/html-entities/lib/named-references.js
var require_named_references = __commonJS({
  "node_modules/.pnpm/html-entities@2.3.3/node_modules/html-entities/lib/named-references.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bodyRegExps = { xml: /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g, html4: /&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g, html5: /&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g };
    exports.namedReferences = { xml: { entities: { "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&amp;": "&" }, characters: { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;", "&": "&amp;" } }, html4: { entities: { "&apos;": "'", "&nbsp": " ", "&nbsp;": " ", "&iexcl": "¡", "&iexcl;": "¡", "&cent": "¢", "&cent;": "¢", "&pound": "£", "&pound;": "£", "&curren": "¤", "&curren;": "¤", "&yen": "¥", "&yen;": "¥", "&brvbar": "¦", "&brvbar;": "¦", "&sect": "§", "&sect;": "§", "&uml": "¨", "&uml;": "¨", "&copy": "©", "&copy;": "©", "&ordf": "ª", "&ordf;": "ª", "&laquo": "«", "&laquo;": "«", "&not": "¬", "&not;": "¬", "&shy": "­", "&shy;": "­", "&reg": "®", "&reg;": "®", "&macr": "¯", "&macr;": "¯", "&deg": "°", "&deg;": "°", "&plusmn": "±", "&plusmn;": "±", "&sup2": "²", "&sup2;": "²", "&sup3": "³", "&sup3;": "³", "&acute": "´", "&acute;": "´", "&micro": "µ", "&micro;": "µ", "&para": "¶", "&para;": "¶", "&middot": "·", "&middot;": "·", "&cedil": "¸", "&cedil;": "¸", "&sup1": "¹", "&sup1;": "¹", "&ordm": "º", "&ordm;": "º", "&raquo": "»", "&raquo;": "»", "&frac14": "¼", "&frac14;": "¼", "&frac12": "½", "&frac12;": "½", "&frac34": "¾", "&frac34;": "¾", "&iquest": "¿", "&iquest;": "¿", "&Agrave": "À", "&Agrave;": "À", "&Aacute": "Á", "&Aacute;": "Á", "&Acirc": "Â", "&Acirc;": "Â", "&Atilde": "Ã", "&Atilde;": "Ã", "&Auml": "Ä", "&Auml;": "Ä", "&Aring": "Å", "&Aring;": "Å", "&AElig": "Æ", "&AElig;": "Æ", "&Ccedil": "Ç", "&Ccedil;": "Ç", "&Egrave": "È", "&Egrave;": "È", "&Eacute": "É", "&Eacute;": "É", "&Ecirc": "Ê", "&Ecirc;": "Ê", "&Euml": "Ë", "&Euml;": "Ë", "&Igrave": "Ì", "&Igrave;": "Ì", "&Iacute": "Í", "&Iacute;": "Í", "&Icirc": "Î", "&Icirc;": "Î", "&Iuml": "Ï", "&Iuml;": "Ï", "&ETH": "Ð", "&ETH;": "Ð", "&Ntilde": "Ñ", "&Ntilde;": "Ñ", "&Ograve": "Ò", "&Ograve;": "Ò", "&Oacute": "Ó", "&Oacute;": "Ó", "&Ocirc": "Ô", "&Ocirc;": "Ô", "&Otilde": "Õ", "&Otilde;": "Õ", "&Ouml": "Ö", "&Ouml;": "Ö", "&times": "×", "&times;": "×", "&Oslash": "Ø", "&Oslash;": "Ø", "&Ugrave": "Ù", "&Ugrave;": "Ù", "&Uacute": "Ú", "&Uacute;": "Ú", "&Ucirc": "Û", "&Ucirc;": "Û", "&Uuml": "Ü", "&Uuml;": "Ü", "&Yacute": "Ý", "&Yacute;": "Ý", "&THORN": "Þ", "&THORN;": "Þ", "&szlig": "ß", "&szlig;": "ß", "&agrave": "à", "&agrave;": "à", "&aacute": "á", "&aacute;": "á", "&acirc": "â", "&acirc;": "â", "&atilde": "ã", "&atilde;": "ã", "&auml": "ä", "&auml;": "ä", "&aring": "å", "&aring;": "å", "&aelig": "æ", "&aelig;": "æ", "&ccedil": "ç", "&ccedil;": "ç", "&egrave": "è", "&egrave;": "è", "&eacute": "é", "&eacute;": "é", "&ecirc": "ê", "&ecirc;": "ê", "&euml": "ë", "&euml;": "ë", "&igrave": "ì", "&igrave;": "ì", "&iacute": "í", "&iacute;": "í", "&icirc": "î", "&icirc;": "î", "&iuml": "ï", "&iuml;": "ï", "&eth": "ð", "&eth;": "ð", "&ntilde": "ñ", "&ntilde;": "ñ", "&ograve": "ò", "&ograve;": "ò", "&oacute": "ó", "&oacute;": "ó", "&ocirc": "ô", "&ocirc;": "ô", "&otilde": "õ", "&otilde;": "õ", "&ouml": "ö", "&ouml;": "ö", "&divide": "÷", "&divide;": "÷", "&oslash": "ø", "&oslash;": "ø", "&ugrave": "ù", "&ugrave;": "ù", "&uacute": "ú", "&uacute;": "ú", "&ucirc": "û", "&ucirc;": "û", "&uuml": "ü", "&uuml;": "ü", "&yacute": "ý", "&yacute;": "ý", "&thorn": "þ", "&thorn;": "þ", "&yuml": "ÿ", "&yuml;": "ÿ", "&quot": '"', "&quot;": '"', "&amp": "&", "&amp;": "&", "&lt": "<", "&lt;": "<", "&gt": ">", "&gt;": ">", "&OElig;": "Œ", "&oelig;": "œ", "&Scaron;": "Š", "&scaron;": "š", "&Yuml;": "Ÿ", "&circ;": "ˆ", "&tilde;": "˜", "&ensp;": " ", "&emsp;": " ", "&thinsp;": " ", "&zwnj;": "‌", "&zwj;": "‍", "&lrm;": "‎", "&rlm;": "‏", "&ndash;": "–", "&mdash;": "—", "&lsquo;": "‘", "&rsquo;": "’", "&sbquo;": "‚", "&ldquo;": "“", "&rdquo;": "”", "&bdquo;": "„", "&dagger;": "†", "&Dagger;": "‡", "&permil;": "‰", "&lsaquo;": "‹", "&rsaquo;": "›", "&euro;": "€", "&fnof;": "ƒ", "&Alpha;": "Α", "&Beta;": "Β", "&Gamma;": "Γ", "&Delta;": "Δ", "&Epsilon;": "Ε", "&Zeta;": "Ζ", "&Eta;": "Η", "&Theta;": "Θ", "&Iota;": "Ι", "&Kappa;": "Κ", "&Lambda;": "Λ", "&Mu;": "Μ", "&Nu;": "Ν", "&Xi;": "Ξ", "&Omicron;": "Ο", "&Pi;": "Π", "&Rho;": "Ρ", "&Sigma;": "Σ", "&Tau;": "Τ", "&Upsilon;": "Υ", "&Phi;": "Φ", "&Chi;": "Χ", "&Psi;": "Ψ", "&Omega;": "Ω", "&alpha;": "α", "&beta;": "β", "&gamma;": "γ", "&delta;": "δ", "&epsilon;": "ε", "&zeta;": "ζ", "&eta;": "η", "&theta;": "θ", "&iota;": "ι", "&kappa;": "κ", "&lambda;": "λ", "&mu;": "μ", "&nu;": "ν", "&xi;": "ξ", "&omicron;": "ο", "&pi;": "π", "&rho;": "ρ", "&sigmaf;": "ς", "&sigma;": "σ", "&tau;": "τ", "&upsilon;": "υ", "&phi;": "φ", "&chi;": "χ", "&psi;": "ψ", "&omega;": "ω", "&thetasym;": "ϑ", "&upsih;": "ϒ", "&piv;": "ϖ", "&bull;": "•", "&hellip;": "…", "&prime;": "′", "&Prime;": "″", "&oline;": "‾", "&frasl;": "⁄", "&weierp;": "℘", "&image;": "ℑ", "&real;": "ℜ", "&trade;": "™", "&alefsym;": "ℵ", "&larr;": "←", "&uarr;": "↑", "&rarr;": "→", "&darr;": "↓", "&harr;": "↔", "&crarr;": "↵", "&lArr;": "⇐", "&uArr;": "⇑", "&rArr;": "⇒", "&dArr;": "⇓", "&hArr;": "⇔", "&forall;": "∀", "&part;": "∂", "&exist;": "∃", "&empty;": "∅", "&nabla;": "∇", "&isin;": "∈", "&notin;": "∉", "&ni;": "∋", "&prod;": "∏", "&sum;": "∑", "&minus;": "−", "&lowast;": "∗", "&radic;": "√", "&prop;": "∝", "&infin;": "∞", "&ang;": "∠", "&and;": "∧", "&or;": "∨", "&cap;": "∩", "&cup;": "∪", "&int;": "∫", "&there4;": "∴", "&sim;": "∼", "&cong;": "≅", "&asymp;": "≈", "&ne;": "≠", "&equiv;": "≡", "&le;": "≤", "&ge;": "≥", "&sub;": "⊂", "&sup;": "⊃", "&nsub;": "⊄", "&sube;": "⊆", "&supe;": "⊇", "&oplus;": "⊕", "&otimes;": "⊗", "&perp;": "⊥", "&sdot;": "⋅", "&lceil;": "⌈", "&rceil;": "⌉", "&lfloor;": "⌊", "&rfloor;": "⌋", "&lang;": "〈", "&rang;": "〉", "&loz;": "◊", "&spades;": "♠", "&clubs;": "♣", "&hearts;": "♥", "&diams;": "♦" }, characters: { "'": "&apos;", " ": "&nbsp;", "¡": "&iexcl;", "¢": "&cent;", "£": "&pound;", "¤": "&curren;", "¥": "&yen;", "¦": "&brvbar;", "§": "&sect;", "¨": "&uml;", "©": "&copy;", "ª": "&ordf;", "«": "&laquo;", "¬": "&not;", "­": "&shy;", "®": "&reg;", "¯": "&macr;", "°": "&deg;", "±": "&plusmn;", "²": "&sup2;", "³": "&sup3;", "´": "&acute;", "µ": "&micro;", "¶": "&para;", "·": "&middot;", "¸": "&cedil;", "¹": "&sup1;", "º": "&ordm;", "»": "&raquo;", "¼": "&frac14;", "½": "&frac12;", "¾": "&frac34;", "¿": "&iquest;", "À": "&Agrave;", "Á": "&Aacute;", "Â": "&Acirc;", "Ã": "&Atilde;", "Ä": "&Auml;", "Å": "&Aring;", "Æ": "&AElig;", "Ç": "&Ccedil;", "È": "&Egrave;", "É": "&Eacute;", "Ê": "&Ecirc;", "Ë": "&Euml;", "Ì": "&Igrave;", "Í": "&Iacute;", "Î": "&Icirc;", "Ï": "&Iuml;", "Ð": "&ETH;", "Ñ": "&Ntilde;", "Ò": "&Ograve;", "Ó": "&Oacute;", "Ô": "&Ocirc;", "Õ": "&Otilde;", "Ö": "&Ouml;", "×": "&times;", "Ø": "&Oslash;", "Ù": "&Ugrave;", "Ú": "&Uacute;", "Û": "&Ucirc;", "Ü": "&Uuml;", "Ý": "&Yacute;", "Þ": "&THORN;", "ß": "&szlig;", "à": "&agrave;", "á": "&aacute;", "â": "&acirc;", "ã": "&atilde;", "ä": "&auml;", "å": "&aring;", "æ": "&aelig;", "ç": "&ccedil;", "è": "&egrave;", "é": "&eacute;", "ê": "&ecirc;", "ë": "&euml;", "ì": "&igrave;", "í": "&iacute;", "î": "&icirc;", "ï": "&iuml;", "ð": "&eth;", "ñ": "&ntilde;", "ò": "&ograve;", "ó": "&oacute;", "ô": "&ocirc;", "õ": "&otilde;", "ö": "&ouml;", "÷": "&divide;", "ø": "&oslash;", "ù": "&ugrave;", "ú": "&uacute;", "û": "&ucirc;", "ü": "&uuml;", "ý": "&yacute;", "þ": "&thorn;", "ÿ": "&yuml;", '"': "&quot;", "&": "&amp;", "<": "&lt;", ">": "&gt;", "Œ": "&OElig;", "œ": "&oelig;", "Š": "&Scaron;", "š": "&scaron;", "Ÿ": "&Yuml;", "ˆ": "&circ;", "˜": "&tilde;", " ": "&ensp;", " ": "&emsp;", " ": "&thinsp;", "‌": "&zwnj;", "‍": "&zwj;", "‎": "&lrm;", "‏": "&rlm;", "–": "&ndash;", "—": "&mdash;", "‘": "&lsquo;", "’": "&rsquo;", "‚": "&sbquo;", "“": "&ldquo;", "”": "&rdquo;", "„": "&bdquo;", "†": "&dagger;", "‡": "&Dagger;", "‰": "&permil;", "‹": "&lsaquo;", "›": "&rsaquo;", "€": "&euro;", "ƒ": "&fnof;", "Α": "&Alpha;", "Β": "&Beta;", "Γ": "&Gamma;", "Δ": "&Delta;", "Ε": "&Epsilon;", "Ζ": "&Zeta;", "Η": "&Eta;", "Θ": "&Theta;", "Ι": "&Iota;", "Κ": "&Kappa;", "Λ": "&Lambda;", "Μ": "&Mu;", "Ν": "&Nu;", "Ξ": "&Xi;", "Ο": "&Omicron;", "Π": "&Pi;", "Ρ": "&Rho;", "Σ": "&Sigma;", "Τ": "&Tau;", "Υ": "&Upsilon;", "Φ": "&Phi;", "Χ": "&Chi;", "Ψ": "&Psi;", "Ω": "&Omega;", "α": "&alpha;", "β": "&beta;", "γ": "&gamma;", "δ": "&delta;", "ε": "&epsilon;", "ζ": "&zeta;", "η": "&eta;", "θ": "&theta;", "ι": "&iota;", "κ": "&kappa;", "λ": "&lambda;", "μ": "&mu;", "ν": "&nu;", "ξ": "&xi;", "ο": "&omicron;", "π": "&pi;", "ρ": "&rho;", "ς": "&sigmaf;", "σ": "&sigma;", "τ": "&tau;", "υ": "&upsilon;", "φ": "&phi;", "χ": "&chi;", "ψ": "&psi;", "ω": "&omega;", "ϑ": "&thetasym;", "ϒ": "&upsih;", "ϖ": "&piv;", "•": "&bull;", "…": "&hellip;", "′": "&prime;", "″": "&Prime;", "‾": "&oline;", "⁄": "&frasl;", "℘": "&weierp;", "ℑ": "&image;", "ℜ": "&real;", "™": "&trade;", "ℵ": "&alefsym;", "←": "&larr;", "↑": "&uarr;", "→": "&rarr;", "↓": "&darr;", "↔": "&harr;", "↵": "&crarr;", "⇐": "&lArr;", "⇑": "&uArr;", "⇒": "&rArr;", "⇓": "&dArr;", "⇔": "&hArr;", "∀": "&forall;", "∂": "&part;", "∃": "&exist;", "∅": "&empty;", "∇": "&nabla;", "∈": "&isin;", "∉": "&notin;", "∋": "&ni;", "∏": "&prod;", "∑": "&sum;", "−": "&minus;", "∗": "&lowast;", "√": "&radic;", "∝": "&prop;", "∞": "&infin;", "∠": "&ang;", "∧": "&and;", "∨": "&or;", "∩": "&cap;", "∪": "&cup;", "∫": "&int;", "∴": "&there4;", "∼": "&sim;", "≅": "&cong;", "≈": "&asymp;", "≠": "&ne;", "≡": "&equiv;", "≤": "&le;", "≥": "&ge;", "⊂": "&sub;", "⊃": "&sup;", "⊄": "&nsub;", "⊆": "&sube;", "⊇": "&supe;", "⊕": "&oplus;", "⊗": "&otimes;", "⊥": "&perp;", "⋅": "&sdot;", "⌈": "&lceil;", "⌉": "&rceil;", "⌊": "&lfloor;", "⌋": "&rfloor;", "〈": "&lang;", "〉": "&rang;", "◊": "&loz;", "♠": "&spades;", "♣": "&clubs;", "♥": "&hearts;", "♦": "&diams;" } }, html5: { entities: { "&AElig": "Æ", "&AElig;": "Æ", "&AMP": "&", "&AMP;": "&", "&Aacute": "Á", "&Aacute;": "Á", "&Abreve;": "Ă", "&Acirc": "Â", "&Acirc;": "Â", "&Acy;": "А", "&Afr;": "𝔄", "&Agrave": "À", "&Agrave;": "À", "&Alpha;": "Α", "&Amacr;": "Ā", "&And;": "⩓", "&Aogon;": "Ą", "&Aopf;": "𝔸", "&ApplyFunction;": "⁡", "&Aring": "Å", "&Aring;": "Å", "&Ascr;": "𝒜", "&Assign;": "≔", "&Atilde": "Ã", "&Atilde;": "Ã", "&Auml": "Ä", "&Auml;": "Ä", "&Backslash;": "∖", "&Barv;": "⫧", "&Barwed;": "⌆", "&Bcy;": "Б", "&Because;": "∵", "&Bernoullis;": "ℬ", "&Beta;": "Β", "&Bfr;": "𝔅", "&Bopf;": "𝔹", "&Breve;": "˘", "&Bscr;": "ℬ", "&Bumpeq;": "≎", "&CHcy;": "Ч", "&COPY": "©", "&COPY;": "©", "&Cacute;": "Ć", "&Cap;": "⋒", "&CapitalDifferentialD;": "ⅅ", "&Cayleys;": "ℭ", "&Ccaron;": "Č", "&Ccedil": "Ç", "&Ccedil;": "Ç", "&Ccirc;": "Ĉ", "&Cconint;": "∰", "&Cdot;": "Ċ", "&Cedilla;": "¸", "&CenterDot;": "·", "&Cfr;": "ℭ", "&Chi;": "Χ", "&CircleDot;": "⊙", "&CircleMinus;": "⊖", "&CirclePlus;": "⊕", "&CircleTimes;": "⊗", "&ClockwiseContourIntegral;": "∲", "&CloseCurlyDoubleQuote;": "”", "&CloseCurlyQuote;": "’", "&Colon;": "∷", "&Colone;": "⩴", "&Congruent;": "≡", "&Conint;": "∯", "&ContourIntegral;": "∮", "&Copf;": "ℂ", "&Coproduct;": "∐", "&CounterClockwiseContourIntegral;": "∳", "&Cross;": "⨯", "&Cscr;": "𝒞", "&Cup;": "⋓", "&CupCap;": "≍", "&DD;": "ⅅ", "&DDotrahd;": "⤑", "&DJcy;": "Ђ", "&DScy;": "Ѕ", "&DZcy;": "Џ", "&Dagger;": "‡", "&Darr;": "↡", "&Dashv;": "⫤", "&Dcaron;": "Ď", "&Dcy;": "Д", "&Del;": "∇", "&Delta;": "Δ", "&Dfr;": "𝔇", "&DiacriticalAcute;": "´", "&DiacriticalDot;": "˙", "&DiacriticalDoubleAcute;": "˝", "&DiacriticalGrave;": "`", "&DiacriticalTilde;": "˜", "&Diamond;": "⋄", "&DifferentialD;": "ⅆ", "&Dopf;": "𝔻", "&Dot;": "¨", "&DotDot;": "⃜", "&DotEqual;": "≐", "&DoubleContourIntegral;": "∯", "&DoubleDot;": "¨", "&DoubleDownArrow;": "⇓", "&DoubleLeftArrow;": "⇐", "&DoubleLeftRightArrow;": "⇔", "&DoubleLeftTee;": "⫤", "&DoubleLongLeftArrow;": "⟸", "&DoubleLongLeftRightArrow;": "⟺", "&DoubleLongRightArrow;": "⟹", "&DoubleRightArrow;": "⇒", "&DoubleRightTee;": "⊨", "&DoubleUpArrow;": "⇑", "&DoubleUpDownArrow;": "⇕", "&DoubleVerticalBar;": "∥", "&DownArrow;": "↓", "&DownArrowBar;": "⤓", "&DownArrowUpArrow;": "⇵", "&DownBreve;": "̑", "&DownLeftRightVector;": "⥐", "&DownLeftTeeVector;": "⥞", "&DownLeftVector;": "↽", "&DownLeftVectorBar;": "⥖", "&DownRightTeeVector;": "⥟", "&DownRightVector;": "⇁", "&DownRightVectorBar;": "⥗", "&DownTee;": "⊤", "&DownTeeArrow;": "↧", "&Downarrow;": "⇓", "&Dscr;": "𝒟", "&Dstrok;": "Đ", "&ENG;": "Ŋ", "&ETH": "Ð", "&ETH;": "Ð", "&Eacute": "É", "&Eacute;": "É", "&Ecaron;": "Ě", "&Ecirc": "Ê", "&Ecirc;": "Ê", "&Ecy;": "Э", "&Edot;": "Ė", "&Efr;": "𝔈", "&Egrave": "È", "&Egrave;": "È", "&Element;": "∈", "&Emacr;": "Ē", "&EmptySmallSquare;": "◻", "&EmptyVerySmallSquare;": "▫", "&Eogon;": "Ę", "&Eopf;": "𝔼", "&Epsilon;": "Ε", "&Equal;": "⩵", "&EqualTilde;": "≂", "&Equilibrium;": "⇌", "&Escr;": "ℰ", "&Esim;": "⩳", "&Eta;": "Η", "&Euml": "Ë", "&Euml;": "Ë", "&Exists;": "∃", "&ExponentialE;": "ⅇ", "&Fcy;": "Ф", "&Ffr;": "𝔉", "&FilledSmallSquare;": "◼", "&FilledVerySmallSquare;": "▪", "&Fopf;": "𝔽", "&ForAll;": "∀", "&Fouriertrf;": "ℱ", "&Fscr;": "ℱ", "&GJcy;": "Ѓ", "&GT": ">", "&GT;": ">", "&Gamma;": "Γ", "&Gammad;": "Ϝ", "&Gbreve;": "Ğ", "&Gcedil;": "Ģ", "&Gcirc;": "Ĝ", "&Gcy;": "Г", "&Gdot;": "Ġ", "&Gfr;": "𝔊", "&Gg;": "⋙", "&Gopf;": "𝔾", "&GreaterEqual;": "≥", "&GreaterEqualLess;": "⋛", "&GreaterFullEqual;": "≧", "&GreaterGreater;": "⪢", "&GreaterLess;": "≷", "&GreaterSlantEqual;": "⩾", "&GreaterTilde;": "≳", "&Gscr;": "𝒢", "&Gt;": "≫", "&HARDcy;": "Ъ", "&Hacek;": "ˇ", "&Hat;": "^", "&Hcirc;": "Ĥ", "&Hfr;": "ℌ", "&HilbertSpace;": "ℋ", "&Hopf;": "ℍ", "&HorizontalLine;": "─", "&Hscr;": "ℋ", "&Hstrok;": "Ħ", "&HumpDownHump;": "≎", "&HumpEqual;": "≏", "&IEcy;": "Е", "&IJlig;": "Ĳ", "&IOcy;": "Ё", "&Iacute": "Í", "&Iacute;": "Í", "&Icirc": "Î", "&Icirc;": "Î", "&Icy;": "И", "&Idot;": "İ", "&Ifr;": "ℑ", "&Igrave": "Ì", "&Igrave;": "Ì", "&Im;": "ℑ", "&Imacr;": "Ī", "&ImaginaryI;": "ⅈ", "&Implies;": "⇒", "&Int;": "∬", "&Integral;": "∫", "&Intersection;": "⋂", "&InvisibleComma;": "⁣", "&InvisibleTimes;": "⁢", "&Iogon;": "Į", "&Iopf;": "𝕀", "&Iota;": "Ι", "&Iscr;": "ℐ", "&Itilde;": "Ĩ", "&Iukcy;": "І", "&Iuml": "Ï", "&Iuml;": "Ï", "&Jcirc;": "Ĵ", "&Jcy;": "Й", "&Jfr;": "𝔍", "&Jopf;": "𝕁", "&Jscr;": "𝒥", "&Jsercy;": "Ј", "&Jukcy;": "Є", "&KHcy;": "Х", "&KJcy;": "Ќ", "&Kappa;": "Κ", "&Kcedil;": "Ķ", "&Kcy;": "К", "&Kfr;": "𝔎", "&Kopf;": "𝕂", "&Kscr;": "𝒦", "&LJcy;": "Љ", "&LT": "<", "&LT;": "<", "&Lacute;": "Ĺ", "&Lambda;": "Λ", "&Lang;": "⟪", "&Laplacetrf;": "ℒ", "&Larr;": "↞", "&Lcaron;": "Ľ", "&Lcedil;": "Ļ", "&Lcy;": "Л", "&LeftAngleBracket;": "⟨", "&LeftArrow;": "←", "&LeftArrowBar;": "⇤", "&LeftArrowRightArrow;": "⇆", "&LeftCeiling;": "⌈", "&LeftDoubleBracket;": "⟦", "&LeftDownTeeVector;": "⥡", "&LeftDownVector;": "⇃", "&LeftDownVectorBar;": "⥙", "&LeftFloor;": "⌊", "&LeftRightArrow;": "↔", "&LeftRightVector;": "⥎", "&LeftTee;": "⊣", "&LeftTeeArrow;": "↤", "&LeftTeeVector;": "⥚", "&LeftTriangle;": "⊲", "&LeftTriangleBar;": "⧏", "&LeftTriangleEqual;": "⊴", "&LeftUpDownVector;": "⥑", "&LeftUpTeeVector;": "⥠", "&LeftUpVector;": "↿", "&LeftUpVectorBar;": "⥘", "&LeftVector;": "↼", "&LeftVectorBar;": "⥒", "&Leftarrow;": "⇐", "&Leftrightarrow;": "⇔", "&LessEqualGreater;": "⋚", "&LessFullEqual;": "≦", "&LessGreater;": "≶", "&LessLess;": "⪡", "&LessSlantEqual;": "⩽", "&LessTilde;": "≲", "&Lfr;": "𝔏", "&Ll;": "⋘", "&Lleftarrow;": "⇚", "&Lmidot;": "Ŀ", "&LongLeftArrow;": "⟵", "&LongLeftRightArrow;": "⟷", "&LongRightArrow;": "⟶", "&Longleftarrow;": "⟸", "&Longleftrightarrow;": "⟺", "&Longrightarrow;": "⟹", "&Lopf;": "𝕃", "&LowerLeftArrow;": "↙", "&LowerRightArrow;": "↘", "&Lscr;": "ℒ", "&Lsh;": "↰", "&Lstrok;": "Ł", "&Lt;": "≪", "&Map;": "⤅", "&Mcy;": "М", "&MediumSpace;": " ", "&Mellintrf;": "ℳ", "&Mfr;": "𝔐", "&MinusPlus;": "∓", "&Mopf;": "𝕄", "&Mscr;": "ℳ", "&Mu;": "Μ", "&NJcy;": "Њ", "&Nacute;": "Ń", "&Ncaron;": "Ň", "&Ncedil;": "Ņ", "&Ncy;": "Н", "&NegativeMediumSpace;": "​", "&NegativeThickSpace;": "​", "&NegativeThinSpace;": "​", "&NegativeVeryThinSpace;": "​", "&NestedGreaterGreater;": "≫", "&NestedLessLess;": "≪", "&NewLine;": "\n", "&Nfr;": "𝔑", "&NoBreak;": "⁠", "&NonBreakingSpace;": " ", "&Nopf;": "ℕ", "&Not;": "⫬", "&NotCongruent;": "≢", "&NotCupCap;": "≭", "&NotDoubleVerticalBar;": "∦", "&NotElement;": "∉", "&NotEqual;": "≠", "&NotEqualTilde;": "≂̸", "&NotExists;": "∄", "&NotGreater;": "≯", "&NotGreaterEqual;": "≱", "&NotGreaterFullEqual;": "≧̸", "&NotGreaterGreater;": "≫̸", "&NotGreaterLess;": "≹", "&NotGreaterSlantEqual;": "⩾̸", "&NotGreaterTilde;": "≵", "&NotHumpDownHump;": "≎̸", "&NotHumpEqual;": "≏̸", "&NotLeftTriangle;": "⋪", "&NotLeftTriangleBar;": "⧏̸", "&NotLeftTriangleEqual;": "⋬", "&NotLess;": "≮", "&NotLessEqual;": "≰", "&NotLessGreater;": "≸", "&NotLessLess;": "≪̸", "&NotLessSlantEqual;": "⩽̸", "&NotLessTilde;": "≴", "&NotNestedGreaterGreater;": "⪢̸", "&NotNestedLessLess;": "⪡̸", "&NotPrecedes;": "⊀", "&NotPrecedesEqual;": "⪯̸", "&NotPrecedesSlantEqual;": "⋠", "&NotReverseElement;": "∌", "&NotRightTriangle;": "⋫", "&NotRightTriangleBar;": "⧐̸", "&NotRightTriangleEqual;": "⋭", "&NotSquareSubset;": "⊏̸", "&NotSquareSubsetEqual;": "⋢", "&NotSquareSuperset;": "⊐̸", "&NotSquareSupersetEqual;": "⋣", "&NotSubset;": "⊂⃒", "&NotSubsetEqual;": "⊈", "&NotSucceeds;": "⊁", "&NotSucceedsEqual;": "⪰̸", "&NotSucceedsSlantEqual;": "⋡", "&NotSucceedsTilde;": "≿̸", "&NotSuperset;": "⊃⃒", "&NotSupersetEqual;": "⊉", "&NotTilde;": "≁", "&NotTildeEqual;": "≄", "&NotTildeFullEqual;": "≇", "&NotTildeTilde;": "≉", "&NotVerticalBar;": "∤", "&Nscr;": "𝒩", "&Ntilde": "Ñ", "&Ntilde;": "Ñ", "&Nu;": "Ν", "&OElig;": "Œ", "&Oacute": "Ó", "&Oacute;": "Ó", "&Ocirc": "Ô", "&Ocirc;": "Ô", "&Ocy;": "О", "&Odblac;": "Ő", "&Ofr;": "𝔒", "&Ograve": "Ò", "&Ograve;": "Ò", "&Omacr;": "Ō", "&Omega;": "Ω", "&Omicron;": "Ο", "&Oopf;": "𝕆", "&OpenCurlyDoubleQuote;": "“", "&OpenCurlyQuote;": "‘", "&Or;": "⩔", "&Oscr;": "𝒪", "&Oslash": "Ø", "&Oslash;": "Ø", "&Otilde": "Õ", "&Otilde;": "Õ", "&Otimes;": "⨷", "&Ouml": "Ö", "&Ouml;": "Ö", "&OverBar;": "‾", "&OverBrace;": "⏞", "&OverBracket;": "⎴", "&OverParenthesis;": "⏜", "&PartialD;": "∂", "&Pcy;": "П", "&Pfr;": "𝔓", "&Phi;": "Φ", "&Pi;": "Π", "&PlusMinus;": "±", "&Poincareplane;": "ℌ", "&Popf;": "ℙ", "&Pr;": "⪻", "&Precedes;": "≺", "&PrecedesEqual;": "⪯", "&PrecedesSlantEqual;": "≼", "&PrecedesTilde;": "≾", "&Prime;": "″", "&Product;": "∏", "&Proportion;": "∷", "&Proportional;": "∝", "&Pscr;": "𝒫", "&Psi;": "Ψ", "&QUOT": '"', "&QUOT;": '"', "&Qfr;": "𝔔", "&Qopf;": "ℚ", "&Qscr;": "𝒬", "&RBarr;": "⤐", "&REG": "®", "&REG;": "®", "&Racute;": "Ŕ", "&Rang;": "⟫", "&Rarr;": "↠", "&Rarrtl;": "⤖", "&Rcaron;": "Ř", "&Rcedil;": "Ŗ", "&Rcy;": "Р", "&Re;": "ℜ", "&ReverseElement;": "∋", "&ReverseEquilibrium;": "⇋", "&ReverseUpEquilibrium;": "⥯", "&Rfr;": "ℜ", "&Rho;": "Ρ", "&RightAngleBracket;": "⟩", "&RightArrow;": "→", "&RightArrowBar;": "⇥", "&RightArrowLeftArrow;": "⇄", "&RightCeiling;": "⌉", "&RightDoubleBracket;": "⟧", "&RightDownTeeVector;": "⥝", "&RightDownVector;": "⇂", "&RightDownVectorBar;": "⥕", "&RightFloor;": "⌋", "&RightTee;": "⊢", "&RightTeeArrow;": "↦", "&RightTeeVector;": "⥛", "&RightTriangle;": "⊳", "&RightTriangleBar;": "⧐", "&RightTriangleEqual;": "⊵", "&RightUpDownVector;": "⥏", "&RightUpTeeVector;": "⥜", "&RightUpVector;": "↾", "&RightUpVectorBar;": "⥔", "&RightVector;": "⇀", "&RightVectorBar;": "⥓", "&Rightarrow;": "⇒", "&Ropf;": "ℝ", "&RoundImplies;": "⥰", "&Rrightarrow;": "⇛", "&Rscr;": "ℛ", "&Rsh;": "↱", "&RuleDelayed;": "⧴", "&SHCHcy;": "Щ", "&SHcy;": "Ш", "&SOFTcy;": "Ь", "&Sacute;": "Ś", "&Sc;": "⪼", "&Scaron;": "Š", "&Scedil;": "Ş", "&Scirc;": "Ŝ", "&Scy;": "С", "&Sfr;": "𝔖", "&ShortDownArrow;": "↓", "&ShortLeftArrow;": "←", "&ShortRightArrow;": "→", "&ShortUpArrow;": "↑", "&Sigma;": "Σ", "&SmallCircle;": "∘", "&Sopf;": "𝕊", "&Sqrt;": "√", "&Square;": "□", "&SquareIntersection;": "⊓", "&SquareSubset;": "⊏", "&SquareSubsetEqual;": "⊑", "&SquareSuperset;": "⊐", "&SquareSupersetEqual;": "⊒", "&SquareUnion;": "⊔", "&Sscr;": "𝒮", "&Star;": "⋆", "&Sub;": "⋐", "&Subset;": "⋐", "&SubsetEqual;": "⊆", "&Succeeds;": "≻", "&SucceedsEqual;": "⪰", "&SucceedsSlantEqual;": "≽", "&SucceedsTilde;": "≿", "&SuchThat;": "∋", "&Sum;": "∑", "&Sup;": "⋑", "&Superset;": "⊃", "&SupersetEqual;": "⊇", "&Supset;": "⋑", "&THORN": "Þ", "&THORN;": "Þ", "&TRADE;": "™", "&TSHcy;": "Ћ", "&TScy;": "Ц", "&Tab;": "	", "&Tau;": "Τ", "&Tcaron;": "Ť", "&Tcedil;": "Ţ", "&Tcy;": "Т", "&Tfr;": "𝔗", "&Therefore;": "∴", "&Theta;": "Θ", "&ThickSpace;": "  ", "&ThinSpace;": " ", "&Tilde;": "∼", "&TildeEqual;": "≃", "&TildeFullEqual;": "≅", "&TildeTilde;": "≈", "&Topf;": "𝕋", "&TripleDot;": "⃛", "&Tscr;": "𝒯", "&Tstrok;": "Ŧ", "&Uacute": "Ú", "&Uacute;": "Ú", "&Uarr;": "↟", "&Uarrocir;": "⥉", "&Ubrcy;": "Ў", "&Ubreve;": "Ŭ", "&Ucirc": "Û", "&Ucirc;": "Û", "&Ucy;": "У", "&Udblac;": "Ű", "&Ufr;": "𝔘", "&Ugrave": "Ù", "&Ugrave;": "Ù", "&Umacr;": "Ū", "&UnderBar;": "_", "&UnderBrace;": "⏟", "&UnderBracket;": "⎵", "&UnderParenthesis;": "⏝", "&Union;": "⋃", "&UnionPlus;": "⊎", "&Uogon;": "Ų", "&Uopf;": "𝕌", "&UpArrow;": "↑", "&UpArrowBar;": "⤒", "&UpArrowDownArrow;": "⇅", "&UpDownArrow;": "↕", "&UpEquilibrium;": "⥮", "&UpTee;": "⊥", "&UpTeeArrow;": "↥", "&Uparrow;": "⇑", "&Updownarrow;": "⇕", "&UpperLeftArrow;": "↖", "&UpperRightArrow;": "↗", "&Upsi;": "ϒ", "&Upsilon;": "Υ", "&Uring;": "Ů", "&Uscr;": "𝒰", "&Utilde;": "Ũ", "&Uuml": "Ü", "&Uuml;": "Ü", "&VDash;": "⊫", "&Vbar;": "⫫", "&Vcy;": "В", "&Vdash;": "⊩", "&Vdashl;": "⫦", "&Vee;": "⋁", "&Verbar;": "‖", "&Vert;": "‖", "&VerticalBar;": "∣", "&VerticalLine;": "|", "&VerticalSeparator;": "❘", "&VerticalTilde;": "≀", "&VeryThinSpace;": " ", "&Vfr;": "𝔙", "&Vopf;": "𝕍", "&Vscr;": "𝒱", "&Vvdash;": "⊪", "&Wcirc;": "Ŵ", "&Wedge;": "⋀", "&Wfr;": "𝔚", "&Wopf;": "𝕎", "&Wscr;": "𝒲", "&Xfr;": "𝔛", "&Xi;": "Ξ", "&Xopf;": "𝕏", "&Xscr;": "𝒳", "&YAcy;": "Я", "&YIcy;": "Ї", "&YUcy;": "Ю", "&Yacute": "Ý", "&Yacute;": "Ý", "&Ycirc;": "Ŷ", "&Ycy;": "Ы", "&Yfr;": "𝔜", "&Yopf;": "𝕐", "&Yscr;": "𝒴", "&Yuml;": "Ÿ", "&ZHcy;": "Ж", "&Zacute;": "Ź", "&Zcaron;": "Ž", "&Zcy;": "З", "&Zdot;": "Ż", "&ZeroWidthSpace;": "​", "&Zeta;": "Ζ", "&Zfr;": "ℨ", "&Zopf;": "ℤ", "&Zscr;": "𝒵", "&aacute": "á", "&aacute;": "á", "&abreve;": "ă", "&ac;": "∾", "&acE;": "∾̳", "&acd;": "∿", "&acirc": "â", "&acirc;": "â", "&acute": "´", "&acute;": "´", "&acy;": "а", "&aelig": "æ", "&aelig;": "æ", "&af;": "⁡", "&afr;": "𝔞", "&agrave": "à", "&agrave;": "à", "&alefsym;": "ℵ", "&aleph;": "ℵ", "&alpha;": "α", "&amacr;": "ā", "&amalg;": "⨿", "&amp": "&", "&amp;": "&", "&and;": "∧", "&andand;": "⩕", "&andd;": "⩜", "&andslope;": "⩘", "&andv;": "⩚", "&ang;": "∠", "&ange;": "⦤", "&angle;": "∠", "&angmsd;": "∡", "&angmsdaa;": "⦨", "&angmsdab;": "⦩", "&angmsdac;": "⦪", "&angmsdad;": "⦫", "&angmsdae;": "⦬", "&angmsdaf;": "⦭", "&angmsdag;": "⦮", "&angmsdah;": "⦯", "&angrt;": "∟", "&angrtvb;": "⊾", "&angrtvbd;": "⦝", "&angsph;": "∢", "&angst;": "Å", "&angzarr;": "⍼", "&aogon;": "ą", "&aopf;": "𝕒", "&ap;": "≈", "&apE;": "⩰", "&apacir;": "⩯", "&ape;": "≊", "&apid;": "≋", "&apos;": "'", "&approx;": "≈", "&approxeq;": "≊", "&aring": "å", "&aring;": "å", "&ascr;": "𝒶", "&ast;": "*", "&asymp;": "≈", "&asympeq;": "≍", "&atilde": "ã", "&atilde;": "ã", "&auml": "ä", "&auml;": "ä", "&awconint;": "∳", "&awint;": "⨑", "&bNot;": "⫭", "&backcong;": "≌", "&backepsilon;": "϶", "&backprime;": "‵", "&backsim;": "∽", "&backsimeq;": "⋍", "&barvee;": "⊽", "&barwed;": "⌅", "&barwedge;": "⌅", "&bbrk;": "⎵", "&bbrktbrk;": "⎶", "&bcong;": "≌", "&bcy;": "б", "&bdquo;": "„", "&becaus;": "∵", "&because;": "∵", "&bemptyv;": "⦰", "&bepsi;": "϶", "&bernou;": "ℬ", "&beta;": "β", "&beth;": "ℶ", "&between;": "≬", "&bfr;": "𝔟", "&bigcap;": "⋂", "&bigcirc;": "◯", "&bigcup;": "⋃", "&bigodot;": "⨀", "&bigoplus;": "⨁", "&bigotimes;": "⨂", "&bigsqcup;": "⨆", "&bigstar;": "★", "&bigtriangledown;": "▽", "&bigtriangleup;": "△", "&biguplus;": "⨄", "&bigvee;": "⋁", "&bigwedge;": "⋀", "&bkarow;": "⤍", "&blacklozenge;": "⧫", "&blacksquare;": "▪", "&blacktriangle;": "▴", "&blacktriangledown;": "▾", "&blacktriangleleft;": "◂", "&blacktriangleright;": "▸", "&blank;": "␣", "&blk12;": "▒", "&blk14;": "░", "&blk34;": "▓", "&block;": "█", "&bne;": "=⃥", "&bnequiv;": "≡⃥", "&bnot;": "⌐", "&bopf;": "𝕓", "&bot;": "⊥", "&bottom;": "⊥", "&bowtie;": "⋈", "&boxDL;": "╗", "&boxDR;": "╔", "&boxDl;": "╖", "&boxDr;": "╓", "&boxH;": "═", "&boxHD;": "╦", "&boxHU;": "╩", "&boxHd;": "╤", "&boxHu;": "╧", "&boxUL;": "╝", "&boxUR;": "╚", "&boxUl;": "╜", "&boxUr;": "╙", "&boxV;": "║", "&boxVH;": "╬", "&boxVL;": "╣", "&boxVR;": "╠", "&boxVh;": "╫", "&boxVl;": "╢", "&boxVr;": "╟", "&boxbox;": "⧉", "&boxdL;": "╕", "&boxdR;": "╒", "&boxdl;": "┐", "&boxdr;": "┌", "&boxh;": "─", "&boxhD;": "╥", "&boxhU;": "╨", "&boxhd;": "┬", "&boxhu;": "┴", "&boxminus;": "⊟", "&boxplus;": "⊞", "&boxtimes;": "⊠", "&boxuL;": "╛", "&boxuR;": "╘", "&boxul;": "┘", "&boxur;": "└", "&boxv;": "│", "&boxvH;": "╪", "&boxvL;": "╡", "&boxvR;": "╞", "&boxvh;": "┼", "&boxvl;": "┤", "&boxvr;": "├", "&bprime;": "‵", "&breve;": "˘", "&brvbar": "¦", "&brvbar;": "¦", "&bscr;": "𝒷", "&bsemi;": "⁏", "&bsim;": "∽", "&bsime;": "⋍", "&bsol;": "\\", "&bsolb;": "⧅", "&bsolhsub;": "⟈", "&bull;": "•", "&bullet;": "•", "&bump;": "≎", "&bumpE;": "⪮", "&bumpe;": "≏", "&bumpeq;": "≏", "&cacute;": "ć", "&cap;": "∩", "&capand;": "⩄", "&capbrcup;": "⩉", "&capcap;": "⩋", "&capcup;": "⩇", "&capdot;": "⩀", "&caps;": "∩︀", "&caret;": "⁁", "&caron;": "ˇ", "&ccaps;": "⩍", "&ccaron;": "č", "&ccedil": "ç", "&ccedil;": "ç", "&ccirc;": "ĉ", "&ccups;": "⩌", "&ccupssm;": "⩐", "&cdot;": "ċ", "&cedil": "¸", "&cedil;": "¸", "&cemptyv;": "⦲", "&cent": "¢", "&cent;": "¢", "&centerdot;": "·", "&cfr;": "𝔠", "&chcy;": "ч", "&check;": "✓", "&checkmark;": "✓", "&chi;": "χ", "&cir;": "○", "&cirE;": "⧃", "&circ;": "ˆ", "&circeq;": "≗", "&circlearrowleft;": "↺", "&circlearrowright;": "↻", "&circledR;": "®", "&circledS;": "Ⓢ", "&circledast;": "⊛", "&circledcirc;": "⊚", "&circleddash;": "⊝", "&cire;": "≗", "&cirfnint;": "⨐", "&cirmid;": "⫯", "&cirscir;": "⧂", "&clubs;": "♣", "&clubsuit;": "♣", "&colon;": ":", "&colone;": "≔", "&coloneq;": "≔", "&comma;": ",", "&commat;": "@", "&comp;": "∁", "&compfn;": "∘", "&complement;": "∁", "&complexes;": "ℂ", "&cong;": "≅", "&congdot;": "⩭", "&conint;": "∮", "&copf;": "𝕔", "&coprod;": "∐", "&copy": "©", "&copy;": "©", "&copysr;": "℗", "&crarr;": "↵", "&cross;": "✗", "&cscr;": "𝒸", "&csub;": "⫏", "&csube;": "⫑", "&csup;": "⫐", "&csupe;": "⫒", "&ctdot;": "⋯", "&cudarrl;": "⤸", "&cudarrr;": "⤵", "&cuepr;": "⋞", "&cuesc;": "⋟", "&cularr;": "↶", "&cularrp;": "⤽", "&cup;": "∪", "&cupbrcap;": "⩈", "&cupcap;": "⩆", "&cupcup;": "⩊", "&cupdot;": "⊍", "&cupor;": "⩅", "&cups;": "∪︀", "&curarr;": "↷", "&curarrm;": "⤼", "&curlyeqprec;": "⋞", "&curlyeqsucc;": "⋟", "&curlyvee;": "⋎", "&curlywedge;": "⋏", "&curren": "¤", "&curren;": "¤", "&curvearrowleft;": "↶", "&curvearrowright;": "↷", "&cuvee;": "⋎", "&cuwed;": "⋏", "&cwconint;": "∲", "&cwint;": "∱", "&cylcty;": "⌭", "&dArr;": "⇓", "&dHar;": "⥥", "&dagger;": "†", "&daleth;": "ℸ", "&darr;": "↓", "&dash;": "‐", "&dashv;": "⊣", "&dbkarow;": "⤏", "&dblac;": "˝", "&dcaron;": "ď", "&dcy;": "д", "&dd;": "ⅆ", "&ddagger;": "‡", "&ddarr;": "⇊", "&ddotseq;": "⩷", "&deg": "°", "&deg;": "°", "&delta;": "δ", "&demptyv;": "⦱", "&dfisht;": "⥿", "&dfr;": "𝔡", "&dharl;": "⇃", "&dharr;": "⇂", "&diam;": "⋄", "&diamond;": "⋄", "&diamondsuit;": "♦", "&diams;": "♦", "&die;": "¨", "&digamma;": "ϝ", "&disin;": "⋲", "&div;": "÷", "&divide": "÷", "&divide;": "÷", "&divideontimes;": "⋇", "&divonx;": "⋇", "&djcy;": "ђ", "&dlcorn;": "⌞", "&dlcrop;": "⌍", "&dollar;": "$", "&dopf;": "𝕕", "&dot;": "˙", "&doteq;": "≐", "&doteqdot;": "≑", "&dotminus;": "∸", "&dotplus;": "∔", "&dotsquare;": "⊡", "&doublebarwedge;": "⌆", "&downarrow;": "↓", "&downdownarrows;": "⇊", "&downharpoonleft;": "⇃", "&downharpoonright;": "⇂", "&drbkarow;": "⤐", "&drcorn;": "⌟", "&drcrop;": "⌌", "&dscr;": "𝒹", "&dscy;": "ѕ", "&dsol;": "⧶", "&dstrok;": "đ", "&dtdot;": "⋱", "&dtri;": "▿", "&dtrif;": "▾", "&duarr;": "⇵", "&duhar;": "⥯", "&dwangle;": "⦦", "&dzcy;": "џ", "&dzigrarr;": "⟿", "&eDDot;": "⩷", "&eDot;": "≑", "&eacute": "é", "&eacute;": "é", "&easter;": "⩮", "&ecaron;": "ě", "&ecir;": "≖", "&ecirc": "ê", "&ecirc;": "ê", "&ecolon;": "≕", "&ecy;": "э", "&edot;": "ė", "&ee;": "ⅇ", "&efDot;": "≒", "&efr;": "𝔢", "&eg;": "⪚", "&egrave": "è", "&egrave;": "è", "&egs;": "⪖", "&egsdot;": "⪘", "&el;": "⪙", "&elinters;": "⏧", "&ell;": "ℓ", "&els;": "⪕", "&elsdot;": "⪗", "&emacr;": "ē", "&empty;": "∅", "&emptyset;": "∅", "&emptyv;": "∅", "&emsp13;": " ", "&emsp14;": " ", "&emsp;": " ", "&eng;": "ŋ", "&ensp;": " ", "&eogon;": "ę", "&eopf;": "𝕖", "&epar;": "⋕", "&eparsl;": "⧣", "&eplus;": "⩱", "&epsi;": "ε", "&epsilon;": "ε", "&epsiv;": "ϵ", "&eqcirc;": "≖", "&eqcolon;": "≕", "&eqsim;": "≂", "&eqslantgtr;": "⪖", "&eqslantless;": "⪕", "&equals;": "=", "&equest;": "≟", "&equiv;": "≡", "&equivDD;": "⩸", "&eqvparsl;": "⧥", "&erDot;": "≓", "&erarr;": "⥱", "&escr;": "ℯ", "&esdot;": "≐", "&esim;": "≂", "&eta;": "η", "&eth": "ð", "&eth;": "ð", "&euml": "ë", "&euml;": "ë", "&euro;": "€", "&excl;": "!", "&exist;": "∃", "&expectation;": "ℰ", "&exponentiale;": "ⅇ", "&fallingdotseq;": "≒", "&fcy;": "ф", "&female;": "♀", "&ffilig;": "ﬃ", "&fflig;": "ﬀ", "&ffllig;": "ﬄ", "&ffr;": "𝔣", "&filig;": "ﬁ", "&fjlig;": "fj", "&flat;": "♭", "&fllig;": "ﬂ", "&fltns;": "▱", "&fnof;": "ƒ", "&fopf;": "𝕗", "&forall;": "∀", "&fork;": "⋔", "&forkv;": "⫙", "&fpartint;": "⨍", "&frac12": "½", "&frac12;": "½", "&frac13;": "⅓", "&frac14": "¼", "&frac14;": "¼", "&frac15;": "⅕", "&frac16;": "⅙", "&frac18;": "⅛", "&frac23;": "⅔", "&frac25;": "⅖", "&frac34": "¾", "&frac34;": "¾", "&frac35;": "⅗", "&frac38;": "⅜", "&frac45;": "⅘", "&frac56;": "⅚", "&frac58;": "⅝", "&frac78;": "⅞", "&frasl;": "⁄", "&frown;": "⌢", "&fscr;": "𝒻", "&gE;": "≧", "&gEl;": "⪌", "&gacute;": "ǵ", "&gamma;": "γ", "&gammad;": "ϝ", "&gap;": "⪆", "&gbreve;": "ğ", "&gcirc;": "ĝ", "&gcy;": "г", "&gdot;": "ġ", "&ge;": "≥", "&gel;": "⋛", "&geq;": "≥", "&geqq;": "≧", "&geqslant;": "⩾", "&ges;": "⩾", "&gescc;": "⪩", "&gesdot;": "⪀", "&gesdoto;": "⪂", "&gesdotol;": "⪄", "&gesl;": "⋛︀", "&gesles;": "⪔", "&gfr;": "𝔤", "&gg;": "≫", "&ggg;": "⋙", "&gimel;": "ℷ", "&gjcy;": "ѓ", "&gl;": "≷", "&glE;": "⪒", "&gla;": "⪥", "&glj;": "⪤", "&gnE;": "≩", "&gnap;": "⪊", "&gnapprox;": "⪊", "&gne;": "⪈", "&gneq;": "⪈", "&gneqq;": "≩", "&gnsim;": "⋧", "&gopf;": "𝕘", "&grave;": "`", "&gscr;": "ℊ", "&gsim;": "≳", "&gsime;": "⪎", "&gsiml;": "⪐", "&gt": ">", "&gt;": ">", "&gtcc;": "⪧", "&gtcir;": "⩺", "&gtdot;": "⋗", "&gtlPar;": "⦕", "&gtquest;": "⩼", "&gtrapprox;": "⪆", "&gtrarr;": "⥸", "&gtrdot;": "⋗", "&gtreqless;": "⋛", "&gtreqqless;": "⪌", "&gtrless;": "≷", "&gtrsim;": "≳", "&gvertneqq;": "≩︀", "&gvnE;": "≩︀", "&hArr;": "⇔", "&hairsp;": " ", "&half;": "½", "&hamilt;": "ℋ", "&hardcy;": "ъ", "&harr;": "↔", "&harrcir;": "⥈", "&harrw;": "↭", "&hbar;": "ℏ", "&hcirc;": "ĥ", "&hearts;": "♥", "&heartsuit;": "♥", "&hellip;": "…", "&hercon;": "⊹", "&hfr;": "𝔥", "&hksearow;": "⤥", "&hkswarow;": "⤦", "&hoarr;": "⇿", "&homtht;": "∻", "&hookleftarrow;": "↩", "&hookrightarrow;": "↪", "&hopf;": "𝕙", "&horbar;": "―", "&hscr;": "𝒽", "&hslash;": "ℏ", "&hstrok;": "ħ", "&hybull;": "⁃", "&hyphen;": "‐", "&iacute": "í", "&iacute;": "í", "&ic;": "⁣", "&icirc": "î", "&icirc;": "î", "&icy;": "и", "&iecy;": "е", "&iexcl": "¡", "&iexcl;": "¡", "&iff;": "⇔", "&ifr;": "𝔦", "&igrave": "ì", "&igrave;": "ì", "&ii;": "ⅈ", "&iiiint;": "⨌", "&iiint;": "∭", "&iinfin;": "⧜", "&iiota;": "℩", "&ijlig;": "ĳ", "&imacr;": "ī", "&image;": "ℑ", "&imagline;": "ℐ", "&imagpart;": "ℑ", "&imath;": "ı", "&imof;": "⊷", "&imped;": "Ƶ", "&in;": "∈", "&incare;": "℅", "&infin;": "∞", "&infintie;": "⧝", "&inodot;": "ı", "&int;": "∫", "&intcal;": "⊺", "&integers;": "ℤ", "&intercal;": "⊺", "&intlarhk;": "⨗", "&intprod;": "⨼", "&iocy;": "ё", "&iogon;": "į", "&iopf;": "𝕚", "&iota;": "ι", "&iprod;": "⨼", "&iquest": "¿", "&iquest;": "¿", "&iscr;": "𝒾", "&isin;": "∈", "&isinE;": "⋹", "&isindot;": "⋵", "&isins;": "⋴", "&isinsv;": "⋳", "&isinv;": "∈", "&it;": "⁢", "&itilde;": "ĩ", "&iukcy;": "і", "&iuml": "ï", "&iuml;": "ï", "&jcirc;": "ĵ", "&jcy;": "й", "&jfr;": "𝔧", "&jmath;": "ȷ", "&jopf;": "𝕛", "&jscr;": "𝒿", "&jsercy;": "ј", "&jukcy;": "є", "&kappa;": "κ", "&kappav;": "ϰ", "&kcedil;": "ķ", "&kcy;": "к", "&kfr;": "𝔨", "&kgreen;": "ĸ", "&khcy;": "х", "&kjcy;": "ќ", "&kopf;": "𝕜", "&kscr;": "𝓀", "&lAarr;": "⇚", "&lArr;": "⇐", "&lAtail;": "⤛", "&lBarr;": "⤎", "&lE;": "≦", "&lEg;": "⪋", "&lHar;": "⥢", "&lacute;": "ĺ", "&laemptyv;": "⦴", "&lagran;": "ℒ", "&lambda;": "λ", "&lang;": "⟨", "&langd;": "⦑", "&langle;": "⟨", "&lap;": "⪅", "&laquo": "«", "&laquo;": "«", "&larr;": "←", "&larrb;": "⇤", "&larrbfs;": "⤟", "&larrfs;": "⤝", "&larrhk;": "↩", "&larrlp;": "↫", "&larrpl;": "⤹", "&larrsim;": "⥳", "&larrtl;": "↢", "&lat;": "⪫", "&latail;": "⤙", "&late;": "⪭", "&lates;": "⪭︀", "&lbarr;": "⤌", "&lbbrk;": "❲", "&lbrace;": "{", "&lbrack;": "[", "&lbrke;": "⦋", "&lbrksld;": "⦏", "&lbrkslu;": "⦍", "&lcaron;": "ľ", "&lcedil;": "ļ", "&lceil;": "⌈", "&lcub;": "{", "&lcy;": "л", "&ldca;": "⤶", "&ldquo;": "“", "&ldquor;": "„", "&ldrdhar;": "⥧", "&ldrushar;": "⥋", "&ldsh;": "↲", "&le;": "≤", "&leftarrow;": "←", "&leftarrowtail;": "↢", "&leftharpoondown;": "↽", "&leftharpoonup;": "↼", "&leftleftarrows;": "⇇", "&leftrightarrow;": "↔", "&leftrightarrows;": "⇆", "&leftrightharpoons;": "⇋", "&leftrightsquigarrow;": "↭", "&leftthreetimes;": "⋋", "&leg;": "⋚", "&leq;": "≤", "&leqq;": "≦", "&leqslant;": "⩽", "&les;": "⩽", "&lescc;": "⪨", "&lesdot;": "⩿", "&lesdoto;": "⪁", "&lesdotor;": "⪃", "&lesg;": "⋚︀", "&lesges;": "⪓", "&lessapprox;": "⪅", "&lessdot;": "⋖", "&lesseqgtr;": "⋚", "&lesseqqgtr;": "⪋", "&lessgtr;": "≶", "&lesssim;": "≲", "&lfisht;": "⥼", "&lfloor;": "⌊", "&lfr;": "𝔩", "&lg;": "≶", "&lgE;": "⪑", "&lhard;": "↽", "&lharu;": "↼", "&lharul;": "⥪", "&lhblk;": "▄", "&ljcy;": "љ", "&ll;": "≪", "&llarr;": "⇇", "&llcorner;": "⌞", "&llhard;": "⥫", "&lltri;": "◺", "&lmidot;": "ŀ", "&lmoust;": "⎰", "&lmoustache;": "⎰", "&lnE;": "≨", "&lnap;": "⪉", "&lnapprox;": "⪉", "&lne;": "⪇", "&lneq;": "⪇", "&lneqq;": "≨", "&lnsim;": "⋦", "&loang;": "⟬", "&loarr;": "⇽", "&lobrk;": "⟦", "&longleftarrow;": "⟵", "&longleftrightarrow;": "⟷", "&longmapsto;": "⟼", "&longrightarrow;": "⟶", "&looparrowleft;": "↫", "&looparrowright;": "↬", "&lopar;": "⦅", "&lopf;": "𝕝", "&loplus;": "⨭", "&lotimes;": "⨴", "&lowast;": "∗", "&lowbar;": "_", "&loz;": "◊", "&lozenge;": "◊", "&lozf;": "⧫", "&lpar;": "(", "&lparlt;": "⦓", "&lrarr;": "⇆", "&lrcorner;": "⌟", "&lrhar;": "⇋", "&lrhard;": "⥭", "&lrm;": "‎", "&lrtri;": "⊿", "&lsaquo;": "‹", "&lscr;": "𝓁", "&lsh;": "↰", "&lsim;": "≲", "&lsime;": "⪍", "&lsimg;": "⪏", "&lsqb;": "[", "&lsquo;": "‘", "&lsquor;": "‚", "&lstrok;": "ł", "&lt": "<", "&lt;": "<", "&ltcc;": "⪦", "&ltcir;": "⩹", "&ltdot;": "⋖", "&lthree;": "⋋", "&ltimes;": "⋉", "&ltlarr;": "⥶", "&ltquest;": "⩻", "&ltrPar;": "⦖", "&ltri;": "◃", "&ltrie;": "⊴", "&ltrif;": "◂", "&lurdshar;": "⥊", "&luruhar;": "⥦", "&lvertneqq;": "≨︀", "&lvnE;": "≨︀", "&mDDot;": "∺", "&macr": "¯", "&macr;": "¯", "&male;": "♂", "&malt;": "✠", "&maltese;": "✠", "&map;": "↦", "&mapsto;": "↦", "&mapstodown;": "↧", "&mapstoleft;": "↤", "&mapstoup;": "↥", "&marker;": "▮", "&mcomma;": "⨩", "&mcy;": "м", "&mdash;": "—", "&measuredangle;": "∡", "&mfr;": "𝔪", "&mho;": "℧", "&micro": "µ", "&micro;": "µ", "&mid;": "∣", "&midast;": "*", "&midcir;": "⫰", "&middot": "·", "&middot;": "·", "&minus;": "−", "&minusb;": "⊟", "&minusd;": "∸", "&minusdu;": "⨪", "&mlcp;": "⫛", "&mldr;": "…", "&mnplus;": "∓", "&models;": "⊧", "&mopf;": "𝕞", "&mp;": "∓", "&mscr;": "𝓂", "&mstpos;": "∾", "&mu;": "μ", "&multimap;": "⊸", "&mumap;": "⊸", "&nGg;": "⋙̸", "&nGt;": "≫⃒", "&nGtv;": "≫̸", "&nLeftarrow;": "⇍", "&nLeftrightarrow;": "⇎", "&nLl;": "⋘̸", "&nLt;": "≪⃒", "&nLtv;": "≪̸", "&nRightarrow;": "⇏", "&nVDash;": "⊯", "&nVdash;": "⊮", "&nabla;": "∇", "&nacute;": "ń", "&nang;": "∠⃒", "&nap;": "≉", "&napE;": "⩰̸", "&napid;": "≋̸", "&napos;": "ŉ", "&napprox;": "≉", "&natur;": "♮", "&natural;": "♮", "&naturals;": "ℕ", "&nbsp": " ", "&nbsp;": " ", "&nbump;": "≎̸", "&nbumpe;": "≏̸", "&ncap;": "⩃", "&ncaron;": "ň", "&ncedil;": "ņ", "&ncong;": "≇", "&ncongdot;": "⩭̸", "&ncup;": "⩂", "&ncy;": "н", "&ndash;": "–", "&ne;": "≠", "&neArr;": "⇗", "&nearhk;": "⤤", "&nearr;": "↗", "&nearrow;": "↗", "&nedot;": "≐̸", "&nequiv;": "≢", "&nesear;": "⤨", "&nesim;": "≂̸", "&nexist;": "∄", "&nexists;": "∄", "&nfr;": "𝔫", "&ngE;": "≧̸", "&nge;": "≱", "&ngeq;": "≱", "&ngeqq;": "≧̸", "&ngeqslant;": "⩾̸", "&nges;": "⩾̸", "&ngsim;": "≵", "&ngt;": "≯", "&ngtr;": "≯", "&nhArr;": "⇎", "&nharr;": "↮", "&nhpar;": "⫲", "&ni;": "∋", "&nis;": "⋼", "&nisd;": "⋺", "&niv;": "∋", "&njcy;": "њ", "&nlArr;": "⇍", "&nlE;": "≦̸", "&nlarr;": "↚", "&nldr;": "‥", "&nle;": "≰", "&nleftarrow;": "↚", "&nleftrightarrow;": "↮", "&nleq;": "≰", "&nleqq;": "≦̸", "&nleqslant;": "⩽̸", "&nles;": "⩽̸", "&nless;": "≮", "&nlsim;": "≴", "&nlt;": "≮", "&nltri;": "⋪", "&nltrie;": "⋬", "&nmid;": "∤", "&nopf;": "𝕟", "&not": "¬", "&not;": "¬", "&notin;": "∉", "&notinE;": "⋹̸", "&notindot;": "⋵̸", "&notinva;": "∉", "&notinvb;": "⋷", "&notinvc;": "⋶", "&notni;": "∌", "&notniva;": "∌", "&notnivb;": "⋾", "&notnivc;": "⋽", "&npar;": "∦", "&nparallel;": "∦", "&nparsl;": "⫽⃥", "&npart;": "∂̸", "&npolint;": "⨔", "&npr;": "⊀", "&nprcue;": "⋠", "&npre;": "⪯̸", "&nprec;": "⊀", "&npreceq;": "⪯̸", "&nrArr;": "⇏", "&nrarr;": "↛", "&nrarrc;": "⤳̸", "&nrarrw;": "↝̸", "&nrightarrow;": "↛", "&nrtri;": "⋫", "&nrtrie;": "⋭", "&nsc;": "⊁", "&nsccue;": "⋡", "&nsce;": "⪰̸", "&nscr;": "𝓃", "&nshortmid;": "∤", "&nshortparallel;": "∦", "&nsim;": "≁", "&nsime;": "≄", "&nsimeq;": "≄", "&nsmid;": "∤", "&nspar;": "∦", "&nsqsube;": "⋢", "&nsqsupe;": "⋣", "&nsub;": "⊄", "&nsubE;": "⫅̸", "&nsube;": "⊈", "&nsubset;": "⊂⃒", "&nsubseteq;": "⊈", "&nsubseteqq;": "⫅̸", "&nsucc;": "⊁", "&nsucceq;": "⪰̸", "&nsup;": "⊅", "&nsupE;": "⫆̸", "&nsupe;": "⊉", "&nsupset;": "⊃⃒", "&nsupseteq;": "⊉", "&nsupseteqq;": "⫆̸", "&ntgl;": "≹", "&ntilde": "ñ", "&ntilde;": "ñ", "&ntlg;": "≸", "&ntriangleleft;": "⋪", "&ntrianglelefteq;": "⋬", "&ntriangleright;": "⋫", "&ntrianglerighteq;": "⋭", "&nu;": "ν", "&num;": "#", "&numero;": "№", "&numsp;": " ", "&nvDash;": "⊭", "&nvHarr;": "⤄", "&nvap;": "≍⃒", "&nvdash;": "⊬", "&nvge;": "≥⃒", "&nvgt;": ">⃒", "&nvinfin;": "⧞", "&nvlArr;": "⤂", "&nvle;": "≤⃒", "&nvlt;": "<⃒", "&nvltrie;": "⊴⃒", "&nvrArr;": "⤃", "&nvrtrie;": "⊵⃒", "&nvsim;": "∼⃒", "&nwArr;": "⇖", "&nwarhk;": "⤣", "&nwarr;": "↖", "&nwarrow;": "↖", "&nwnear;": "⤧", "&oS;": "Ⓢ", "&oacute": "ó", "&oacute;": "ó", "&oast;": "⊛", "&ocir;": "⊚", "&ocirc": "ô", "&ocirc;": "ô", "&ocy;": "о", "&odash;": "⊝", "&odblac;": "ő", "&odiv;": "⨸", "&odot;": "⊙", "&odsold;": "⦼", "&oelig;": "œ", "&ofcir;": "⦿", "&ofr;": "𝔬", "&ogon;": "˛", "&ograve": "ò", "&ograve;": "ò", "&ogt;": "⧁", "&ohbar;": "⦵", "&ohm;": "Ω", "&oint;": "∮", "&olarr;": "↺", "&olcir;": "⦾", "&olcross;": "⦻", "&oline;": "‾", "&olt;": "⧀", "&omacr;": "ō", "&omega;": "ω", "&omicron;": "ο", "&omid;": "⦶", "&ominus;": "⊖", "&oopf;": "𝕠", "&opar;": "⦷", "&operp;": "⦹", "&oplus;": "⊕", "&or;": "∨", "&orarr;": "↻", "&ord;": "⩝", "&order;": "ℴ", "&orderof;": "ℴ", "&ordf": "ª", "&ordf;": "ª", "&ordm": "º", "&ordm;": "º", "&origof;": "⊶", "&oror;": "⩖", "&orslope;": "⩗", "&orv;": "⩛", "&oscr;": "ℴ", "&oslash": "ø", "&oslash;": "ø", "&osol;": "⊘", "&otilde": "õ", "&otilde;": "õ", "&otimes;": "⊗", "&otimesas;": "⨶", "&ouml": "ö", "&ouml;": "ö", "&ovbar;": "⌽", "&par;": "∥", "&para": "¶", "&para;": "¶", "&parallel;": "∥", "&parsim;": "⫳", "&parsl;": "⫽", "&part;": "∂", "&pcy;": "п", "&percnt;": "%", "&period;": ".", "&permil;": "‰", "&perp;": "⊥", "&pertenk;": "‱", "&pfr;": "𝔭", "&phi;": "φ", "&phiv;": "ϕ", "&phmmat;": "ℳ", "&phone;": "☎", "&pi;": "π", "&pitchfork;": "⋔", "&piv;": "ϖ", "&planck;": "ℏ", "&planckh;": "ℎ", "&plankv;": "ℏ", "&plus;": "+", "&plusacir;": "⨣", "&plusb;": "⊞", "&pluscir;": "⨢", "&plusdo;": "∔", "&plusdu;": "⨥", "&pluse;": "⩲", "&plusmn": "±", "&plusmn;": "±", "&plussim;": "⨦", "&plustwo;": "⨧", "&pm;": "±", "&pointint;": "⨕", "&popf;": "𝕡", "&pound": "£", "&pound;": "£", "&pr;": "≺", "&prE;": "⪳", "&prap;": "⪷", "&prcue;": "≼", "&pre;": "⪯", "&prec;": "≺", "&precapprox;": "⪷", "&preccurlyeq;": "≼", "&preceq;": "⪯", "&precnapprox;": "⪹", "&precneqq;": "⪵", "&precnsim;": "⋨", "&precsim;": "≾", "&prime;": "′", "&primes;": "ℙ", "&prnE;": "⪵", "&prnap;": "⪹", "&prnsim;": "⋨", "&prod;": "∏", "&profalar;": "⌮", "&profline;": "⌒", "&profsurf;": "⌓", "&prop;": "∝", "&propto;": "∝", "&prsim;": "≾", "&prurel;": "⊰", "&pscr;": "𝓅", "&psi;": "ψ", "&puncsp;": " ", "&qfr;": "𝔮", "&qint;": "⨌", "&qopf;": "𝕢", "&qprime;": "⁗", "&qscr;": "𝓆", "&quaternions;": "ℍ", "&quatint;": "⨖", "&quest;": "?", "&questeq;": "≟", "&quot": '"', "&quot;": '"', "&rAarr;": "⇛", "&rArr;": "⇒", "&rAtail;": "⤜", "&rBarr;": "⤏", "&rHar;": "⥤", "&race;": "∽̱", "&racute;": "ŕ", "&radic;": "√", "&raemptyv;": "⦳", "&rang;": "⟩", "&rangd;": "⦒", "&range;": "⦥", "&rangle;": "⟩", "&raquo": "»", "&raquo;": "»", "&rarr;": "→", "&rarrap;": "⥵", "&rarrb;": "⇥", "&rarrbfs;": "⤠", "&rarrc;": "⤳", "&rarrfs;": "⤞", "&rarrhk;": "↪", "&rarrlp;": "↬", "&rarrpl;": "⥅", "&rarrsim;": "⥴", "&rarrtl;": "↣", "&rarrw;": "↝", "&ratail;": "⤚", "&ratio;": "∶", "&rationals;": "ℚ", "&rbarr;": "⤍", "&rbbrk;": "❳", "&rbrace;": "}", "&rbrack;": "]", "&rbrke;": "⦌", "&rbrksld;": "⦎", "&rbrkslu;": "⦐", "&rcaron;": "ř", "&rcedil;": "ŗ", "&rceil;": "⌉", "&rcub;": "}", "&rcy;": "р", "&rdca;": "⤷", "&rdldhar;": "⥩", "&rdquo;": "”", "&rdquor;": "”", "&rdsh;": "↳", "&real;": "ℜ", "&realine;": "ℛ", "&realpart;": "ℜ", "&reals;": "ℝ", "&rect;": "▭", "&reg": "®", "&reg;": "®", "&rfisht;": "⥽", "&rfloor;": "⌋", "&rfr;": "𝔯", "&rhard;": "⇁", "&rharu;": "⇀", "&rharul;": "⥬", "&rho;": "ρ", "&rhov;": "ϱ", "&rightarrow;": "→", "&rightarrowtail;": "↣", "&rightharpoondown;": "⇁", "&rightharpoonup;": "⇀", "&rightleftarrows;": "⇄", "&rightleftharpoons;": "⇌", "&rightrightarrows;": "⇉", "&rightsquigarrow;": "↝", "&rightthreetimes;": "⋌", "&ring;": "˚", "&risingdotseq;": "≓", "&rlarr;": "⇄", "&rlhar;": "⇌", "&rlm;": "‏", "&rmoust;": "⎱", "&rmoustache;": "⎱", "&rnmid;": "⫮", "&roang;": "⟭", "&roarr;": "⇾", "&robrk;": "⟧", "&ropar;": "⦆", "&ropf;": "𝕣", "&roplus;": "⨮", "&rotimes;": "⨵", "&rpar;": ")", "&rpargt;": "⦔", "&rppolint;": "⨒", "&rrarr;": "⇉", "&rsaquo;": "›", "&rscr;": "𝓇", "&rsh;": "↱", "&rsqb;": "]", "&rsquo;": "’", "&rsquor;": "’", "&rthree;": "⋌", "&rtimes;": "⋊", "&rtri;": "▹", "&rtrie;": "⊵", "&rtrif;": "▸", "&rtriltri;": "⧎", "&ruluhar;": "⥨", "&rx;": "℞", "&sacute;": "ś", "&sbquo;": "‚", "&sc;": "≻", "&scE;": "⪴", "&scap;": "⪸", "&scaron;": "š", "&sccue;": "≽", "&sce;": "⪰", "&scedil;": "ş", "&scirc;": "ŝ", "&scnE;": "⪶", "&scnap;": "⪺", "&scnsim;": "⋩", "&scpolint;": "⨓", "&scsim;": "≿", "&scy;": "с", "&sdot;": "⋅", "&sdotb;": "⊡", "&sdote;": "⩦", "&seArr;": "⇘", "&searhk;": "⤥", "&searr;": "↘", "&searrow;": "↘", "&sect": "§", "&sect;": "§", "&semi;": ";", "&seswar;": "⤩", "&setminus;": "∖", "&setmn;": "∖", "&sext;": "✶", "&sfr;": "𝔰", "&sfrown;": "⌢", "&sharp;": "♯", "&shchcy;": "щ", "&shcy;": "ш", "&shortmid;": "∣", "&shortparallel;": "∥", "&shy": "­", "&shy;": "­", "&sigma;": "σ", "&sigmaf;": "ς", "&sigmav;": "ς", "&sim;": "∼", "&simdot;": "⩪", "&sime;": "≃", "&simeq;": "≃", "&simg;": "⪞", "&simgE;": "⪠", "&siml;": "⪝", "&simlE;": "⪟", "&simne;": "≆", "&simplus;": "⨤", "&simrarr;": "⥲", "&slarr;": "←", "&smallsetminus;": "∖", "&smashp;": "⨳", "&smeparsl;": "⧤", "&smid;": "∣", "&smile;": "⌣", "&smt;": "⪪", "&smte;": "⪬", "&smtes;": "⪬︀", "&softcy;": "ь", "&sol;": "/", "&solb;": "⧄", "&solbar;": "⌿", "&sopf;": "𝕤", "&spades;": "♠", "&spadesuit;": "♠", "&spar;": "∥", "&sqcap;": "⊓", "&sqcaps;": "⊓︀", "&sqcup;": "⊔", "&sqcups;": "⊔︀", "&sqsub;": "⊏", "&sqsube;": "⊑", "&sqsubset;": "⊏", "&sqsubseteq;": "⊑", "&sqsup;": "⊐", "&sqsupe;": "⊒", "&sqsupset;": "⊐", "&sqsupseteq;": "⊒", "&squ;": "□", "&square;": "□", "&squarf;": "▪", "&squf;": "▪", "&srarr;": "→", "&sscr;": "𝓈", "&ssetmn;": "∖", "&ssmile;": "⌣", "&sstarf;": "⋆", "&star;": "☆", "&starf;": "★", "&straightepsilon;": "ϵ", "&straightphi;": "ϕ", "&strns;": "¯", "&sub;": "⊂", "&subE;": "⫅", "&subdot;": "⪽", "&sube;": "⊆", "&subedot;": "⫃", "&submult;": "⫁", "&subnE;": "⫋", "&subne;": "⊊", "&subplus;": "⪿", "&subrarr;": "⥹", "&subset;": "⊂", "&subseteq;": "⊆", "&subseteqq;": "⫅", "&subsetneq;": "⊊", "&subsetneqq;": "⫋", "&subsim;": "⫇", "&subsub;": "⫕", "&subsup;": "⫓", "&succ;": "≻", "&succapprox;": "⪸", "&succcurlyeq;": "≽", "&succeq;": "⪰", "&succnapprox;": "⪺", "&succneqq;": "⪶", "&succnsim;": "⋩", "&succsim;": "≿", "&sum;": "∑", "&sung;": "♪", "&sup1": "¹", "&sup1;": "¹", "&sup2": "²", "&sup2;": "²", "&sup3": "³", "&sup3;": "³", "&sup;": "⊃", "&supE;": "⫆", "&supdot;": "⪾", "&supdsub;": "⫘", "&supe;": "⊇", "&supedot;": "⫄", "&suphsol;": "⟉", "&suphsub;": "⫗", "&suplarr;": "⥻", "&supmult;": "⫂", "&supnE;": "⫌", "&supne;": "⊋", "&supplus;": "⫀", "&supset;": "⊃", "&supseteq;": "⊇", "&supseteqq;": "⫆", "&supsetneq;": "⊋", "&supsetneqq;": "⫌", "&supsim;": "⫈", "&supsub;": "⫔", "&supsup;": "⫖", "&swArr;": "⇙", "&swarhk;": "⤦", "&swarr;": "↙", "&swarrow;": "↙", "&swnwar;": "⤪", "&szlig": "ß", "&szlig;": "ß", "&target;": "⌖", "&tau;": "τ", "&tbrk;": "⎴", "&tcaron;": "ť", "&tcedil;": "ţ", "&tcy;": "т", "&tdot;": "⃛", "&telrec;": "⌕", "&tfr;": "𝔱", "&there4;": "∴", "&therefore;": "∴", "&theta;": "θ", "&thetasym;": "ϑ", "&thetav;": "ϑ", "&thickapprox;": "≈", "&thicksim;": "∼", "&thinsp;": " ", "&thkap;": "≈", "&thksim;": "∼", "&thorn": "þ", "&thorn;": "þ", "&tilde;": "˜", "&times": "×", "&times;": "×", "&timesb;": "⊠", "&timesbar;": "⨱", "&timesd;": "⨰", "&tint;": "∭", "&toea;": "⤨", "&top;": "⊤", "&topbot;": "⌶", "&topcir;": "⫱", "&topf;": "𝕥", "&topfork;": "⫚", "&tosa;": "⤩", "&tprime;": "‴", "&trade;": "™", "&triangle;": "▵", "&triangledown;": "▿", "&triangleleft;": "◃", "&trianglelefteq;": "⊴", "&triangleq;": "≜", "&triangleright;": "▹", "&trianglerighteq;": "⊵", "&tridot;": "◬", "&trie;": "≜", "&triminus;": "⨺", "&triplus;": "⨹", "&trisb;": "⧍", "&tritime;": "⨻", "&trpezium;": "⏢", "&tscr;": "𝓉", "&tscy;": "ц", "&tshcy;": "ћ", "&tstrok;": "ŧ", "&twixt;": "≬", "&twoheadleftarrow;": "↞", "&twoheadrightarrow;": "↠", "&uArr;": "⇑", "&uHar;": "⥣", "&uacute": "ú", "&uacute;": "ú", "&uarr;": "↑", "&ubrcy;": "ў", "&ubreve;": "ŭ", "&ucirc": "û", "&ucirc;": "û", "&ucy;": "у", "&udarr;": "⇅", "&udblac;": "ű", "&udhar;": "⥮", "&ufisht;": "⥾", "&ufr;": "𝔲", "&ugrave": "ù", "&ugrave;": "ù", "&uharl;": "↿", "&uharr;": "↾", "&uhblk;": "▀", "&ulcorn;": "⌜", "&ulcorner;": "⌜", "&ulcrop;": "⌏", "&ultri;": "◸", "&umacr;": "ū", "&uml": "¨", "&uml;": "¨", "&uogon;": "ų", "&uopf;": "𝕦", "&uparrow;": "↑", "&updownarrow;": "↕", "&upharpoonleft;": "↿", "&upharpoonright;": "↾", "&uplus;": "⊎", "&upsi;": "υ", "&upsih;": "ϒ", "&upsilon;": "υ", "&upuparrows;": "⇈", "&urcorn;": "⌝", "&urcorner;": "⌝", "&urcrop;": "⌎", "&uring;": "ů", "&urtri;": "◹", "&uscr;": "𝓊", "&utdot;": "⋰", "&utilde;": "ũ", "&utri;": "▵", "&utrif;": "▴", "&uuarr;": "⇈", "&uuml": "ü", "&uuml;": "ü", "&uwangle;": "⦧", "&vArr;": "⇕", "&vBar;": "⫨", "&vBarv;": "⫩", "&vDash;": "⊨", "&vangrt;": "⦜", "&varepsilon;": "ϵ", "&varkappa;": "ϰ", "&varnothing;": "∅", "&varphi;": "ϕ", "&varpi;": "ϖ", "&varpropto;": "∝", "&varr;": "↕", "&varrho;": "ϱ", "&varsigma;": "ς", "&varsubsetneq;": "⊊︀", "&varsubsetneqq;": "⫋︀", "&varsupsetneq;": "⊋︀", "&varsupsetneqq;": "⫌︀", "&vartheta;": "ϑ", "&vartriangleleft;": "⊲", "&vartriangleright;": "⊳", "&vcy;": "в", "&vdash;": "⊢", "&vee;": "∨", "&veebar;": "⊻", "&veeeq;": "≚", "&vellip;": "⋮", "&verbar;": "|", "&vert;": "|", "&vfr;": "𝔳", "&vltri;": "⊲", "&vnsub;": "⊂⃒", "&vnsup;": "⊃⃒", "&vopf;": "𝕧", "&vprop;": "∝", "&vrtri;": "⊳", "&vscr;": "𝓋", "&vsubnE;": "⫋︀", "&vsubne;": "⊊︀", "&vsupnE;": "⫌︀", "&vsupne;": "⊋︀", "&vzigzag;": "⦚", "&wcirc;": "ŵ", "&wedbar;": "⩟", "&wedge;": "∧", "&wedgeq;": "≙", "&weierp;": "℘", "&wfr;": "𝔴", "&wopf;": "𝕨", "&wp;": "℘", "&wr;": "≀", "&wreath;": "≀", "&wscr;": "𝓌", "&xcap;": "⋂", "&xcirc;": "◯", "&xcup;": "⋃", "&xdtri;": "▽", "&xfr;": "𝔵", "&xhArr;": "⟺", "&xharr;": "⟷", "&xi;": "ξ", "&xlArr;": "⟸", "&xlarr;": "⟵", "&xmap;": "⟼", "&xnis;": "⋻", "&xodot;": "⨀", "&xopf;": "𝕩", "&xoplus;": "⨁", "&xotime;": "⨂", "&xrArr;": "⟹", "&xrarr;": "⟶", "&xscr;": "𝓍", "&xsqcup;": "⨆", "&xuplus;": "⨄", "&xutri;": "△", "&xvee;": "⋁", "&xwedge;": "⋀", "&yacute": "ý", "&yacute;": "ý", "&yacy;": "я", "&ycirc;": "ŷ", "&ycy;": "ы", "&yen": "¥", "&yen;": "¥", "&yfr;": "𝔶", "&yicy;": "ї", "&yopf;": "𝕪", "&yscr;": "𝓎", "&yucy;": "ю", "&yuml": "ÿ", "&yuml;": "ÿ", "&zacute;": "ź", "&zcaron;": "ž", "&zcy;": "з", "&zdot;": "ż", "&zeetrf;": "ℨ", "&zeta;": "ζ", "&zfr;": "𝔷", "&zhcy;": "ж", "&zigrarr;": "⇝", "&zopf;": "𝕫", "&zscr;": "𝓏", "&zwj;": "‍", "&zwnj;": "‌" }, characters: { "Æ": "&AElig;", "&": "&amp;", "Á": "&Aacute;", "Ă": "&Abreve;", "Â": "&Acirc;", "А": "&Acy;", "𝔄": "&Afr;", "À": "&Agrave;", "Α": "&Alpha;", "Ā": "&Amacr;", "⩓": "&And;", "Ą": "&Aogon;", "𝔸": "&Aopf;", "⁡": "&af;", "Å": "&angst;", "𝒜": "&Ascr;", "≔": "&coloneq;", "Ã": "&Atilde;", "Ä": "&Auml;", "∖": "&ssetmn;", "⫧": "&Barv;", "⌆": "&doublebarwedge;", "Б": "&Bcy;", "∵": "&because;", "ℬ": "&bernou;", "Β": "&Beta;", "𝔅": "&Bfr;", "𝔹": "&Bopf;", "˘": "&breve;", "≎": "&bump;", "Ч": "&CHcy;", "©": "&copy;", "Ć": "&Cacute;", "⋒": "&Cap;", "ⅅ": "&DD;", "ℭ": "&Cfr;", "Č": "&Ccaron;", "Ç": "&Ccedil;", "Ĉ": "&Ccirc;", "∰": "&Cconint;", "Ċ": "&Cdot;", "¸": "&cedil;", "·": "&middot;", "Χ": "&Chi;", "⊙": "&odot;", "⊖": "&ominus;", "⊕": "&oplus;", "⊗": "&otimes;", "∲": "&cwconint;", "”": "&rdquor;", "’": "&rsquor;", "∷": "&Proportion;", "⩴": "&Colone;", "≡": "&equiv;", "∯": "&DoubleContourIntegral;", "∮": "&oint;", "ℂ": "&complexes;", "∐": "&coprod;", "∳": "&awconint;", "⨯": "&Cross;", "𝒞": "&Cscr;", "⋓": "&Cup;", "≍": "&asympeq;", "⤑": "&DDotrahd;", "Ђ": "&DJcy;", "Ѕ": "&DScy;", "Џ": "&DZcy;", "‡": "&ddagger;", "↡": "&Darr;", "⫤": "&DoubleLeftTee;", "Ď": "&Dcaron;", "Д": "&Dcy;", "∇": "&nabla;", "Δ": "&Delta;", "𝔇": "&Dfr;", "´": "&acute;", "˙": "&dot;", "˝": "&dblac;", "`": "&grave;", "˜": "&tilde;", "⋄": "&diamond;", "ⅆ": "&dd;", "𝔻": "&Dopf;", "¨": "&uml;", "⃜": "&DotDot;", "≐": "&esdot;", "⇓": "&dArr;", "⇐": "&lArr;", "⇔": "&iff;", "⟸": "&xlArr;", "⟺": "&xhArr;", "⟹": "&xrArr;", "⇒": "&rArr;", "⊨": "&vDash;", "⇑": "&uArr;", "⇕": "&vArr;", "∥": "&spar;", "↓": "&downarrow;", "⤓": "&DownArrowBar;", "⇵": "&duarr;", "̑": "&DownBreve;", "⥐": "&DownLeftRightVector;", "⥞": "&DownLeftTeeVector;", "↽": "&lhard;", "⥖": "&DownLeftVectorBar;", "⥟": "&DownRightTeeVector;", "⇁": "&rightharpoondown;", "⥗": "&DownRightVectorBar;", "⊤": "&top;", "↧": "&mapstodown;", "𝒟": "&Dscr;", "Đ": "&Dstrok;", "Ŋ": "&ENG;", "Ð": "&ETH;", "É": "&Eacute;", "Ě": "&Ecaron;", "Ê": "&Ecirc;", "Э": "&Ecy;", "Ė": "&Edot;", "𝔈": "&Efr;", "È": "&Egrave;", "∈": "&isinv;", "Ē": "&Emacr;", "◻": "&EmptySmallSquare;", "▫": "&EmptyVerySmallSquare;", "Ę": "&Eogon;", "𝔼": "&Eopf;", "Ε": "&Epsilon;", "⩵": "&Equal;", "≂": "&esim;", "⇌": "&rlhar;", "ℰ": "&expectation;", "⩳": "&Esim;", "Η": "&Eta;", "Ë": "&Euml;", "∃": "&exist;", "ⅇ": "&exponentiale;", "Ф": "&Fcy;", "𝔉": "&Ffr;", "◼": "&FilledSmallSquare;", "▪": "&squf;", "𝔽": "&Fopf;", "∀": "&forall;", "ℱ": "&Fscr;", "Ѓ": "&GJcy;", ">": "&gt;", "Γ": "&Gamma;", "Ϝ": "&Gammad;", "Ğ": "&Gbreve;", "Ģ": "&Gcedil;", "Ĝ": "&Gcirc;", "Г": "&Gcy;", "Ġ": "&Gdot;", "𝔊": "&Gfr;", "⋙": "&ggg;", "𝔾": "&Gopf;", "≥": "&geq;", "⋛": "&gtreqless;", "≧": "&geqq;", "⪢": "&GreaterGreater;", "≷": "&gtrless;", "⩾": "&ges;", "≳": "&gtrsim;", "𝒢": "&Gscr;", "≫": "&gg;", "Ъ": "&HARDcy;", "ˇ": "&caron;", "^": "&Hat;", "Ĥ": "&Hcirc;", "ℌ": "&Poincareplane;", "ℋ": "&hamilt;", "ℍ": "&quaternions;", "─": "&boxh;", "Ħ": "&Hstrok;", "≏": "&bumpeq;", "Е": "&IEcy;", "Ĳ": "&IJlig;", "Ё": "&IOcy;", "Í": "&Iacute;", "Î": "&Icirc;", "И": "&Icy;", "İ": "&Idot;", "ℑ": "&imagpart;", "Ì": "&Igrave;", "Ī": "&Imacr;", "ⅈ": "&ii;", "∬": "&Int;", "∫": "&int;", "⋂": "&xcap;", "⁣": "&ic;", "⁢": "&it;", "Į": "&Iogon;", "𝕀": "&Iopf;", "Ι": "&Iota;", "ℐ": "&imagline;", "Ĩ": "&Itilde;", "І": "&Iukcy;", "Ï": "&Iuml;", "Ĵ": "&Jcirc;", "Й": "&Jcy;", "𝔍": "&Jfr;", "𝕁": "&Jopf;", "𝒥": "&Jscr;", "Ј": "&Jsercy;", "Є": "&Jukcy;", "Х": "&KHcy;", "Ќ": "&KJcy;", "Κ": "&Kappa;", "Ķ": "&Kcedil;", "К": "&Kcy;", "𝔎": "&Kfr;", "𝕂": "&Kopf;", "𝒦": "&Kscr;", "Љ": "&LJcy;", "<": "&lt;", "Ĺ": "&Lacute;", "Λ": "&Lambda;", "⟪": "&Lang;", "ℒ": "&lagran;", "↞": "&twoheadleftarrow;", "Ľ": "&Lcaron;", "Ļ": "&Lcedil;", "Л": "&Lcy;", "⟨": "&langle;", "←": "&slarr;", "⇤": "&larrb;", "⇆": "&lrarr;", "⌈": "&lceil;", "⟦": "&lobrk;", "⥡": "&LeftDownTeeVector;", "⇃": "&downharpoonleft;", "⥙": "&LeftDownVectorBar;", "⌊": "&lfloor;", "↔": "&leftrightarrow;", "⥎": "&LeftRightVector;", "⊣": "&dashv;", "↤": "&mapstoleft;", "⥚": "&LeftTeeVector;", "⊲": "&vltri;", "⧏": "&LeftTriangleBar;", "⊴": "&trianglelefteq;", "⥑": "&LeftUpDownVector;", "⥠": "&LeftUpTeeVector;", "↿": "&upharpoonleft;", "⥘": "&LeftUpVectorBar;", "↼": "&lharu;", "⥒": "&LeftVectorBar;", "⋚": "&lesseqgtr;", "≦": "&leqq;", "≶": "&lg;", "⪡": "&LessLess;", "⩽": "&les;", "≲": "&lsim;", "𝔏": "&Lfr;", "⋘": "&Ll;", "⇚": "&lAarr;", "Ŀ": "&Lmidot;", "⟵": "&xlarr;", "⟷": "&xharr;", "⟶": "&xrarr;", "𝕃": "&Lopf;", "↙": "&swarrow;", "↘": "&searrow;", "↰": "&lsh;", "Ł": "&Lstrok;", "≪": "&ll;", "⤅": "&Map;", "М": "&Mcy;", " ": "&MediumSpace;", "ℳ": "&phmmat;", "𝔐": "&Mfr;", "∓": "&mp;", "𝕄": "&Mopf;", "Μ": "&Mu;", "Њ": "&NJcy;", "Ń": "&Nacute;", "Ň": "&Ncaron;", "Ņ": "&Ncedil;", "Н": "&Ncy;", "​": "&ZeroWidthSpace;", "\n": "&NewLine;", "𝔑": "&Nfr;", "⁠": "&NoBreak;", " ": "&nbsp;", "ℕ": "&naturals;", "⫬": "&Not;", "≢": "&nequiv;", "≭": "&NotCupCap;", "∦": "&nspar;", "∉": "&notinva;", "≠": "&ne;", "≂̸": "&nesim;", "∄": "&nexists;", "≯": "&ngtr;", "≱": "&ngeq;", "≧̸": "&ngeqq;", "≫̸": "&nGtv;", "≹": "&ntgl;", "⩾̸": "&nges;", "≵": "&ngsim;", "≎̸": "&nbump;", "≏̸": "&nbumpe;", "⋪": "&ntriangleleft;", "⧏̸": "&NotLeftTriangleBar;", "⋬": "&ntrianglelefteq;", "≮": "&nlt;", "≰": "&nleq;", "≸": "&ntlg;", "≪̸": "&nLtv;", "⩽̸": "&nles;", "≴": "&nlsim;", "⪢̸": "&NotNestedGreaterGreater;", "⪡̸": "&NotNestedLessLess;", "⊀": "&nprec;", "⪯̸": "&npreceq;", "⋠": "&nprcue;", "∌": "&notniva;", "⋫": "&ntriangleright;", "⧐̸": "&NotRightTriangleBar;", "⋭": "&ntrianglerighteq;", "⊏̸": "&NotSquareSubset;", "⋢": "&nsqsube;", "⊐̸": "&NotSquareSuperset;", "⋣": "&nsqsupe;", "⊂⃒": "&vnsub;", "⊈": "&nsubseteq;", "⊁": "&nsucc;", "⪰̸": "&nsucceq;", "⋡": "&nsccue;", "≿̸": "&NotSucceedsTilde;", "⊃⃒": "&vnsup;", "⊉": "&nsupseteq;", "≁": "&nsim;", "≄": "&nsimeq;", "≇": "&ncong;", "≉": "&napprox;", "∤": "&nsmid;", "𝒩": "&Nscr;", "Ñ": "&Ntilde;", "Ν": "&Nu;", "Œ": "&OElig;", "Ó": "&Oacute;", "Ô": "&Ocirc;", "О": "&Ocy;", "Ő": "&Odblac;", "𝔒": "&Ofr;", "Ò": "&Ograve;", "Ō": "&Omacr;", "Ω": "&ohm;", "Ο": "&Omicron;", "𝕆": "&Oopf;", "“": "&ldquo;", "‘": "&lsquo;", "⩔": "&Or;", "𝒪": "&Oscr;", "Ø": "&Oslash;", "Õ": "&Otilde;", "⨷": "&Otimes;", "Ö": "&Ouml;", "‾": "&oline;", "⏞": "&OverBrace;", "⎴": "&tbrk;", "⏜": "&OverParenthesis;", "∂": "&part;", "П": "&Pcy;", "𝔓": "&Pfr;", "Φ": "&Phi;", "Π": "&Pi;", "±": "&pm;", "ℙ": "&primes;", "⪻": "&Pr;", "≺": "&prec;", "⪯": "&preceq;", "≼": "&preccurlyeq;", "≾": "&prsim;", "″": "&Prime;", "∏": "&prod;", "∝": "&vprop;", "𝒫": "&Pscr;", "Ψ": "&Psi;", '"': "&quot;", "𝔔": "&Qfr;", "ℚ": "&rationals;", "𝒬": "&Qscr;", "⤐": "&drbkarow;", "®": "&reg;", "Ŕ": "&Racute;", "⟫": "&Rang;", "↠": "&twoheadrightarrow;", "⤖": "&Rarrtl;", "Ř": "&Rcaron;", "Ŗ": "&Rcedil;", "Р": "&Rcy;", "ℜ": "&realpart;", "∋": "&niv;", "⇋": "&lrhar;", "⥯": "&duhar;", "Ρ": "&Rho;", "⟩": "&rangle;", "→": "&srarr;", "⇥": "&rarrb;", "⇄": "&rlarr;", "⌉": "&rceil;", "⟧": "&robrk;", "⥝": "&RightDownTeeVector;", "⇂": "&downharpoonright;", "⥕": "&RightDownVectorBar;", "⌋": "&rfloor;", "⊢": "&vdash;", "↦": "&mapsto;", "⥛": "&RightTeeVector;", "⊳": "&vrtri;", "⧐": "&RightTriangleBar;", "⊵": "&trianglerighteq;", "⥏": "&RightUpDownVector;", "⥜": "&RightUpTeeVector;", "↾": "&upharpoonright;", "⥔": "&RightUpVectorBar;", "⇀": "&rightharpoonup;", "⥓": "&RightVectorBar;", "ℝ": "&reals;", "⥰": "&RoundImplies;", "⇛": "&rAarr;", "ℛ": "&realine;", "↱": "&rsh;", "⧴": "&RuleDelayed;", "Щ": "&SHCHcy;", "Ш": "&SHcy;", "Ь": "&SOFTcy;", "Ś": "&Sacute;", "⪼": "&Sc;", "Š": "&Scaron;", "Ş": "&Scedil;", "Ŝ": "&Scirc;", "С": "&Scy;", "𝔖": "&Sfr;", "↑": "&uparrow;", "Σ": "&Sigma;", "∘": "&compfn;", "𝕊": "&Sopf;", "√": "&radic;", "□": "&square;", "⊓": "&sqcap;", "⊏": "&sqsubset;", "⊑": "&sqsubseteq;", "⊐": "&sqsupset;", "⊒": "&sqsupseteq;", "⊔": "&sqcup;", "𝒮": "&Sscr;", "⋆": "&sstarf;", "⋐": "&Subset;", "⊆": "&subseteq;", "≻": "&succ;", "⪰": "&succeq;", "≽": "&succcurlyeq;", "≿": "&succsim;", "∑": "&sum;", "⋑": "&Supset;", "⊃": "&supset;", "⊇": "&supseteq;", "Þ": "&THORN;", "™": "&trade;", "Ћ": "&TSHcy;", "Ц": "&TScy;", "	": "&Tab;", "Τ": "&Tau;", "Ť": "&Tcaron;", "Ţ": "&Tcedil;", "Т": "&Tcy;", "𝔗": "&Tfr;", "∴": "&therefore;", "Θ": "&Theta;", "  ": "&ThickSpace;", " ": "&thinsp;", "∼": "&thksim;", "≃": "&simeq;", "≅": "&cong;", "≈": "&thkap;", "𝕋": "&Topf;", "⃛": "&tdot;", "𝒯": "&Tscr;", "Ŧ": "&Tstrok;", "Ú": "&Uacute;", "↟": "&Uarr;", "⥉": "&Uarrocir;", "Ў": "&Ubrcy;", "Ŭ": "&Ubreve;", "Û": "&Ucirc;", "У": "&Ucy;", "Ű": "&Udblac;", "𝔘": "&Ufr;", "Ù": "&Ugrave;", "Ū": "&Umacr;", _: "&lowbar;", "⏟": "&UnderBrace;", "⎵": "&bbrk;", "⏝": "&UnderParenthesis;", "⋃": "&xcup;", "⊎": "&uplus;", "Ų": "&Uogon;", "𝕌": "&Uopf;", "⤒": "&UpArrowBar;", "⇅": "&udarr;", "↕": "&varr;", "⥮": "&udhar;", "⊥": "&perp;", "↥": "&mapstoup;", "↖": "&nwarrow;", "↗": "&nearrow;", "ϒ": "&upsih;", "Υ": "&Upsilon;", "Ů": "&Uring;", "𝒰": "&Uscr;", "Ũ": "&Utilde;", "Ü": "&Uuml;", "⊫": "&VDash;", "⫫": "&Vbar;", "В": "&Vcy;", "⊩": "&Vdash;", "⫦": "&Vdashl;", "⋁": "&xvee;", "‖": "&Vert;", "∣": "&smid;", "|": "&vert;", "❘": "&VerticalSeparator;", "≀": "&wreath;", " ": "&hairsp;", "𝔙": "&Vfr;", "𝕍": "&Vopf;", "𝒱": "&Vscr;", "⊪": "&Vvdash;", "Ŵ": "&Wcirc;", "⋀": "&xwedge;", "𝔚": "&Wfr;", "𝕎": "&Wopf;", "𝒲": "&Wscr;", "𝔛": "&Xfr;", "Ξ": "&Xi;", "𝕏": "&Xopf;", "𝒳": "&Xscr;", "Я": "&YAcy;", "Ї": "&YIcy;", "Ю": "&YUcy;", "Ý": "&Yacute;", "Ŷ": "&Ycirc;", "Ы": "&Ycy;", "𝔜": "&Yfr;", "𝕐": "&Yopf;", "𝒴": "&Yscr;", "Ÿ": "&Yuml;", "Ж": "&ZHcy;", "Ź": "&Zacute;", "Ž": "&Zcaron;", "З": "&Zcy;", "Ż": "&Zdot;", "Ζ": "&Zeta;", "ℨ": "&zeetrf;", "ℤ": "&integers;", "𝒵": "&Zscr;", "á": "&aacute;", "ă": "&abreve;", "∾": "&mstpos;", "∾̳": "&acE;", "∿": "&acd;", "â": "&acirc;", "а": "&acy;", "æ": "&aelig;", "𝔞": "&afr;", "à": "&agrave;", "ℵ": "&aleph;", "α": "&alpha;", "ā": "&amacr;", "⨿": "&amalg;", "∧": "&wedge;", "⩕": "&andand;", "⩜": "&andd;", "⩘": "&andslope;", "⩚": "&andv;", "∠": "&angle;", "⦤": "&ange;", "∡": "&measuredangle;", "⦨": "&angmsdaa;", "⦩": "&angmsdab;", "⦪": "&angmsdac;", "⦫": "&angmsdad;", "⦬": "&angmsdae;", "⦭": "&angmsdaf;", "⦮": "&angmsdag;", "⦯": "&angmsdah;", "∟": "&angrt;", "⊾": "&angrtvb;", "⦝": "&angrtvbd;", "∢": "&angsph;", "⍼": "&angzarr;", "ą": "&aogon;", "𝕒": "&aopf;", "⩰": "&apE;", "⩯": "&apacir;", "≊": "&approxeq;", "≋": "&apid;", "'": "&apos;", "å": "&aring;", "𝒶": "&ascr;", "*": "&midast;", "ã": "&atilde;", "ä": "&auml;", "⨑": "&awint;", "⫭": "&bNot;", "≌": "&bcong;", "϶": "&bepsi;", "‵": "&bprime;", "∽": "&bsim;", "⋍": "&bsime;", "⊽": "&barvee;", "⌅": "&barwedge;", "⎶": "&bbrktbrk;", "б": "&bcy;", "„": "&ldquor;", "⦰": "&bemptyv;", "β": "&beta;", "ℶ": "&beth;", "≬": "&twixt;", "𝔟": "&bfr;", "◯": "&xcirc;", "⨀": "&xodot;", "⨁": "&xoplus;", "⨂": "&xotime;", "⨆": "&xsqcup;", "★": "&starf;", "▽": "&xdtri;", "△": "&xutri;", "⨄": "&xuplus;", "⤍": "&rbarr;", "⧫": "&lozf;", "▴": "&utrif;", "▾": "&dtrif;", "◂": "&ltrif;", "▸": "&rtrif;", "␣": "&blank;", "▒": "&blk12;", "░": "&blk14;", "▓": "&blk34;", "█": "&block;", "=⃥": "&bne;", "≡⃥": "&bnequiv;", "⌐": "&bnot;", "𝕓": "&bopf;", "⋈": "&bowtie;", "╗": "&boxDL;", "╔": "&boxDR;", "╖": "&boxDl;", "╓": "&boxDr;", "═": "&boxH;", "╦": "&boxHD;", "╩": "&boxHU;", "╤": "&boxHd;", "╧": "&boxHu;", "╝": "&boxUL;", "╚": "&boxUR;", "╜": "&boxUl;", "╙": "&boxUr;", "║": "&boxV;", "╬": "&boxVH;", "╣": "&boxVL;", "╠": "&boxVR;", "╫": "&boxVh;", "╢": "&boxVl;", "╟": "&boxVr;", "⧉": "&boxbox;", "╕": "&boxdL;", "╒": "&boxdR;", "┐": "&boxdl;", "┌": "&boxdr;", "╥": "&boxhD;", "╨": "&boxhU;", "┬": "&boxhd;", "┴": "&boxhu;", "⊟": "&minusb;", "⊞": "&plusb;", "⊠": "&timesb;", "╛": "&boxuL;", "╘": "&boxuR;", "┘": "&boxul;", "└": "&boxur;", "│": "&boxv;", "╪": "&boxvH;", "╡": "&boxvL;", "╞": "&boxvR;", "┼": "&boxvh;", "┤": "&boxvl;", "├": "&boxvr;", "¦": "&brvbar;", "𝒷": "&bscr;", "⁏": "&bsemi;", "\\": "&bsol;", "⧅": "&bsolb;", "⟈": "&bsolhsub;", "•": "&bullet;", "⪮": "&bumpE;", "ć": "&cacute;", "∩": "&cap;", "⩄": "&capand;", "⩉": "&capbrcup;", "⩋": "&capcap;", "⩇": "&capcup;", "⩀": "&capdot;", "∩︀": "&caps;", "⁁": "&caret;", "⩍": "&ccaps;", "č": "&ccaron;", "ç": "&ccedil;", "ĉ": "&ccirc;", "⩌": "&ccups;", "⩐": "&ccupssm;", "ċ": "&cdot;", "⦲": "&cemptyv;", "¢": "&cent;", "𝔠": "&cfr;", "ч": "&chcy;", "✓": "&checkmark;", "χ": "&chi;", "○": "&cir;", "⧃": "&cirE;", "ˆ": "&circ;", "≗": "&cire;", "↺": "&olarr;", "↻": "&orarr;", "Ⓢ": "&oS;", "⊛": "&oast;", "⊚": "&ocir;", "⊝": "&odash;", "⨐": "&cirfnint;", "⫯": "&cirmid;", "⧂": "&cirscir;", "♣": "&clubsuit;", ":": "&colon;", ",": "&comma;", "@": "&commat;", "∁": "&complement;", "⩭": "&congdot;", "𝕔": "&copf;", "℗": "&copysr;", "↵": "&crarr;", "✗": "&cross;", "𝒸": "&cscr;", "⫏": "&csub;", "⫑": "&csube;", "⫐": "&csup;", "⫒": "&csupe;", "⋯": "&ctdot;", "⤸": "&cudarrl;", "⤵": "&cudarrr;", "⋞": "&curlyeqprec;", "⋟": "&curlyeqsucc;", "↶": "&curvearrowleft;", "⤽": "&cularrp;", "∪": "&cup;", "⩈": "&cupbrcap;", "⩆": "&cupcap;", "⩊": "&cupcup;", "⊍": "&cupdot;", "⩅": "&cupor;", "∪︀": "&cups;", "↷": "&curvearrowright;", "⤼": "&curarrm;", "⋎": "&cuvee;", "⋏": "&cuwed;", "¤": "&curren;", "∱": "&cwint;", "⌭": "&cylcty;", "⥥": "&dHar;", "†": "&dagger;", "ℸ": "&daleth;", "‐": "&hyphen;", "⤏": "&rBarr;", "ď": "&dcaron;", "д": "&dcy;", "⇊": "&downdownarrows;", "⩷": "&eDDot;", "°": "&deg;", "δ": "&delta;", "⦱": "&demptyv;", "⥿": "&dfisht;", "𝔡": "&dfr;", "♦": "&diams;", "ϝ": "&gammad;", "⋲": "&disin;", "÷": "&divide;", "⋇": "&divonx;", "ђ": "&djcy;", "⌞": "&llcorner;", "⌍": "&dlcrop;", $: "&dollar;", "𝕕": "&dopf;", "≑": "&eDot;", "∸": "&minusd;", "∔": "&plusdo;", "⊡": "&sdotb;", "⌟": "&lrcorner;", "⌌": "&drcrop;", "𝒹": "&dscr;", "ѕ": "&dscy;", "⧶": "&dsol;", "đ": "&dstrok;", "⋱": "&dtdot;", "▿": "&triangledown;", "⦦": "&dwangle;", "џ": "&dzcy;", "⟿": "&dzigrarr;", "é": "&eacute;", "⩮": "&easter;", "ě": "&ecaron;", "≖": "&eqcirc;", "ê": "&ecirc;", "≕": "&eqcolon;", "э": "&ecy;", "ė": "&edot;", "≒": "&fallingdotseq;", "𝔢": "&efr;", "⪚": "&eg;", "è": "&egrave;", "⪖": "&eqslantgtr;", "⪘": "&egsdot;", "⪙": "&el;", "⏧": "&elinters;", "ℓ": "&ell;", "⪕": "&eqslantless;", "⪗": "&elsdot;", "ē": "&emacr;", "∅": "&varnothing;", " ": "&emsp13;", " ": "&emsp14;", " ": "&emsp;", "ŋ": "&eng;", " ": "&ensp;", "ę": "&eogon;", "𝕖": "&eopf;", "⋕": "&epar;", "⧣": "&eparsl;", "⩱": "&eplus;", "ε": "&epsilon;", "ϵ": "&varepsilon;", "=": "&equals;", "≟": "&questeq;", "⩸": "&equivDD;", "⧥": "&eqvparsl;", "≓": "&risingdotseq;", "⥱": "&erarr;", "ℯ": "&escr;", "η": "&eta;", "ð": "&eth;", "ë": "&euml;", "€": "&euro;", "!": "&excl;", "ф": "&fcy;", "♀": "&female;", "ﬃ": "&ffilig;", "ﬀ": "&fflig;", "ﬄ": "&ffllig;", "𝔣": "&ffr;", "ﬁ": "&filig;", fj: "&fjlig;", "♭": "&flat;", "ﬂ": "&fllig;", "▱": "&fltns;", "ƒ": "&fnof;", "𝕗": "&fopf;", "⋔": "&pitchfork;", "⫙": "&forkv;", "⨍": "&fpartint;", "½": "&half;", "⅓": "&frac13;", "¼": "&frac14;", "⅕": "&frac15;", "⅙": "&frac16;", "⅛": "&frac18;", "⅔": "&frac23;", "⅖": "&frac25;", "¾": "&frac34;", "⅗": "&frac35;", "⅜": "&frac38;", "⅘": "&frac45;", "⅚": "&frac56;", "⅝": "&frac58;", "⅞": "&frac78;", "⁄": "&frasl;", "⌢": "&sfrown;", "𝒻": "&fscr;", "⪌": "&gtreqqless;", "ǵ": "&gacute;", "γ": "&gamma;", "⪆": "&gtrapprox;", "ğ": "&gbreve;", "ĝ": "&gcirc;", "г": "&gcy;", "ġ": "&gdot;", "⪩": "&gescc;", "⪀": "&gesdot;", "⪂": "&gesdoto;", "⪄": "&gesdotol;", "⋛︀": "&gesl;", "⪔": "&gesles;", "𝔤": "&gfr;", "ℷ": "&gimel;", "ѓ": "&gjcy;", "⪒": "&glE;", "⪥": "&gla;", "⪤": "&glj;", "≩": "&gneqq;", "⪊": "&gnapprox;", "⪈": "&gneq;", "⋧": "&gnsim;", "𝕘": "&gopf;", "ℊ": "&gscr;", "⪎": "&gsime;", "⪐": "&gsiml;", "⪧": "&gtcc;", "⩺": "&gtcir;", "⋗": "&gtrdot;", "⦕": "&gtlPar;", "⩼": "&gtquest;", "⥸": "&gtrarr;", "≩︀": "&gvnE;", "ъ": "&hardcy;", "⥈": "&harrcir;", "↭": "&leftrightsquigarrow;", "ℏ": "&plankv;", "ĥ": "&hcirc;", "♥": "&heartsuit;", "…": "&mldr;", "⊹": "&hercon;", "𝔥": "&hfr;", "⤥": "&searhk;", "⤦": "&swarhk;", "⇿": "&hoarr;", "∻": "&homtht;", "↩": "&larrhk;", "↪": "&rarrhk;", "𝕙": "&hopf;", "―": "&horbar;", "𝒽": "&hscr;", "ħ": "&hstrok;", "⁃": "&hybull;", "í": "&iacute;", "î": "&icirc;", "и": "&icy;", "е": "&iecy;", "¡": "&iexcl;", "𝔦": "&ifr;", "ì": "&igrave;", "⨌": "&qint;", "∭": "&tint;", "⧜": "&iinfin;", "℩": "&iiota;", "ĳ": "&ijlig;", "ī": "&imacr;", "ı": "&inodot;", "⊷": "&imof;", "Ƶ": "&imped;", "℅": "&incare;", "∞": "&infin;", "⧝": "&infintie;", "⊺": "&intercal;", "⨗": "&intlarhk;", "⨼": "&iprod;", "ё": "&iocy;", "į": "&iogon;", "𝕚": "&iopf;", "ι": "&iota;", "¿": "&iquest;", "𝒾": "&iscr;", "⋹": "&isinE;", "⋵": "&isindot;", "⋴": "&isins;", "⋳": "&isinsv;", "ĩ": "&itilde;", "і": "&iukcy;", "ï": "&iuml;", "ĵ": "&jcirc;", "й": "&jcy;", "𝔧": "&jfr;", "ȷ": "&jmath;", "𝕛": "&jopf;", "𝒿": "&jscr;", "ј": "&jsercy;", "є": "&jukcy;", "κ": "&kappa;", "ϰ": "&varkappa;", "ķ": "&kcedil;", "к": "&kcy;", "𝔨": "&kfr;", "ĸ": "&kgreen;", "х": "&khcy;", "ќ": "&kjcy;", "𝕜": "&kopf;", "𝓀": "&kscr;", "⤛": "&lAtail;", "⤎": "&lBarr;", "⪋": "&lesseqqgtr;", "⥢": "&lHar;", "ĺ": "&lacute;", "⦴": "&laemptyv;", "λ": "&lambda;", "⦑": "&langd;", "⪅": "&lessapprox;", "«": "&laquo;", "⤟": "&larrbfs;", "⤝": "&larrfs;", "↫": "&looparrowleft;", "⤹": "&larrpl;", "⥳": "&larrsim;", "↢": "&leftarrowtail;", "⪫": "&lat;", "⤙": "&latail;", "⪭": "&late;", "⪭︀": "&lates;", "⤌": "&lbarr;", "❲": "&lbbrk;", "{": "&lcub;", "[": "&lsqb;", "⦋": "&lbrke;", "⦏": "&lbrksld;", "⦍": "&lbrkslu;", "ľ": "&lcaron;", "ļ": "&lcedil;", "л": "&lcy;", "⤶": "&ldca;", "⥧": "&ldrdhar;", "⥋": "&ldrushar;", "↲": "&ldsh;", "≤": "&leq;", "⇇": "&llarr;", "⋋": "&lthree;", "⪨": "&lescc;", "⩿": "&lesdot;", "⪁": "&lesdoto;", "⪃": "&lesdotor;", "⋚︀": "&lesg;", "⪓": "&lesges;", "⋖": "&ltdot;", "⥼": "&lfisht;", "𝔩": "&lfr;", "⪑": "&lgE;", "⥪": "&lharul;", "▄": "&lhblk;", "љ": "&ljcy;", "⥫": "&llhard;", "◺": "&lltri;", "ŀ": "&lmidot;", "⎰": "&lmoustache;", "≨": "&lneqq;", "⪉": "&lnapprox;", "⪇": "&lneq;", "⋦": "&lnsim;", "⟬": "&loang;", "⇽": "&loarr;", "⟼": "&xmap;", "↬": "&rarrlp;", "⦅": "&lopar;", "𝕝": "&lopf;", "⨭": "&loplus;", "⨴": "&lotimes;", "∗": "&lowast;", "◊": "&lozenge;", "(": "&lpar;", "⦓": "&lparlt;", "⥭": "&lrhard;", "‎": "&lrm;", "⊿": "&lrtri;", "‹": "&lsaquo;", "𝓁": "&lscr;", "⪍": "&lsime;", "⪏": "&lsimg;", "‚": "&sbquo;", "ł": "&lstrok;", "⪦": "&ltcc;", "⩹": "&ltcir;", "⋉": "&ltimes;", "⥶": "&ltlarr;", "⩻": "&ltquest;", "⦖": "&ltrPar;", "◃": "&triangleleft;", "⥊": "&lurdshar;", "⥦": "&luruhar;", "≨︀": "&lvnE;", "∺": "&mDDot;", "¯": "&strns;", "♂": "&male;", "✠": "&maltese;", "▮": "&marker;", "⨩": "&mcomma;", "м": "&mcy;", "—": "&mdash;", "𝔪": "&mfr;", "℧": "&mho;", "µ": "&micro;", "⫰": "&midcir;", "−": "&minus;", "⨪": "&minusdu;", "⫛": "&mlcp;", "⊧": "&models;", "𝕞": "&mopf;", "𝓂": "&mscr;", "μ": "&mu;", "⊸": "&mumap;", "⋙̸": "&nGg;", "≫⃒": "&nGt;", "⇍": "&nlArr;", "⇎": "&nhArr;", "⋘̸": "&nLl;", "≪⃒": "&nLt;", "⇏": "&nrArr;", "⊯": "&nVDash;", "⊮": "&nVdash;", "ń": "&nacute;", "∠⃒": "&nang;", "⩰̸": "&napE;", "≋̸": "&napid;", "ŉ": "&napos;", "♮": "&natural;", "⩃": "&ncap;", "ň": "&ncaron;", "ņ": "&ncedil;", "⩭̸": "&ncongdot;", "⩂": "&ncup;", "н": "&ncy;", "–": "&ndash;", "⇗": "&neArr;", "⤤": "&nearhk;", "≐̸": "&nedot;", "⤨": "&toea;", "𝔫": "&nfr;", "↮": "&nleftrightarrow;", "⫲": "&nhpar;", "⋼": "&nis;", "⋺": "&nisd;", "њ": "&njcy;", "≦̸": "&nleqq;", "↚": "&nleftarrow;", "‥": "&nldr;", "𝕟": "&nopf;", "¬": "&not;", "⋹̸": "&notinE;", "⋵̸": "&notindot;", "⋷": "&notinvb;", "⋶": "&notinvc;", "⋾": "&notnivb;", "⋽": "&notnivc;", "⫽⃥": "&nparsl;", "∂̸": "&npart;", "⨔": "&npolint;", "↛": "&nrightarrow;", "⤳̸": "&nrarrc;", "↝̸": "&nrarrw;", "𝓃": "&nscr;", "⊄": "&nsub;", "⫅̸": "&nsubseteqq;", "⊅": "&nsup;", "⫆̸": "&nsupseteqq;", "ñ": "&ntilde;", "ν": "&nu;", "#": "&num;", "№": "&numero;", " ": "&numsp;", "⊭": "&nvDash;", "⤄": "&nvHarr;", "≍⃒": "&nvap;", "⊬": "&nvdash;", "≥⃒": "&nvge;", ">⃒": "&nvgt;", "⧞": "&nvinfin;", "⤂": "&nvlArr;", "≤⃒": "&nvle;", "<⃒": "&nvlt;", "⊴⃒": "&nvltrie;", "⤃": "&nvrArr;", "⊵⃒": "&nvrtrie;", "∼⃒": "&nvsim;", "⇖": "&nwArr;", "⤣": "&nwarhk;", "⤧": "&nwnear;", "ó": "&oacute;", "ô": "&ocirc;", "о": "&ocy;", "ő": "&odblac;", "⨸": "&odiv;", "⦼": "&odsold;", "œ": "&oelig;", "⦿": "&ofcir;", "𝔬": "&ofr;", "˛": "&ogon;", "ò": "&ograve;", "⧁": "&ogt;", "⦵": "&ohbar;", "⦾": "&olcir;", "⦻": "&olcross;", "⧀": "&olt;", "ō": "&omacr;", "ω": "&omega;", "ο": "&omicron;", "⦶": "&omid;", "𝕠": "&oopf;", "⦷": "&opar;", "⦹": "&operp;", "∨": "&vee;", "⩝": "&ord;", "ℴ": "&oscr;", "ª": "&ordf;", "º": "&ordm;", "⊶": "&origof;", "⩖": "&oror;", "⩗": "&orslope;", "⩛": "&orv;", "ø": "&oslash;", "⊘": "&osol;", "õ": "&otilde;", "⨶": "&otimesas;", "ö": "&ouml;", "⌽": "&ovbar;", "¶": "&para;", "⫳": "&parsim;", "⫽": "&parsl;", "п": "&pcy;", "%": "&percnt;", ".": "&period;", "‰": "&permil;", "‱": "&pertenk;", "𝔭": "&pfr;", "φ": "&phi;", "ϕ": "&varphi;", "☎": "&phone;", "π": "&pi;", "ϖ": "&varpi;", "ℎ": "&planckh;", "+": "&plus;", "⨣": "&plusacir;", "⨢": "&pluscir;", "⨥": "&plusdu;", "⩲": "&pluse;", "⨦": "&plussim;", "⨧": "&plustwo;", "⨕": "&pointint;", "𝕡": "&popf;", "£": "&pound;", "⪳": "&prE;", "⪷": "&precapprox;", "⪹": "&prnap;", "⪵": "&prnE;", "⋨": "&prnsim;", "′": "&prime;", "⌮": "&profalar;", "⌒": "&profline;", "⌓": "&profsurf;", "⊰": "&prurel;", "𝓅": "&pscr;", "ψ": "&psi;", " ": "&puncsp;", "𝔮": "&qfr;", "𝕢": "&qopf;", "⁗": "&qprime;", "𝓆": "&qscr;", "⨖": "&quatint;", "?": "&quest;", "⤜": "&rAtail;", "⥤": "&rHar;", "∽̱": "&race;", "ŕ": "&racute;", "⦳": "&raemptyv;", "⦒": "&rangd;", "⦥": "&range;", "»": "&raquo;", "⥵": "&rarrap;", "⤠": "&rarrbfs;", "⤳": "&rarrc;", "⤞": "&rarrfs;", "⥅": "&rarrpl;", "⥴": "&rarrsim;", "↣": "&rightarrowtail;", "↝": "&rightsquigarrow;", "⤚": "&ratail;", "∶": "&ratio;", "❳": "&rbbrk;", "}": "&rcub;", "]": "&rsqb;", "⦌": "&rbrke;", "⦎": "&rbrksld;", "⦐": "&rbrkslu;", "ř": "&rcaron;", "ŗ": "&rcedil;", "р": "&rcy;", "⤷": "&rdca;", "⥩": "&rdldhar;", "↳": "&rdsh;", "▭": "&rect;", "⥽": "&rfisht;", "𝔯": "&rfr;", "⥬": "&rharul;", "ρ": "&rho;", "ϱ": "&varrho;", "⇉": "&rrarr;", "⋌": "&rthree;", "˚": "&ring;", "‏": "&rlm;", "⎱": "&rmoustache;", "⫮": "&rnmid;", "⟭": "&roang;", "⇾": "&roarr;", "⦆": "&ropar;", "𝕣": "&ropf;", "⨮": "&roplus;", "⨵": "&rotimes;", ")": "&rpar;", "⦔": "&rpargt;", "⨒": "&rppolint;", "›": "&rsaquo;", "𝓇": "&rscr;", "⋊": "&rtimes;", "▹": "&triangleright;", "⧎": "&rtriltri;", "⥨": "&ruluhar;", "℞": "&rx;", "ś": "&sacute;", "⪴": "&scE;", "⪸": "&succapprox;", "š": "&scaron;", "ş": "&scedil;", "ŝ": "&scirc;", "⪶": "&succneqq;", "⪺": "&succnapprox;", "⋩": "&succnsim;", "⨓": "&scpolint;", "с": "&scy;", "⋅": "&sdot;", "⩦": "&sdote;", "⇘": "&seArr;", "§": "&sect;", ";": "&semi;", "⤩": "&tosa;", "✶": "&sext;", "𝔰": "&sfr;", "♯": "&sharp;", "щ": "&shchcy;", "ш": "&shcy;", "­": "&shy;", "σ": "&sigma;", "ς": "&varsigma;", "⩪": "&simdot;", "⪞": "&simg;", "⪠": "&simgE;", "⪝": "&siml;", "⪟": "&simlE;", "≆": "&simne;", "⨤": "&simplus;", "⥲": "&simrarr;", "⨳": "&smashp;", "⧤": "&smeparsl;", "⌣": "&ssmile;", "⪪": "&smt;", "⪬": "&smte;", "⪬︀": "&smtes;", "ь": "&softcy;", "/": "&sol;", "⧄": "&solb;", "⌿": "&solbar;", "𝕤": "&sopf;", "♠": "&spadesuit;", "⊓︀": "&sqcaps;", "⊔︀": "&sqcups;", "𝓈": "&sscr;", "☆": "&star;", "⊂": "&subset;", "⫅": "&subseteqq;", "⪽": "&subdot;", "⫃": "&subedot;", "⫁": "&submult;", "⫋": "&subsetneqq;", "⊊": "&subsetneq;", "⪿": "&subplus;", "⥹": "&subrarr;", "⫇": "&subsim;", "⫕": "&subsub;", "⫓": "&subsup;", "♪": "&sung;", "¹": "&sup1;", "²": "&sup2;", "³": "&sup3;", "⫆": "&supseteqq;", "⪾": "&supdot;", "⫘": "&supdsub;", "⫄": "&supedot;", "⟉": "&suphsol;", "⫗": "&suphsub;", "⥻": "&suplarr;", "⫂": "&supmult;", "⫌": "&supsetneqq;", "⊋": "&supsetneq;", "⫀": "&supplus;", "⫈": "&supsim;", "⫔": "&supsub;", "⫖": "&supsup;", "⇙": "&swArr;", "⤪": "&swnwar;", "ß": "&szlig;", "⌖": "&target;", "τ": "&tau;", "ť": "&tcaron;", "ţ": "&tcedil;", "т": "&tcy;", "⌕": "&telrec;", "𝔱": "&tfr;", "θ": "&theta;", "ϑ": "&vartheta;", "þ": "&thorn;", "×": "&times;", "⨱": "&timesbar;", "⨰": "&timesd;", "⌶": "&topbot;", "⫱": "&topcir;", "𝕥": "&topf;", "⫚": "&topfork;", "‴": "&tprime;", "▵": "&utri;", "≜": "&trie;", "◬": "&tridot;", "⨺": "&triminus;", "⨹": "&triplus;", "⧍": "&trisb;", "⨻": "&tritime;", "⏢": "&trpezium;", "𝓉": "&tscr;", "ц": "&tscy;", "ћ": "&tshcy;", "ŧ": "&tstrok;", "⥣": "&uHar;", "ú": "&uacute;", "ў": "&ubrcy;", "ŭ": "&ubreve;", "û": "&ucirc;", "у": "&ucy;", "ű": "&udblac;", "⥾": "&ufisht;", "𝔲": "&ufr;", "ù": "&ugrave;", "▀": "&uhblk;", "⌜": "&ulcorner;", "⌏": "&ulcrop;", "◸": "&ultri;", "ū": "&umacr;", "ų": "&uogon;", "𝕦": "&uopf;", "υ": "&upsilon;", "⇈": "&uuarr;", "⌝": "&urcorner;", "⌎": "&urcrop;", "ů": "&uring;", "◹": "&urtri;", "𝓊": "&uscr;", "⋰": "&utdot;", "ũ": "&utilde;", "ü": "&uuml;", "⦧": "&uwangle;", "⫨": "&vBar;", "⫩": "&vBarv;", "⦜": "&vangrt;", "⊊︀": "&vsubne;", "⫋︀": "&vsubnE;", "⊋︀": "&vsupne;", "⫌︀": "&vsupnE;", "в": "&vcy;", "⊻": "&veebar;", "≚": "&veeeq;", "⋮": "&vellip;", "𝔳": "&vfr;", "𝕧": "&vopf;", "𝓋": "&vscr;", "⦚": "&vzigzag;", "ŵ": "&wcirc;", "⩟": "&wedbar;", "≙": "&wedgeq;", "℘": "&wp;", "𝔴": "&wfr;", "𝕨": "&wopf;", "𝓌": "&wscr;", "𝔵": "&xfr;", "ξ": "&xi;", "⋻": "&xnis;", "𝕩": "&xopf;", "𝓍": "&xscr;", "ý": "&yacute;", "я": "&yacy;", "ŷ": "&ycirc;", "ы": "&ycy;", "¥": "&yen;", "𝔶": "&yfr;", "ї": "&yicy;", "𝕪": "&yopf;", "𝓎": "&yscr;", "ю": "&yucy;", "ÿ": "&yuml;", "ź": "&zacute;", "ž": "&zcaron;", "з": "&zcy;", "ż": "&zdot;", "ζ": "&zeta;", "𝔷": "&zfr;", "ж": "&zhcy;", "⇝": "&zigrarr;", "𝕫": "&zopf;", "𝓏": "&zscr;", "‍": "&zwj;", "‌": "&zwnj;" } } };
  }
});

// node_modules/.pnpm/html-entities@2.3.3/node_modules/html-entities/lib/numeric-unicode-map.js
var require_numeric_unicode_map = __commonJS({
  "node_modules/.pnpm/html-entities@2.3.3/node_modules/html-entities/lib/numeric-unicode-map.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numericUnicodeMap = { 0: 65533, 128: 8364, 130: 8218, 131: 402, 132: 8222, 133: 8230, 134: 8224, 135: 8225, 136: 710, 137: 8240, 138: 352, 139: 8249, 140: 338, 142: 381, 145: 8216, 146: 8217, 147: 8220, 148: 8221, 149: 8226, 150: 8211, 151: 8212, 152: 732, 153: 8482, 154: 353, 155: 8250, 156: 339, 158: 382, 159: 376 };
  }
});

// node_modules/.pnpm/html-entities@2.3.3/node_modules/html-entities/lib/surrogate-pairs.js
var require_surrogate_pairs = __commonJS({
  "node_modules/.pnpm/html-entities@2.3.3/node_modules/html-entities/lib/surrogate-pairs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromCodePoint = String.fromCodePoint || function(astralCodePoint) {
      return String.fromCharCode(Math.floor((astralCodePoint - 65536) / 1024) + 55296, (astralCodePoint - 65536) % 1024 + 56320);
    };
    exports.getCodePoint = String.prototype.codePointAt ? function(input, position) {
      return input.codePointAt(position);
    } : function(input, position) {
      return (input.charCodeAt(position) - 55296) * 1024 + input.charCodeAt(position + 1) - 56320 + 65536;
    };
    exports.highSurrogateFrom = 55296;
    exports.highSurrogateTo = 56319;
  }
});

// node_modules/.pnpm/html-entities@2.3.3/node_modules/html-entities/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/html-entities@2.3.3/node_modules/html-entities/lib/index.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var named_references_1 = require_named_references();
    var numeric_unicode_map_1 = require_numeric_unicode_map();
    var surrogate_pairs_1 = require_surrogate_pairs();
    var allNamedReferences = __assign(__assign({}, named_references_1.namedReferences), { all: named_references_1.namedReferences.html5 });
    var encodeRegExps = {
      specialChars: /[<>'"&]/g,
      nonAscii: /(?:[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
      nonAsciiPrintable: /(?:[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
      extensive: /(?:[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g
    };
    var defaultEncodeOptions = {
      mode: "specialChars",
      level: "all",
      numeric: "decimal"
    };
    function encode(text, _a) {
      var _b = _a === void 0 ? defaultEncodeOptions : _a, _c = _b.mode, mode = _c === void 0 ? "specialChars" : _c, _d = _b.numeric, numeric = _d === void 0 ? "decimal" : _d, _e = _b.level, level = _e === void 0 ? "all" : _e;
      if (!text) {
        return "";
      }
      var encodeRegExp = encodeRegExps[mode];
      var references = allNamedReferences[level].characters;
      var isHex = numeric === "hexadecimal";
      encodeRegExp.lastIndex = 0;
      var _b = encodeRegExp.exec(text);
      var _c;
      if (_b) {
        _c = "";
        var _d = 0;
        do {
          if (_d !== _b.index) {
            _c += text.substring(_d, _b.index);
          }
          var _e = _b[0];
          var result_1 = references[_e];
          if (!result_1) {
            var code_1 = _e.length > 1 ? surrogate_pairs_1.getCodePoint(_e, 0) : _e.charCodeAt(0);
            result_1 = (isHex ? "&#x" + code_1.toString(16) : "&#" + code_1) + ";";
          }
          _c += result_1;
          _d = _b.index + _e.length;
        } while (_b = encodeRegExp.exec(text));
        if (_d !== text.length) {
          _c += text.substring(_d);
        }
      } else {
        _c = text;
      }
      return _c;
    }
    exports.encode = encode;
    var defaultDecodeOptions = {
      scope: "body",
      level: "all"
    };
    var strict = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;
    var attribute = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
    var baseDecodeRegExps = {
      xml: {
        strict,
        attribute,
        body: named_references_1.bodyRegExps.xml
      },
      html4: {
        strict,
        attribute,
        body: named_references_1.bodyRegExps.html4
      },
      html5: {
        strict,
        attribute,
        body: named_references_1.bodyRegExps.html5
      }
    };
    var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), { all: baseDecodeRegExps.html5 });
    var fromCharCode = String.fromCharCode;
    var outOfBoundsChar = fromCharCode(65533);
    var defaultDecodeEntityOptions = {
      level: "all"
    };
    function decodeEntity(entity, _a) {
      var _b = (_a === void 0 ? defaultDecodeEntityOptions : _a).level, level = _b === void 0 ? "all" : _b;
      if (!entity) {
        return "";
      }
      var _b = entity;
      var decodeEntityLastChar_1 = entity[entity.length - 1];
      if (false) {
        _b = entity;
      } else if (false) {
        _b = entity;
      } else {
        var decodeResultByReference_1 = allNamedReferences[level].entities[entity];
        if (decodeResultByReference_1) {
          _b = decodeResultByReference_1;
        } else if (entity[0] === "&" && entity[1] === "#") {
          var decodeSecondChar_1 = entity[2];
          var decodeCode_1 = decodeSecondChar_1 == "x" || decodeSecondChar_1 == "X" ? parseInt(entity.substr(3), 16) : parseInt(entity.substr(2));
          _b = decodeCode_1 >= 1114111 ? outOfBoundsChar : decodeCode_1 > 65535 ? surrogate_pairs_1.fromCodePoint(decodeCode_1) : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_1] || decodeCode_1);
        }
      }
      return _b;
    }
    exports.decodeEntity = decodeEntity;
    function decode2(text, _a) {
      var decodeSecondChar_1 = _a === void 0 ? defaultDecodeOptions : _a, decodeCode_1 = decodeSecondChar_1.level, level = decodeCode_1 === void 0 ? "all" : decodeCode_1, _b = decodeSecondChar_1.scope, scope = _b === void 0 ? level === "xml" ? "strict" : "body" : _b;
      if (!text) {
        return "";
      }
      var decodeRegExp = decodeRegExps[level][scope];
      var references = allNamedReferences[level].entities;
      var isAttribute = scope === "attribute";
      var isStrict = scope === "strict";
      decodeRegExp.lastIndex = 0;
      var replaceMatch_1 = decodeRegExp.exec(text);
      var replaceResult_1;
      if (replaceMatch_1) {
        replaceResult_1 = "";
        var replaceLastIndex_1 = 0;
        do {
          if (replaceLastIndex_1 !== replaceMatch_1.index) {
            replaceResult_1 += text.substring(replaceLastIndex_1, replaceMatch_1.index);
          }
          var replaceInput_1 = replaceMatch_1[0];
          var decodeResult_1 = replaceInput_1;
          var decodeEntityLastChar_2 = replaceInput_1[replaceInput_1.length - 1];
          if (isAttribute && decodeEntityLastChar_2 === "=") {
            decodeResult_1 = replaceInput_1;
          } else if (isStrict && decodeEntityLastChar_2 !== ";") {
            decodeResult_1 = replaceInput_1;
          } else {
            var decodeResultByReference_2 = references[replaceInput_1];
            if (decodeResultByReference_2) {
              decodeResult_1 = decodeResultByReference_2;
            } else if (replaceInput_1[0] === "&" && replaceInput_1[1] === "#") {
              var decodeSecondChar_2 = replaceInput_1[2];
              var decodeCode_2 = decodeSecondChar_2 == "x" || decodeSecondChar_2 == "X" ? parseInt(replaceInput_1.substr(3), 16) : parseInt(replaceInput_1.substr(2));
              decodeResult_1 = decodeCode_2 >= 1114111 ? outOfBoundsChar : decodeCode_2 > 65535 ? surrogate_pairs_1.fromCodePoint(decodeCode_2) : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_2] || decodeCode_2);
            }
          }
          replaceResult_1 += decodeResult_1;
          replaceLastIndex_1 = replaceMatch_1.index + replaceInput_1.length;
        } while (replaceMatch_1 = decodeRegExp.exec(text));
        if (replaceLastIndex_1 !== text.length) {
          replaceResult_1 += text.substring(replaceLastIndex_1);
        }
      } else {
        replaceResult_1 = text;
      }
      return replaceResult_1;
    }
    exports.decode = decode2;
  }
});

// src/utils/linker.js
var isValid = (url = "") => {
  try {
    const ourl = new URL(url);
    return ourl !== null && ourl.protocol.startsWith("http");
  } catch (err) {
    return false;
  }
};
var blacklistKeys = [
  "CNDID",
  "__twitter_impression",
  "_hsenc",
  "_openstat",
  "action_object_map",
  "action_ref_map",
  "action_type_map",
  "amp",
  "fb_action_ids",
  "fb_action_types",
  "fb_ref",
  "fb_source",
  "fbclid",
  "ga_campaign",
  "ga_content",
  "ga_medium",
  "ga_place",
  "ga_source",
  "ga_term",
  "gs_l",
  "hmb_campaign",
  "hmb_medium",
  "hmb_source",
  "mbid",
  "mc_cid",
  "mc_eid",
  "mkt_tok",
  "referrer",
  "spJobID",
  "spMailingID",
  "spReportId",
  "spUserID",
  "utm_brand",
  "utm_campaign",
  "utm_cid",
  "utm_content",
  "utm_int",
  "utm_mailing",
  "utm_medium",
  "utm_name",
  "utm_place",
  "utm_pubreferrer",
  "utm_reader",
  "utm_social",
  "utm_source",
  "utm_swu",
  "utm_term",
  "utm_userid",
  "utm_viz_id",
  "wt_mc_o",
  "yclid",
  "WT.mc_id",
  "WT.mc_ev",
  "WT.srch",
  "pk_source",
  "pk_medium",
  "pk_campaign"
];
var purify = (url) => {
  try {
    const pureUrl = new URL(url);
    blacklistKeys.forEach((key) => {
      pureUrl.searchParams.delete(key);
    });
    return pureUrl.toString().replace(pureUrl.hash, "");
  } catch (err) {
    return null;
  }
};

// src/deno/cross-fetch.js
var cross_fetch_default = fetch;

// src/utils/retrieve.js
var profetch = async (url, proxy = {}) => {
  const {
    target,
    headers = {}
  } = proxy;
  const res = await cross_fetch_default(target + encodeURIComponent(url), {
    headers
  });
  return res;
};
var retrieve_default = async (url, options = {}) => {
  const {
    headers = {
      "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0"
    },
    proxy = null
  } = options;
  const res = proxy ? await profetch(url, proxy) : await cross_fetch_default(url, { headers });
  const status = res.status;
  if (status >= 400) {
    throw new Error(`Request failed with error code ${status}`);
  }
  const contentType = res.headers.get("content-type");
  const text = await res.text();
  if (/(\+|\/)(xml|html)/.test(contentType)) {
    return { type: "xml", text: text.trim(), status, contentType };
  }
  if (/(\+|\/)json/.test(contentType)) {
    try {
      const data = JSON.parse(text);
      return { type: "json", json: data, status, contentType };
    } catch (err) {
      throw new Error("Failed to convert data to JSON object");
    }
  }
  throw new Error(`Invalid content type: ${contentType}`);
};

// node_modules/.pnpm/bellajs@11.1.1/node_modules/bellajs/src/utils/detection.js
var ob2Str = (val) => {
  return {}.toString.call(val);
};
var isArray = (val) => {
  return Array.isArray(val);
};
var isString = (val) => {
  return String(val) === val;
};
var isNumber = (val) => {
  return Number(val) === val;
};
var isObject = (val) => {
  return ob2Str(val) === "[object Object]" && !isArray(val);
};
var hasProperty = (ob, k) => {
  if (!ob || !k) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(ob, k);
};

// node_modules/.pnpm/bellajs@11.1.1/node_modules/bellajs/src/utils/string.js
var toString = (input) => {
  const s = isNumber(input) ? String(input) : input;
  if (!isString(s)) {
    throw new Error("InvalidInput: String required.");
  }
  return s;
};
var truncate = (s, len = 140) => {
  const txt = toString(s);
  const txtlen = txt.length;
  if (txtlen <= len) {
    return txt;
  }
  const subtxt = txt.substring(0, len).trim();
  const subtxtArr = subtxt.split(" ");
  const subtxtLen = subtxtArr.length;
  if (subtxtLen > 1) {
    subtxtArr.pop();
    return subtxtArr.map((word) => word.trim()).join(" ") + "...";
  }
  return subtxt.substring(0, len - 3) + "...";
};
var stripTags = (s) => {
  return toString(s).replace(/(<([^>]+)>)/ig, "").trim();
};

// src/utils/xmlparser.js
var import_fast_xml_parser = __toESM(require_fxp(), 1);
var isRSS = (data = {}) => {
  return hasProperty(data, "rss") && hasProperty(data.rss, "channel");
};
var isAtom = (data = {}) => {
  return hasProperty(data, "feed") && hasProperty(data.feed, "entry");
};
var validate = (xml) => {
  return !isString(xml) || !xml.length ? false : import_fast_xml_parser.XMLValidator.validate(xml) === true;
};
var xml2obj = (xml = "", extraOptions = {}) => {
  const options = {
    ...extraOptions,
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  };
  const parser = new import_fast_xml_parser.XMLParser(options);
  const jsonObj = parser.parse(xml);
  return jsonObj;
};

// src/utils/normalizer.js
var import_html_entities = __toESM(require_lib(), 1);
var toISODateString = (dstr) => {
  try {
    return dstr ? new Date(dstr).toISOString() : "";
  } catch (err) {
    return "";
  }
};
var buildDescription = (val, maxlen) => {
  const stripped = stripTags(String(val));
  return truncate(stripped, maxlen).replace(/\n+/g, " ");
};
var getText = (val) => {
  const txt = isObject(val) ? val._text || val["#text"] || val._cdata || val.$t : val;
  return txt ? (0, import_html_entities.decode)(String(txt).trim()) : "";
};
var getLink = (val = [], id = "") => {
  if (id && isValid(id)) {
    return id;
  }
  if (isObject(id) && hasProperty(id, "@_isPermaLink") && id["@_isPermaLink"] === "true") {
    return getText(id);
  }
  const getEntryLink = (links) => {
    const items = links.map((item) => {
      return getLink(item);
    });
    return items.length > 0 ? items[0] : "";
  };
  return isString(val) ? getText(val) : isObject(val) && hasProperty(val, "href") ? getText(val.href) : isObject(val) && hasProperty(val, "@_href") ? getText(val["@_href"]) : isObject(val) && hasProperty(val, "@_url") ? getText(val["@_url"]) : isObject(val) && hasProperty(val, "_attributes") ? getText(val._attributes.href) : isArray(val) ? getEntryLink(val) : "";
};
var getPureUrl = (url, id = "") => {
  const link = getLink(url, id);
  return link ? purify(link) : "";
};
var hash = (str) => Math.abs(str.split("").reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)).toString(36);
var getEntryId = (id, url, pubDate) => {
  return id ? getText(id) : hash(getPureUrl(url)) + "-" + new Date(pubDate).getTime();
};
var getEnclosure = (val) => {
  const url = hasProperty(val, "@_url") ? val["@_url"] : "";
  const type = hasProperty(val, "@_type") ? val["@_type"] : "";
  const length = Number(hasProperty(val, "@_length") ? val["@_length"] : 0);
  return !url || !type ? null : {
    url,
    type,
    length
  };
};
var getCategory = (v) => {
  return isObject(v) ? {
    text: getText(v),
    domain: v["@_domain"]
  } : v;
};
var getOptionalTags = (val, key) => {
  if (key === "source") {
    return {
      text: getText(val),
      url: getLink(val)
    };
  }
  if (key === "category") {
    return isArray(val) ? val.map(getCategory) : getCategory(val);
  }
  if (key === "enclosure") {
    return getEnclosure(val);
  }
  return val;
};

// src/utils/parseJsonFeed.js
var transform = (item, options) => {
  const {
    useISODateFormat,
    descriptionMaxLen,
    getExtraEntryFields
  } = options;
  const {
    id = "",
    title = "",
    url: link = "",
    date_published: pubDate = "",
    summary = "",
    content_html: htmlContent = "",
    content_text: textContent = ""
  } = item;
  const published = useISODateFormat ? toISODateString(pubDate) : pubDate;
  const extraFields = getExtraEntryFields(item);
  const entry = {
    id: getEntryId(id, link, pubDate),
    title,
    link: purify(link),
    published,
    description: buildDescription(textContent || htmlContent || summary, descriptionMaxLen)
  };
  return {
    ...entry,
    ...extraFields
  };
};
var parseJson = (data, options) => {
  const {
    normalization,
    getExtraFeedFields
  } = options;
  if (!normalization) {
    return data;
  }
  const {
    title = "",
    home_page_url: homepageUrl = "",
    description = "",
    language = "",
    items: item = []
  } = data;
  const extraFields = getExtraFeedFields(data);
  const items = isArray(item) ? item : [item];
  return {
    title,
    link: purify(homepageUrl),
    description,
    language,
    published: "",
    generator: "",
    ...extraFields,
    entries: items.map((item2) => {
      return transform(item2, options);
    })
  };
};
var parseJsonFeed_default = (data, options = {}) => {
  return parseJson(data, options);
};

// src/utils/parseRssFeed.js
var transform2 = (item, options) => {
  const {
    useISODateFormat,
    descriptionMaxLen,
    getExtraEntryFields
  } = options;
  const {
    guid = "",
    title = "",
    link = "",
    pubDate = "",
    description = ""
  } = item;
  const published = useISODateFormat ? toISODateString(pubDate) : pubDate;
  const entry = {
    id: getEntryId(guid, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, guid),
    published,
    description: buildDescription(description, descriptionMaxLen)
  };
  const extraFields = getExtraEntryFields(item);
  return {
    ...entry,
    ...extraFields
  };
};
var flatten = (feed) => {
  const {
    title = "",
    link = "",
    item
  } = feed;
  const items = isArray(item) ? item : [item];
  const entries = items.map((entry) => {
    const {
      id,
      title: title2 = "",
      link: link2 = ""
    } = entry;
    const item2 = {
      ...entry,
      title: getText(title2),
      link: getPureUrl(link2, id)
    };
    const txtTags = "guid description source".split(" ");
    txtTags.forEach((key) => {
      if (hasProperty(entry, key)) {
        item2[key] = getText(entry[key]);
      }
    });
    const optionalProps = "source category enclosure author image".split(" ");
    optionalProps.forEach((key) => {
      if (hasProperty(item2, key)) {
        entry[key] = getOptionalTags(item2[key], key);
      }
    });
    return item2;
  });
  const output = {
    ...feed,
    title: getText(title),
    link: getPureUrl(link),
    item: isArray(item) ? entries : entries[0]
  };
  return output;
};
var parseRss = (data, options = {}) => {
  const {
    normalization,
    getExtraFeedFields
  } = options;
  if (!normalization) {
    return flatten(data.rss.channel);
  }
  const {
    title = "",
    link = "",
    description = "",
    generator = "",
    language = "",
    lastBuildDate = "",
    item = []
  } = data.rss.channel;
  const extraFields = getExtraFeedFields(data.rss.channel);
  const items = isArray(item) ? item : [item];
  const published = options.useISODateFormat ? toISODateString(lastBuildDate) : lastBuildDate;
  return {
    title: getText(title),
    link: getPureUrl(link),
    description,
    language,
    generator,
    published,
    ...extraFields,
    entries: items.map((item2) => {
      return transform2(item2, options);
    })
  };
};
var parseRssFeed_default = (data, options = {}) => {
  return parseRss(data, options);
};

// src/utils/parseAtomFeed.js
var transform3 = (item, options) => {
  const {
    useISODateFormat,
    descriptionMaxLen,
    getExtraEntryFields
  } = options;
  const {
    id = "",
    title = "",
    issued = "",
    modified = "",
    updated = "",
    published = "",
    link = "",
    summary = "",
    content = ""
  } = item;
  const pubDate = updated || modified || published || issued;
  const htmlContent = getText(content || summary);
  const entry = {
    id: getEntryId(id, link, pubDate),
    title: getText(title),
    link: getPureUrl(link, id),
    published: useISODateFormat ? toISODateString(pubDate) : pubDate,
    description: buildDescription(htmlContent || summary, descriptionMaxLen)
  };
  const extraFields = getExtraEntryFields(item);
  return {
    ...entry,
    ...extraFields
  };
};
var flatten2 = (feed) => {
  const {
    id,
    title = "",
    link = "",
    entry
  } = feed;
  const entries = isArray(entry) ? entry : [entry];
  const items = entries.map((entry2) => {
    const {
      id: id2,
      title: title2 = "",
      link: link2 = "",
      summary = "",
      content = ""
    } = entry2;
    const item = {
      ...entry2,
      title: getText(title2),
      link: getPureUrl(link2, id2)
    };
    if (hasProperty(item, "summary")) {
      item.summary = getText(summary);
    }
    if (hasProperty(item, "content")) {
      item.content = getText(content);
    }
    return item;
  });
  const output = {
    ...feed,
    title: getText(title),
    link: getPureUrl(link, id),
    entry: isArray(entry) ? items : items[0]
  };
  return output;
};
var parseAtom = (data, options = {}) => {
  const {
    normalization,
    getExtraFeedFields
  } = options;
  if (!normalization) {
    return flatten2(data.feed);
  }
  const {
    id = "",
    title = "",
    link = "",
    subtitle = "",
    generator = "",
    language = "",
    updated = "",
    entry: item = []
  } = data.feed;
  const extraFields = getExtraFeedFields(data.feed);
  const items = isArray(item) ? item : [item];
  const published = options.useISODateFormat ? toISODateString(updated) : updated;
  return {
    title: getText(title),
    link: getPureUrl(link, id),
    description: subtitle,
    language,
    generator,
    published,
    ...extraFields,
    entries: items.map((item2) => {
      return transform3(item2, options);
    })
  };
};
var parseAtomFeed_default = (data, options = {}) => {
  return parseAtom(data, options);
};

// src/main.js
var getopt = (options = {}) => {
  const {
    normalization = true,
    descriptionMaxLen = 210,
    useISODateFormat = true,
    xmlParserOptions = {},
    getExtraFeedFields = () => ({}),
    getExtraEntryFields = () => ({})
  } = options;
  return {
    normalization,
    descriptionMaxLen,
    useISODateFormat,
    xmlParserOptions,
    getExtraFeedFields,
    getExtraEntryFields
  };
};
var extractFromJson = (json, options = {}) => {
  return parseJsonFeed_default(json, getopt(options));
};
var extractFromXml = (xml, options = {}) => {
  if (!validate(xml)) {
    throw new Error("The XML document is not well-formed");
  }
  const opts = getopt(options);
  const data = xml2obj(xml, opts.xmlParserOptions);
  return isRSS(data) ? parseRssFeed_default(data, opts) : isAtom(data) ? parseAtomFeed_default(data, opts) : null;
};
var extract = async (url, options = {}, fetchOptions = {}) => {
  if (!isValid(url)) {
    throw new Error("Input param must be a valid URL");
  }
  const data = await retrieve_default(url, fetchOptions);
  if (!data.text && !data.json) {
    throw new Error(`Failed to load content from "${url}"`);
  }
  const { type, json, text } = data;
  return type === "json" ? extractFromJson(json, options) : extractFromXml(text, options);
};
var read = async (url, options, fetchOptions) => {
  console.warn("WARNING: read() is deprecated. Please use extract() instead!");
  return extract(url, options, fetchOptions);
};
export {
  extract,
  extractFromJson,
  extractFromXml,
  read
};

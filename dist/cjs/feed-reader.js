// feed-reader@5.0.0, by @ndaidong - built with esbuild at 2022-04-13T08:54:52.600Z - published under MIT license
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name2) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name2 + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug2(...args) {
          if (!debug2.enabled) {
            return;
          }
          const self = debug2;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug2.namespace = namespace;
        debug2.useColors = createDebug.useColors();
        debug2.color = createDebug.selectColor(namespace);
        debug2.extend = extend;
        debug2.destroy = createDebug.destroy;
        Object.defineProperty(debug2, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug2);
        }
        return debug2;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name2) {
        if (name2[name2.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name2)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name2)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module2) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error2) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error2) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error2) {
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error2) {
        return "[UnexpectedJSONParseError]: " + error2.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module2) {
    var tty = require("tty");
    var util = require("util");
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(() => {
    }, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error2) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name2, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name2} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name2 + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug2) {
      debug2.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug2.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/bellajs/dist/cjs/bella.js
var require_bella = __commonJS({
  "node_modules/bellajs/dist/cjs/bella.js"(exports, module2) {
    var S = Object.defineProperty;
    var U = Object.getOwnPropertyDescriptor;
    var q = Object.getOwnPropertyNames;
    var F = Object.prototype.hasOwnProperty;
    var R = (t) => S(t, "__esModule", { value: true });
    var z = (t, e) => {
      for (var r in e)
        S(t, r, { get: e[r], enumerable: true });
    };
    var B = (t, e, r, n) => {
      if (e && typeof e == "object" || typeof e == "function")
        for (let o of q(e))
          !F.call(t, o) && (r || o !== "default") && S(t, o, { get: () => e[o], enumerable: !(n = U(e, o)) || n.enumerable });
      return t;
    };
    var H = ((t) => (e, r) => t && t.get(e) || (r = B(R({}), e, 1), t && t.set(e, r), r))(typeof WeakMap != "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
    var gt = {};
    z(gt, { clone: () => M, compose: () => it, copies: () => I, curry: () => ct, equals: () => A, escapeHTML: () => Z, formatDateString: () => ot, formatTimeAgo: () => st, genid: () => et, hasProperty: () => a, isArray: () => u, isBoolean: () => V, isDate: () => h, isElement: () => G, isEmail: () => Y, isEmpty: () => d, isFunction: () => X, isInteger: () => $, isLetter: () => W, isNil: () => _, isNull: () => E, isNumber: () => y, isObject: () => l, isString: () => p, isUndefined: () => N, maybe: () => b, pick: () => at, pipe: () => ut, randint: () => O, replaceAll: () => w, shuffle: () => P, slugify: () => rt, sort: () => L, sortBy: () => ft, stripAccent: () => D, stripTags: () => Q, truncate: () => K, ucfirst: () => T, ucwords: () => tt, unescapeHTML: () => v, unique: () => lt });
    var m = (t) => ({}).toString.call(t);
    var $ = (t) => Number.isInteger(t);
    var u = (t) => Array.isArray(t);
    var p = (t) => String(t) === t;
    var y = (t) => Number(t) === t;
    var V = (t) => Boolean(t) === t;
    var E = (t) => m(t) === "[object Null]";
    var N = (t) => m(t) === "[object Undefined]";
    var _ = (t) => N(t) || E(t);
    var X = (t) => m(t) === "[object Function]";
    var l = (t) => m(t) === "[object Object]" && !u(t);
    var h = (t) => t instanceof Date && !isNaN(t.valueOf());
    var G = (t) => m(t).match(/^\[object HTML\w*Element]$/) !== null;
    var W = (t) => {
      let e = /^[a-z]+$/i;
      return p(t) && e.test(t);
    };
    var Y = (t) => {
      let e = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return p(t) && e.test(t);
    };
    var d = (t) => !t || _(t) || p(t) && t === "" || u(t) && t.length === 0 || l(t) && Object.keys(t).length === 0;
    var a = (t, e) => !t || !e ? false : Object.prototype.hasOwnProperty.call(t, e);
    var A = (t, e) => {
      if (d(t) && d(e))
        return true;
      if (h(t) && h(e))
        return t.getTime() === e.getTime();
      if (u(t) && u(e)) {
        if (t.length !== e.length)
          return false;
        let r = true;
        for (let n = 0; n < t.length; n++)
          if (!A(t[n], e[n])) {
            r = false;
            break;
          }
        return r;
      }
      if (l(t) && l(e)) {
        if (Object.keys(t).length !== Object.keys(e).length)
          return false;
        let r = true;
        for (let n in t)
          if (!a(e, n) || !A(t[n], e[n])) {
            r = false;
            break;
          }
        return r;
      }
      return t === e;
    };
    var J = Number.MAX_SAFE_INTEGER;
    var O = (t, e) => {
      if ((!t || t < 0) && (t = 0), e || (e = J), t === e)
        return e;
      t > e && (t = Math.min(t, e), e = Math.max(t, e));
      let r = t, n = e - t + 1;
      return Math.floor(Math.random() * n) + r;
    };
    var g = (t) => {
      let e = y(t) ? String(t) : t;
      if (!p(e))
        throw new Error("InvalidInput: String required.");
      return e;
    };
    var K = (t, e) => {
      let r = g(t), n = e || 140;
      if (r.length <= n)
        return r;
      let o = r.substring(0, n), s = o.split(" "), i = s.length, c = "";
      return i > 1 ? (s.pop(), c += s.join(" "), c.length < r.length && (c += "...")) : (o = o.substring(0, n - 3), c = o + "..."), c;
    };
    var Q = (t) => g(t).replace(/<.*?>/gi, " ").replace(/\s\s+/g, " ").trim();
    var Z = (t) => g(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    var v = (t) => g(t).replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    var T = (t) => {
      let e = g(t).toLowerCase();
      return e.length > 1 ? e.charAt(0).toUpperCase() + e.slice(1) : e.toUpperCase();
    };
    var tt = (t) => g(t).split(" ").map((e) => T(e)).join(" ");
    var w = (t, e, r) => {
      let n = g(t);
      if (y(e) && (e = String(e)), y(r) && (r = String(r)), p(e) && p(r))
        n = n.split(e).join(r);
      else if (u(e) && p(r))
        e.forEach((o) => {
          n = w(n, o, r);
        });
      else if (u(e) && u(r) && e.length === r.length) {
        let o = e.length;
        if (o > 0)
          for (let s = 0; s < o; s++) {
            let i = e[s], c = r[s];
            n = w(n, i, c);
          }
      }
      return n;
    };
    var D = (t) => {
      let e = g(t), r = { a: "á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|ä", A: "Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ|Ä", c: "ç", C: "Ç", d: "đ", D: "Đ", e: "é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|ë", E: "É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ|Ë", i: "í|ì|ỉ|ĩ|ị|ï|î", I: "Í|Ì|Ỉ|Ĩ|Ị|Ï|Î", o: "ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ö", O: "Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ô|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ|Ö", u: "ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|û", U: "Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự|Û", y: "ý|ỳ|ỷ|ỹ|ỵ", Y: "Ý|Ỳ|Ỷ|Ỹ|Ỵ" }, n = (o, s) => {
        e = w(e, o, s);
      };
      for (let o in r)
        a(r, o) && r[o].split("|").forEach((i) => n(i, o));
      return e;
    };
    var et = (t, e = "") => {
      let r = "abcdefghijklmnopqrstuvwxyz", n = r.toUpperCase(), s = [r, n, "0123456789"].join("").split("").sort(() => Math.random() > 0.5).join(""), i = s.length, c = Math.max(t || 32, e.length), f = e;
      for (; f.length < c; ) {
        let C = O(0, i);
        f += s.charAt(C) || "";
      }
      return f;
    };
    var rt = (t, e = "-") => D(t).trim().toLowerCase().replace(/\W+/g, " ").replace(/\s+/g, " ").replace(/\s/g, e);
    var k = { dateStyle: "medium", timeStyle: "long" };
    var j = { second: 1e3, minute: 60, hour: 60, day: 24, week: 7, month: 4, year: 12 };
    var nt = (t) => {
      try {
        return new Intl.Locale(t).language !== "";
      } catch {
        return false;
      }
    };
    var ot = (...t) => {
      let e = t[0], r = nt(t[1]) ? t[1] : "en", n = t.length >= 3 ? t[2] : t.length === 1 ? k : l(t[1]) ? t[1] : k;
      return new Intl.DateTimeFormat(r, n).format(new Date(e));
    };
    var st = (t, e = "en", r = "just now") => {
      let n = new Date(t), o = Date.now() - n;
      if (o <= j.second)
        return r;
      let s = "second";
      for (let c in j) {
        if (o < j[c])
          break;
        s = c, o /= j[c];
      }
      return o = Math.floor(o), new Intl.RelativeTimeFormat(e).format(-o, s);
    };
    var ct = (t) => {
      let e = t.length, r = (n, o) => n > 0 ? (...s) => r(n - s.length, [...o, ...s]) : t(...o);
      return r(e, []);
    };
    var it = (...t) => t.reduce((e, r) => (n) => e(r(n)));
    var ut = (...t) => t.reduce((e, r) => (n) => r(e(n)));
    var x = (t, e, r, n = {}) => {
      let { writable: o = false, configurable: s = false, enumerable: i = false } = n;
      Object.defineProperty(t, e, { value: r, writable: o, configurable: s, enumerable: i });
    };
    var b = (t) => {
      let e = t, r = () => e == null, n = () => e, o = (f) => b(e || f()), s = (f) => b(f(e) === true ? e : null), i = (f) => b(r() ? null : f(e)), c = /* @__PURE__ */ Object.create({});
      return x(c, "__value__", e, { enumerable: true }), x(c, "__type__", "Maybe", { enumerable: true }), x(c, "isNil", r), x(c, "value", n), x(c, "map", i), x(c, "if", s), x(c, "else", o), c;
    };
    var M = (t, e = null) => {
      let r = e || /* @__PURE__ */ new Set();
      if (r.has(t))
        return t;
      if (r.add(t), h(t))
        return new Date(t.valueOf());
      let n = (s) => {
        let i = /* @__PURE__ */ Object.create({});
        for (let c in s)
          a(s, c) && (i[c] = M(s[c], r));
        return i;
      }, o = (s) => [...s].map((i) => u(i) ? o(i) : l(i) ? n(i) : M(i, r));
      return u(t) ? o(t) : l(t) ? n(t) : t;
    };
    var I = (t, e, r = false, n = []) => {
      for (let o in t)
        if (!(n.length > 0 && n.includes(o)) && (!r || r && a(e, o))) {
          let s = t[o], i = e[o];
          l(i) && l(s) || u(i) && u(s) ? e[o] = I(s, e[o], r, n) : e[o] = M(s);
        }
      return e;
    };
    var lt = (t = []) => [...new Set(t)];
    var pt = (t, e) => t > e ? 1 : t < e ? -1 : 0;
    var L = (t = [], e = null) => {
      let r = [...t], n = e || pt;
      return r.sort(n), r;
    };
    var ft = (t = [], e = 1, r = "") => !p(r) || !a(t[0], r) ? t : L(t, (n, o) => n[r] > o[r] ? e : n[r] < o[r] ? -1 * e : 0);
    var P = (t = []) => {
      let e = [...t], r = [], n = e.length;
      for (; n > 0; ) {
        let o = Math.floor(Math.random() * n);
        r.push(e.splice(o, 1)[0]), n--;
      }
      return r;
    };
    var at = (t = [], e = 1) => {
      let r = P(t), n = Math.max(1, e), o = Math.min(n, r.length - 1);
      return r.splice(0, o);
    };
    module2.exports = H(gt);
  }
});

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports) {
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

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
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
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
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
                  return getErrorObject("InvalidTag", "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.", getLineNumberForPosition(xmlData, tagStartPos));
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
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
        col: lines[lines.length - 1].length + 1
      };
    }
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      allowBooleanAttributes: false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
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
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false
    };
    var buildOptions = function(options) {
      return Object.assign({}, defaultOptions, options);
    };
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module2) {
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
    module2.exports = XmlNode;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module2) {
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
            } else if (xmlData[i + 1] === "!" && xmlData[i + 2] === "-" && xmlData[i + 3] === "-") {
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
    module2.exports = readDocType;
  }
});

// node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/strnum/strnum.js"(exports, module2) {
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
    module2.exports = toNumber;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module2) {
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
          "amp": { regex: /&(amp|#38|#x26);/g, val: "&" },
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
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
          const aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
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
                attrs[aName] = parseValue(oldVal, this.options.parseAttributeValue, this.options.numberParseOptions);
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
              if (!val)
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
      }
      return val;
    };
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0)
          isLeafNode = Object.keys(currentNode.child).length === 0;
        textData = this.parseTextData(textData, currentNode.tagname, jPath, false, currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false, isLeafNode);
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
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && xmlData[i + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
          let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
          if (closeTagName === tagName) {
            return {
              tagContent: xmlData.substring(startIndex, i),
              i: closeIndex
            };
          }
          i = closeIndex;
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
    module2.exports = OrderedObjParser;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
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
          if (compressedObj[property] !== void 0) {
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

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module2) {
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
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
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module2.exports = XMLParser2;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module2) {
    var EOL = "\n";
    function toXml(jArray, options) {
      return arrToStr(jArray, options, "", 0);
    }
    function arrToStr(arr, options, jPath, level) {
      let xmlStr = "";
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL + "" + options.indentBy.repeat(level);
      }
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
          xmlStr += indentation + tagText;
          continue;
        } else if (tagName === options.cdataPropName) {
          xmlStr += indentation + `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          continue;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        let tagStart = indentation + `<${tagName}${attStr}`;
        let tagValue = arrToStr(tagObj[tagName], options, newJPath, level + 1);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode)
            xmlStr += tagStart + ">";
          else
            xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        }
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
    module2.exports = toXml;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module2) {
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
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: []
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
    function isAttribute(name2) {
      if (name2.startsWith(this.options.attributeNamePrefix)) {
        return name2.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    module2.exports = Builder;
  }
});

// node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/fast-xml-parser/src/fxp.js"(exports, module2) {
    "use strict";
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module2.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// node_modules/html-entities/lib/named-references.js
var require_named_references = __commonJS({
  "node_modules/html-entities/lib/named-references.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bodyRegExps = { xml: /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g, html4: /&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g, html5: /&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g };
    exports.namedReferences = { xml: { entities: { "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&amp;": "&" }, characters: { "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;", "&": "&amp;" } }, html4: { entities: { "&apos;": "'", "&nbsp": " ", "&nbsp;": " ", "&iexcl": "¡", "&iexcl;": "¡", "&cent": "¢", "&cent;": "¢", "&pound": "£", "&pound;": "£", "&curren": "¤", "&curren;": "¤", "&yen": "¥", "&yen;": "¥", "&brvbar": "¦", "&brvbar;": "¦", "&sect": "§", "&sect;": "§", "&uml": "¨", "&uml;": "¨", "&copy": "©", "&copy;": "©", "&ordf": "ª", "&ordf;": "ª", "&laquo": "«", "&laquo;": "«", "&not": "¬", "&not;": "¬", "&shy": "­", "&shy;": "­", "&reg": "®", "&reg;": "®", "&macr": "¯", "&macr;": "¯", "&deg": "°", "&deg;": "°", "&plusmn": "±", "&plusmn;": "±", "&sup2": "²", "&sup2;": "²", "&sup3": "³", "&sup3;": "³", "&acute": "´", "&acute;": "´", "&micro": "µ", "&micro;": "µ", "&para": "¶", "&para;": "¶", "&middot": "·", "&middot;": "·", "&cedil": "¸", "&cedil;": "¸", "&sup1": "¹", "&sup1;": "¹", "&ordm": "º", "&ordm;": "º", "&raquo": "»", "&raquo;": "»", "&frac14": "¼", "&frac14;": "¼", "&frac12": "½", "&frac12;": "½", "&frac34": "¾", "&frac34;": "¾", "&iquest": "¿", "&iquest;": "¿", "&Agrave": "À", "&Agrave;": "À", "&Aacute": "Á", "&Aacute;": "Á", "&Acirc": "Â", "&Acirc;": "Â", "&Atilde": "Ã", "&Atilde;": "Ã", "&Auml": "Ä", "&Auml;": "Ä", "&Aring": "Å", "&Aring;": "Å", "&AElig": "Æ", "&AElig;": "Æ", "&Ccedil": "Ç", "&Ccedil;": "Ç", "&Egrave": "È", "&Egrave;": "È", "&Eacute": "É", "&Eacute;": "É", "&Ecirc": "Ê", "&Ecirc;": "Ê", "&Euml": "Ë", "&Euml;": "Ë", "&Igrave": "Ì", "&Igrave;": "Ì", "&Iacute": "Í", "&Iacute;": "Í", "&Icirc": "Î", "&Icirc;": "Î", "&Iuml": "Ï", "&Iuml;": "Ï", "&ETH": "Ð", "&ETH;": "Ð", "&Ntilde": "Ñ", "&Ntilde;": "Ñ", "&Ograve": "Ò", "&Ograve;": "Ò", "&Oacute": "Ó", "&Oacute;": "Ó", "&Ocirc": "Ô", "&Ocirc;": "Ô", "&Otilde": "Õ", "&Otilde;": "Õ", "&Ouml": "Ö", "&Ouml;": "Ö", "&times": "×", "&times;": "×", "&Oslash": "Ø", "&Oslash;": "Ø", "&Ugrave": "Ù", "&Ugrave;": "Ù", "&Uacute": "Ú", "&Uacute;": "Ú", "&Ucirc": "Û", "&Ucirc;": "Û", "&Uuml": "Ü", "&Uuml;": "Ü", "&Yacute": "Ý", "&Yacute;": "Ý", "&THORN": "Þ", "&THORN;": "Þ", "&szlig": "ß", "&szlig;": "ß", "&agrave": "à", "&agrave;": "à", "&aacute": "á", "&aacute;": "á", "&acirc": "â", "&acirc;": "â", "&atilde": "ã", "&atilde;": "ã", "&auml": "ä", "&auml;": "ä", "&aring": "å", "&aring;": "å", "&aelig": "æ", "&aelig;": "æ", "&ccedil": "ç", "&ccedil;": "ç", "&egrave": "è", "&egrave;": "è", "&eacute": "é", "&eacute;": "é", "&ecirc": "ê", "&ecirc;": "ê", "&euml": "ë", "&euml;": "ë", "&igrave": "ì", "&igrave;": "ì", "&iacute": "í", "&iacute;": "í", "&icirc": "î", "&icirc;": "î", "&iuml": "ï", "&iuml;": "ï", "&eth": "ð", "&eth;": "ð", "&ntilde": "ñ", "&ntilde;": "ñ", "&ograve": "ò", "&ograve;": "ò", "&oacute": "ó", "&oacute;": "ó", "&ocirc": "ô", "&ocirc;": "ô", "&otilde": "õ", "&otilde;": "õ", "&ouml": "ö", "&ouml;": "ö", "&divide": "÷", "&divide;": "÷", "&oslash": "ø", "&oslash;": "ø", "&ugrave": "ù", "&ugrave;": "ù", "&uacute": "ú", "&uacute;": "ú", "&ucirc": "û", "&ucirc;": "û", "&uuml": "ü", "&uuml;": "ü", "&yacute": "ý", "&yacute;": "ý", "&thorn": "þ", "&thorn;": "þ", "&yuml": "ÿ", "&yuml;": "ÿ", "&quot": '"', "&quot;": '"', "&amp": "&", "&amp;": "&", "&lt": "<", "&lt;": "<", "&gt": ">", "&gt;": ">", "&OElig;": "Œ", "&oelig;": "œ", "&Scaron;": "Š", "&scaron;": "š", "&Yuml;": "Ÿ", "&circ;": "ˆ", "&tilde;": "˜", "&ensp;": " ", "&emsp;": " ", "&thinsp;": " ", "&zwnj;": "‌", "&zwj;": "‍", "&lrm;": "‎", "&rlm;": "‏", "&ndash;": "–", "&mdash;": "—", "&lsquo;": "‘", "&rsquo;": "’", "&sbquo;": "‚", "&ldquo;": "“", "&rdquo;": "”", "&bdquo;": "„", "&dagger;": "†", "&Dagger;": "‡", "&permil;": "‰", "&lsaquo;": "‹", "&rsaquo;": "›", "&euro;": "€", "&fnof;": "ƒ", "&Alpha;": "Α", "&Beta;": "Β", "&Gamma;": "Γ", "&Delta;": "Δ", "&Epsilon;": "Ε", "&Zeta;": "Ζ", "&Eta;": "Η", "&Theta;": "Θ", "&Iota;": "Ι", "&Kappa;": "Κ", "&Lambda;": "Λ", "&Mu;": "Μ", "&Nu;": "Ν", "&Xi;": "Ξ", "&Omicron;": "Ο", "&Pi;": "Π", "&Rho;": "Ρ", "&Sigma;": "Σ", "&Tau;": "Τ", "&Upsilon;": "Υ", "&Phi;": "Φ", "&Chi;": "Χ", "&Psi;": "Ψ", "&Omega;": "Ω", "&alpha;": "α", "&beta;": "β", "&gamma;": "γ", "&delta;": "δ", "&epsilon;": "ε", "&zeta;": "ζ", "&eta;": "η", "&theta;": "θ", "&iota;": "ι", "&kappa;": "κ", "&lambda;": "λ", "&mu;": "μ", "&nu;": "ν", "&xi;": "ξ", "&omicron;": "ο", "&pi;": "π", "&rho;": "ρ", "&sigmaf;": "ς", "&sigma;": "σ", "&tau;": "τ", "&upsilon;": "υ", "&phi;": "φ", "&chi;": "χ", "&psi;": "ψ", "&omega;": "ω", "&thetasym;": "ϑ", "&upsih;": "ϒ", "&piv;": "ϖ", "&bull;": "•", "&hellip;": "…", "&prime;": "′", "&Prime;": "″", "&oline;": "‾", "&frasl;": "⁄", "&weierp;": "℘", "&image;": "ℑ", "&real;": "ℜ", "&trade;": "™", "&alefsym;": "ℵ", "&larr;": "←", "&uarr;": "↑", "&rarr;": "→", "&darr;": "↓", "&harr;": "↔", "&crarr;": "↵", "&lArr;": "⇐", "&uArr;": "⇑", "&rArr;": "⇒", "&dArr;": "⇓", "&hArr;": "⇔", "&forall;": "∀", "&part;": "∂", "&exist;": "∃", "&empty;": "∅", "&nabla;": "∇", "&isin;": "∈", "&notin;": "∉", "&ni;": "∋", "&prod;": "∏", "&sum;": "∑", "&minus;": "−", "&lowast;": "∗", "&radic;": "√", "&prop;": "∝", "&infin;": "∞", "&ang;": "∠", "&and;": "∧", "&or;": "∨", "&cap;": "∩", "&cup;": "∪", "&int;": "∫", "&there4;": "∴", "&sim;": "∼", "&cong;": "≅", "&asymp;": "≈", "&ne;": "≠", "&equiv;": "≡", "&le;": "≤", "&ge;": "≥", "&sub;": "⊂", "&sup;": "⊃", "&nsub;": "⊄", "&sube;": "⊆", "&supe;": "⊇", "&oplus;": "⊕", "&otimes;": "⊗", "&perp;": "⊥", "&sdot;": "⋅", "&lceil;": "⌈", "&rceil;": "⌉", "&lfloor;": "⌊", "&rfloor;": "⌋", "&lang;": "〈", "&rang;": "〉", "&loz;": "◊", "&spades;": "♠", "&clubs;": "♣", "&hearts;": "♥", "&diams;": "♦" }, characters: { "'": "&apos;", " ": "&nbsp;", "¡": "&iexcl;", "¢": "&cent;", "£": "&pound;", "¤": "&curren;", "¥": "&yen;", "¦": "&brvbar;", "§": "&sect;", "¨": "&uml;", "©": "&copy;", "ª": "&ordf;", "«": "&laquo;", "¬": "&not;", "­": "&shy;", "®": "&reg;", "¯": "&macr;", "°": "&deg;", "±": "&plusmn;", "²": "&sup2;", "³": "&sup3;", "´": "&acute;", "µ": "&micro;", "¶": "&para;", "·": "&middot;", "¸": "&cedil;", "¹": "&sup1;", "º": "&ordm;", "»": "&raquo;", "¼": "&frac14;", "½": "&frac12;", "¾": "&frac34;", "¿": "&iquest;", "À": "&Agrave;", "Á": "&Aacute;", "Â": "&Acirc;", "Ã": "&Atilde;", "Ä": "&Auml;", "Å": "&Aring;", "Æ": "&AElig;", "Ç": "&Ccedil;", "È": "&Egrave;", "É": "&Eacute;", "Ê": "&Ecirc;", "Ë": "&Euml;", "Ì": "&Igrave;", "Í": "&Iacute;", "Î": "&Icirc;", "Ï": "&Iuml;", "Ð": "&ETH;", "Ñ": "&Ntilde;", "Ò": "&Ograve;", "Ó": "&Oacute;", "Ô": "&Ocirc;", "Õ": "&Otilde;", "Ö": "&Ouml;", "×": "&times;", "Ø": "&Oslash;", "Ù": "&Ugrave;", "Ú": "&Uacute;", "Û": "&Ucirc;", "Ü": "&Uuml;", "Ý": "&Yacute;", "Þ": "&THORN;", "ß": "&szlig;", "à": "&agrave;", "á": "&aacute;", "â": "&acirc;", "ã": "&atilde;", "ä": "&auml;", "å": "&aring;", "æ": "&aelig;", "ç": "&ccedil;", "è": "&egrave;", "é": "&eacute;", "ê": "&ecirc;", "ë": "&euml;", "ì": "&igrave;", "í": "&iacute;", "î": "&icirc;", "ï": "&iuml;", "ð": "&eth;", "ñ": "&ntilde;", "ò": "&ograve;", "ó": "&oacute;", "ô": "&ocirc;", "õ": "&otilde;", "ö": "&ouml;", "÷": "&divide;", "ø": "&oslash;", "ù": "&ugrave;", "ú": "&uacute;", "û": "&ucirc;", "ü": "&uuml;", "ý": "&yacute;", "þ": "&thorn;", "ÿ": "&yuml;", '"': "&quot;", "&": "&amp;", "<": "&lt;", ">": "&gt;", "Œ": "&OElig;", "œ": "&oelig;", "Š": "&Scaron;", "š": "&scaron;", "Ÿ": "&Yuml;", "ˆ": "&circ;", "˜": "&tilde;", " ": "&ensp;", " ": "&emsp;", " ": "&thinsp;", "‌": "&zwnj;", "‍": "&zwj;", "‎": "&lrm;", "‏": "&rlm;", "–": "&ndash;", "—": "&mdash;", "‘": "&lsquo;", "’": "&rsquo;", "‚": "&sbquo;", "“": "&ldquo;", "”": "&rdquo;", "„": "&bdquo;", "†": "&dagger;", "‡": "&Dagger;", "‰": "&permil;", "‹": "&lsaquo;", "›": "&rsaquo;", "€": "&euro;", "ƒ": "&fnof;", "Α": "&Alpha;", "Β": "&Beta;", "Γ": "&Gamma;", "Δ": "&Delta;", "Ε": "&Epsilon;", "Ζ": "&Zeta;", "Η": "&Eta;", "Θ": "&Theta;", "Ι": "&Iota;", "Κ": "&Kappa;", "Λ": "&Lambda;", "Μ": "&Mu;", "Ν": "&Nu;", "Ξ": "&Xi;", "Ο": "&Omicron;", "Π": "&Pi;", "Ρ": "&Rho;", "Σ": "&Sigma;", "Τ": "&Tau;", "Υ": "&Upsilon;", "Φ": "&Phi;", "Χ": "&Chi;", "Ψ": "&Psi;", "Ω": "&Omega;", "α": "&alpha;", "β": "&beta;", "γ": "&gamma;", "δ": "&delta;", "ε": "&epsilon;", "ζ": "&zeta;", "η": "&eta;", "θ": "&theta;", "ι": "&iota;", "κ": "&kappa;", "λ": "&lambda;", "μ": "&mu;", "ν": "&nu;", "ξ": "&xi;", "ο": "&omicron;", "π": "&pi;", "ρ": "&rho;", "ς": "&sigmaf;", "σ": "&sigma;", "τ": "&tau;", "υ": "&upsilon;", "φ": "&phi;", "χ": "&chi;", "ψ": "&psi;", "ω": "&omega;", "ϑ": "&thetasym;", "ϒ": "&upsih;", "ϖ": "&piv;", "•": "&bull;", "…": "&hellip;", "′": "&prime;", "″": "&Prime;", "‾": "&oline;", "⁄": "&frasl;", "℘": "&weierp;", "ℑ": "&image;", "ℜ": "&real;", "™": "&trade;", "ℵ": "&alefsym;", "←": "&larr;", "↑": "&uarr;", "→": "&rarr;", "↓": "&darr;", "↔": "&harr;", "↵": "&crarr;", "⇐": "&lArr;", "⇑": "&uArr;", "⇒": "&rArr;", "⇓": "&dArr;", "⇔": "&hArr;", "∀": "&forall;", "∂": "&part;", "∃": "&exist;", "∅": "&empty;", "∇": "&nabla;", "∈": "&isin;", "∉": "&notin;", "∋": "&ni;", "∏": "&prod;", "∑": "&sum;", "−": "&minus;", "∗": "&lowast;", "√": "&radic;", "∝": "&prop;", "∞": "&infin;", "∠": "&ang;", "∧": "&and;", "∨": "&or;", "∩": "&cap;", "∪": "&cup;", "∫": "&int;", "∴": "&there4;", "∼": "&sim;", "≅": "&cong;", "≈": "&asymp;", "≠": "&ne;", "≡": "&equiv;", "≤": "&le;", "≥": "&ge;", "⊂": "&sub;", "⊃": "&sup;", "⊄": "&nsub;", "⊆": "&sube;", "⊇": "&supe;", "⊕": "&oplus;", "⊗": "&otimes;", "⊥": "&perp;", "⋅": "&sdot;", "⌈": "&lceil;", "⌉": "&rceil;", "⌊": "&lfloor;", "⌋": "&rfloor;", "〈": "&lang;", "〉": "&rang;", "◊": "&loz;", "♠": "&spades;", "♣": "&clubs;", "♥": "&hearts;", "♦": "&diams;" } }, html5: { entities: { "&AElig": "Æ", "&AElig;": "Æ", "&AMP": "&", "&AMP;": "&", "&Aacute": "Á", "&Aacute;": "Á", "&Abreve;": "Ă", "&Acirc": "Â", "&Acirc;": "Â", "&Acy;": "А", "&Afr;": "𝔄", "&Agrave": "À", "&Agrave;": "À", "&Alpha;": "Α", "&Amacr;": "Ā", "&And;": "⩓", "&Aogon;": "Ą", "&Aopf;": "𝔸", "&ApplyFunction;": "⁡", "&Aring": "Å", "&Aring;": "Å", "&Ascr;": "𝒜", "&Assign;": "≔", "&Atilde": "Ã", "&Atilde;": "Ã", "&Auml": "Ä", "&Auml;": "Ä", "&Backslash;": "∖", "&Barv;": "⫧", "&Barwed;": "⌆", "&Bcy;": "Б", "&Because;": "∵", "&Bernoullis;": "ℬ", "&Beta;": "Β", "&Bfr;": "𝔅", "&Bopf;": "𝔹", "&Breve;": "˘", "&Bscr;": "ℬ", "&Bumpeq;": "≎", "&CHcy;": "Ч", "&COPY": "©", "&COPY;": "©", "&Cacute;": "Ć", "&Cap;": "⋒", "&CapitalDifferentialD;": "ⅅ", "&Cayleys;": "ℭ", "&Ccaron;": "Č", "&Ccedil": "Ç", "&Ccedil;": "Ç", "&Ccirc;": "Ĉ", "&Cconint;": "∰", "&Cdot;": "Ċ", "&Cedilla;": "¸", "&CenterDot;": "·", "&Cfr;": "ℭ", "&Chi;": "Χ", "&CircleDot;": "⊙", "&CircleMinus;": "⊖", "&CirclePlus;": "⊕", "&CircleTimes;": "⊗", "&ClockwiseContourIntegral;": "∲", "&CloseCurlyDoubleQuote;": "”", "&CloseCurlyQuote;": "’", "&Colon;": "∷", "&Colone;": "⩴", "&Congruent;": "≡", "&Conint;": "∯", "&ContourIntegral;": "∮", "&Copf;": "ℂ", "&Coproduct;": "∐", "&CounterClockwiseContourIntegral;": "∳", "&Cross;": "⨯", "&Cscr;": "𝒞", "&Cup;": "⋓", "&CupCap;": "≍", "&DD;": "ⅅ", "&DDotrahd;": "⤑", "&DJcy;": "Ђ", "&DScy;": "Ѕ", "&DZcy;": "Џ", "&Dagger;": "‡", "&Darr;": "↡", "&Dashv;": "⫤", "&Dcaron;": "Ď", "&Dcy;": "Д", "&Del;": "∇", "&Delta;": "Δ", "&Dfr;": "𝔇", "&DiacriticalAcute;": "´", "&DiacriticalDot;": "˙", "&DiacriticalDoubleAcute;": "˝", "&DiacriticalGrave;": "`", "&DiacriticalTilde;": "˜", "&Diamond;": "⋄", "&DifferentialD;": "ⅆ", "&Dopf;": "𝔻", "&Dot;": "¨", "&DotDot;": "⃜", "&DotEqual;": "≐", "&DoubleContourIntegral;": "∯", "&DoubleDot;": "¨", "&DoubleDownArrow;": "⇓", "&DoubleLeftArrow;": "⇐", "&DoubleLeftRightArrow;": "⇔", "&DoubleLeftTee;": "⫤", "&DoubleLongLeftArrow;": "⟸", "&DoubleLongLeftRightArrow;": "⟺", "&DoubleLongRightArrow;": "⟹", "&DoubleRightArrow;": "⇒", "&DoubleRightTee;": "⊨", "&DoubleUpArrow;": "⇑", "&DoubleUpDownArrow;": "⇕", "&DoubleVerticalBar;": "∥", "&DownArrow;": "↓", "&DownArrowBar;": "⤓", "&DownArrowUpArrow;": "⇵", "&DownBreve;": "̑", "&DownLeftRightVector;": "⥐", "&DownLeftTeeVector;": "⥞", "&DownLeftVector;": "↽", "&DownLeftVectorBar;": "⥖", "&DownRightTeeVector;": "⥟", "&DownRightVector;": "⇁", "&DownRightVectorBar;": "⥗", "&DownTee;": "⊤", "&DownTeeArrow;": "↧", "&Downarrow;": "⇓", "&Dscr;": "𝒟", "&Dstrok;": "Đ", "&ENG;": "Ŋ", "&ETH": "Ð", "&ETH;": "Ð", "&Eacute": "É", "&Eacute;": "É", "&Ecaron;": "Ě", "&Ecirc": "Ê", "&Ecirc;": "Ê", "&Ecy;": "Э", "&Edot;": "Ė", "&Efr;": "𝔈", "&Egrave": "È", "&Egrave;": "È", "&Element;": "∈", "&Emacr;": "Ē", "&EmptySmallSquare;": "◻", "&EmptyVerySmallSquare;": "▫", "&Eogon;": "Ę", "&Eopf;": "𝔼", "&Epsilon;": "Ε", "&Equal;": "⩵", "&EqualTilde;": "≂", "&Equilibrium;": "⇌", "&Escr;": "ℰ", "&Esim;": "⩳", "&Eta;": "Η", "&Euml": "Ë", "&Euml;": "Ë", "&Exists;": "∃", "&ExponentialE;": "ⅇ", "&Fcy;": "Ф", "&Ffr;": "𝔉", "&FilledSmallSquare;": "◼", "&FilledVerySmallSquare;": "▪", "&Fopf;": "𝔽", "&ForAll;": "∀", "&Fouriertrf;": "ℱ", "&Fscr;": "ℱ", "&GJcy;": "Ѓ", "&GT": ">", "&GT;": ">", "&Gamma;": "Γ", "&Gammad;": "Ϝ", "&Gbreve;": "Ğ", "&Gcedil;": "Ģ", "&Gcirc;": "Ĝ", "&Gcy;": "Г", "&Gdot;": "Ġ", "&Gfr;": "𝔊", "&Gg;": "⋙", "&Gopf;": "𝔾", "&GreaterEqual;": "≥", "&GreaterEqualLess;": "⋛", "&GreaterFullEqual;": "≧", "&GreaterGreater;": "⪢", "&GreaterLess;": "≷", "&GreaterSlantEqual;": "⩾", "&GreaterTilde;": "≳", "&Gscr;": "𝒢", "&Gt;": "≫", "&HARDcy;": "Ъ", "&Hacek;": "ˇ", "&Hat;": "^", "&Hcirc;": "Ĥ", "&Hfr;": "ℌ", "&HilbertSpace;": "ℋ", "&Hopf;": "ℍ", "&HorizontalLine;": "─", "&Hscr;": "ℋ", "&Hstrok;": "Ħ", "&HumpDownHump;": "≎", "&HumpEqual;": "≏", "&IEcy;": "Е", "&IJlig;": "Ĳ", "&IOcy;": "Ё", "&Iacute": "Í", "&Iacute;": "Í", "&Icirc": "Î", "&Icirc;": "Î", "&Icy;": "И", "&Idot;": "İ", "&Ifr;": "ℑ", "&Igrave": "Ì", "&Igrave;": "Ì", "&Im;": "ℑ", "&Imacr;": "Ī", "&ImaginaryI;": "ⅈ", "&Implies;": "⇒", "&Int;": "∬", "&Integral;": "∫", "&Intersection;": "⋂", "&InvisibleComma;": "⁣", "&InvisibleTimes;": "⁢", "&Iogon;": "Į", "&Iopf;": "𝕀", "&Iota;": "Ι", "&Iscr;": "ℐ", "&Itilde;": "Ĩ", "&Iukcy;": "І", "&Iuml": "Ï", "&Iuml;": "Ï", "&Jcirc;": "Ĵ", "&Jcy;": "Й", "&Jfr;": "𝔍", "&Jopf;": "𝕁", "&Jscr;": "𝒥", "&Jsercy;": "Ј", "&Jukcy;": "Є", "&KHcy;": "Х", "&KJcy;": "Ќ", "&Kappa;": "Κ", "&Kcedil;": "Ķ", "&Kcy;": "К", "&Kfr;": "𝔎", "&Kopf;": "𝕂", "&Kscr;": "𝒦", "&LJcy;": "Љ", "&LT": "<", "&LT;": "<", "&Lacute;": "Ĺ", "&Lambda;": "Λ", "&Lang;": "⟪", "&Laplacetrf;": "ℒ", "&Larr;": "↞", "&Lcaron;": "Ľ", "&Lcedil;": "Ļ", "&Lcy;": "Л", "&LeftAngleBracket;": "⟨", "&LeftArrow;": "←", "&LeftArrowBar;": "⇤", "&LeftArrowRightArrow;": "⇆", "&LeftCeiling;": "⌈", "&LeftDoubleBracket;": "⟦", "&LeftDownTeeVector;": "⥡", "&LeftDownVector;": "⇃", "&LeftDownVectorBar;": "⥙", "&LeftFloor;": "⌊", "&LeftRightArrow;": "↔", "&LeftRightVector;": "⥎", "&LeftTee;": "⊣", "&LeftTeeArrow;": "↤", "&LeftTeeVector;": "⥚", "&LeftTriangle;": "⊲", "&LeftTriangleBar;": "⧏", "&LeftTriangleEqual;": "⊴", "&LeftUpDownVector;": "⥑", "&LeftUpTeeVector;": "⥠", "&LeftUpVector;": "↿", "&LeftUpVectorBar;": "⥘", "&LeftVector;": "↼", "&LeftVectorBar;": "⥒", "&Leftarrow;": "⇐", "&Leftrightarrow;": "⇔", "&LessEqualGreater;": "⋚", "&LessFullEqual;": "≦", "&LessGreater;": "≶", "&LessLess;": "⪡", "&LessSlantEqual;": "⩽", "&LessTilde;": "≲", "&Lfr;": "𝔏", "&Ll;": "⋘", "&Lleftarrow;": "⇚", "&Lmidot;": "Ŀ", "&LongLeftArrow;": "⟵", "&LongLeftRightArrow;": "⟷", "&LongRightArrow;": "⟶", "&Longleftarrow;": "⟸", "&Longleftrightarrow;": "⟺", "&Longrightarrow;": "⟹", "&Lopf;": "𝕃", "&LowerLeftArrow;": "↙", "&LowerRightArrow;": "↘", "&Lscr;": "ℒ", "&Lsh;": "↰", "&Lstrok;": "Ł", "&Lt;": "≪", "&Map;": "⤅", "&Mcy;": "М", "&MediumSpace;": " ", "&Mellintrf;": "ℳ", "&Mfr;": "𝔐", "&MinusPlus;": "∓", "&Mopf;": "𝕄", "&Mscr;": "ℳ", "&Mu;": "Μ", "&NJcy;": "Њ", "&Nacute;": "Ń", "&Ncaron;": "Ň", "&Ncedil;": "Ņ", "&Ncy;": "Н", "&NegativeMediumSpace;": "​", "&NegativeThickSpace;": "​", "&NegativeThinSpace;": "​", "&NegativeVeryThinSpace;": "​", "&NestedGreaterGreater;": "≫", "&NestedLessLess;": "≪", "&NewLine;": "\n", "&Nfr;": "𝔑", "&NoBreak;": "⁠", "&NonBreakingSpace;": " ", "&Nopf;": "ℕ", "&Not;": "⫬", "&NotCongruent;": "≢", "&NotCupCap;": "≭", "&NotDoubleVerticalBar;": "∦", "&NotElement;": "∉", "&NotEqual;": "≠", "&NotEqualTilde;": "≂̸", "&NotExists;": "∄", "&NotGreater;": "≯", "&NotGreaterEqual;": "≱", "&NotGreaterFullEqual;": "≧̸", "&NotGreaterGreater;": "≫̸", "&NotGreaterLess;": "≹", "&NotGreaterSlantEqual;": "⩾̸", "&NotGreaterTilde;": "≵", "&NotHumpDownHump;": "≎̸", "&NotHumpEqual;": "≏̸", "&NotLeftTriangle;": "⋪", "&NotLeftTriangleBar;": "⧏̸", "&NotLeftTriangleEqual;": "⋬", "&NotLess;": "≮", "&NotLessEqual;": "≰", "&NotLessGreater;": "≸", "&NotLessLess;": "≪̸", "&NotLessSlantEqual;": "⩽̸", "&NotLessTilde;": "≴", "&NotNestedGreaterGreater;": "⪢̸", "&NotNestedLessLess;": "⪡̸", "&NotPrecedes;": "⊀", "&NotPrecedesEqual;": "⪯̸", "&NotPrecedesSlantEqual;": "⋠", "&NotReverseElement;": "∌", "&NotRightTriangle;": "⋫", "&NotRightTriangleBar;": "⧐̸", "&NotRightTriangleEqual;": "⋭", "&NotSquareSubset;": "⊏̸", "&NotSquareSubsetEqual;": "⋢", "&NotSquareSuperset;": "⊐̸", "&NotSquareSupersetEqual;": "⋣", "&NotSubset;": "⊂⃒", "&NotSubsetEqual;": "⊈", "&NotSucceeds;": "⊁", "&NotSucceedsEqual;": "⪰̸", "&NotSucceedsSlantEqual;": "⋡", "&NotSucceedsTilde;": "≿̸", "&NotSuperset;": "⊃⃒", "&NotSupersetEqual;": "⊉", "&NotTilde;": "≁", "&NotTildeEqual;": "≄", "&NotTildeFullEqual;": "≇", "&NotTildeTilde;": "≉", "&NotVerticalBar;": "∤", "&Nscr;": "𝒩", "&Ntilde": "Ñ", "&Ntilde;": "Ñ", "&Nu;": "Ν", "&OElig;": "Œ", "&Oacute": "Ó", "&Oacute;": "Ó", "&Ocirc": "Ô", "&Ocirc;": "Ô", "&Ocy;": "О", "&Odblac;": "Ő", "&Ofr;": "𝔒", "&Ograve": "Ò", "&Ograve;": "Ò", "&Omacr;": "Ō", "&Omega;": "Ω", "&Omicron;": "Ο", "&Oopf;": "𝕆", "&OpenCurlyDoubleQuote;": "“", "&OpenCurlyQuote;": "‘", "&Or;": "⩔", "&Oscr;": "𝒪", "&Oslash": "Ø", "&Oslash;": "Ø", "&Otilde": "Õ", "&Otilde;": "Õ", "&Otimes;": "⨷", "&Ouml": "Ö", "&Ouml;": "Ö", "&OverBar;": "‾", "&OverBrace;": "⏞", "&OverBracket;": "⎴", "&OverParenthesis;": "⏜", "&PartialD;": "∂", "&Pcy;": "П", "&Pfr;": "𝔓", "&Phi;": "Φ", "&Pi;": "Π", "&PlusMinus;": "±", "&Poincareplane;": "ℌ", "&Popf;": "ℙ", "&Pr;": "⪻", "&Precedes;": "≺", "&PrecedesEqual;": "⪯", "&PrecedesSlantEqual;": "≼", "&PrecedesTilde;": "≾", "&Prime;": "″", "&Product;": "∏", "&Proportion;": "∷", "&Proportional;": "∝", "&Pscr;": "𝒫", "&Psi;": "Ψ", "&QUOT": '"', "&QUOT;": '"', "&Qfr;": "𝔔", "&Qopf;": "ℚ", "&Qscr;": "𝒬", "&RBarr;": "⤐", "&REG": "®", "&REG;": "®", "&Racute;": "Ŕ", "&Rang;": "⟫", "&Rarr;": "↠", "&Rarrtl;": "⤖", "&Rcaron;": "Ř", "&Rcedil;": "Ŗ", "&Rcy;": "Р", "&Re;": "ℜ", "&ReverseElement;": "∋", "&ReverseEquilibrium;": "⇋", "&ReverseUpEquilibrium;": "⥯", "&Rfr;": "ℜ", "&Rho;": "Ρ", "&RightAngleBracket;": "⟩", "&RightArrow;": "→", "&RightArrowBar;": "⇥", "&RightArrowLeftArrow;": "⇄", "&RightCeiling;": "⌉", "&RightDoubleBracket;": "⟧", "&RightDownTeeVector;": "⥝", "&RightDownVector;": "⇂", "&RightDownVectorBar;": "⥕", "&RightFloor;": "⌋", "&RightTee;": "⊢", "&RightTeeArrow;": "↦", "&RightTeeVector;": "⥛", "&RightTriangle;": "⊳", "&RightTriangleBar;": "⧐", "&RightTriangleEqual;": "⊵", "&RightUpDownVector;": "⥏", "&RightUpTeeVector;": "⥜", "&RightUpVector;": "↾", "&RightUpVectorBar;": "⥔", "&RightVector;": "⇀", "&RightVectorBar;": "⥓", "&Rightarrow;": "⇒", "&Ropf;": "ℝ", "&RoundImplies;": "⥰", "&Rrightarrow;": "⇛", "&Rscr;": "ℛ", "&Rsh;": "↱", "&RuleDelayed;": "⧴", "&SHCHcy;": "Щ", "&SHcy;": "Ш", "&SOFTcy;": "Ь", "&Sacute;": "Ś", "&Sc;": "⪼", "&Scaron;": "Š", "&Scedil;": "Ş", "&Scirc;": "Ŝ", "&Scy;": "С", "&Sfr;": "𝔖", "&ShortDownArrow;": "↓", "&ShortLeftArrow;": "←", "&ShortRightArrow;": "→", "&ShortUpArrow;": "↑", "&Sigma;": "Σ", "&SmallCircle;": "∘", "&Sopf;": "𝕊", "&Sqrt;": "√", "&Square;": "□", "&SquareIntersection;": "⊓", "&SquareSubset;": "⊏", "&SquareSubsetEqual;": "⊑", "&SquareSuperset;": "⊐", "&SquareSupersetEqual;": "⊒", "&SquareUnion;": "⊔", "&Sscr;": "𝒮", "&Star;": "⋆", "&Sub;": "⋐", "&Subset;": "⋐", "&SubsetEqual;": "⊆", "&Succeeds;": "≻", "&SucceedsEqual;": "⪰", "&SucceedsSlantEqual;": "≽", "&SucceedsTilde;": "≿", "&SuchThat;": "∋", "&Sum;": "∑", "&Sup;": "⋑", "&Superset;": "⊃", "&SupersetEqual;": "⊇", "&Supset;": "⋑", "&THORN": "Þ", "&THORN;": "Þ", "&TRADE;": "™", "&TSHcy;": "Ћ", "&TScy;": "Ц", "&Tab;": "	", "&Tau;": "Τ", "&Tcaron;": "Ť", "&Tcedil;": "Ţ", "&Tcy;": "Т", "&Tfr;": "𝔗", "&Therefore;": "∴", "&Theta;": "Θ", "&ThickSpace;": "  ", "&ThinSpace;": " ", "&Tilde;": "∼", "&TildeEqual;": "≃", "&TildeFullEqual;": "≅", "&TildeTilde;": "≈", "&Topf;": "𝕋", "&TripleDot;": "⃛", "&Tscr;": "𝒯", "&Tstrok;": "Ŧ", "&Uacute": "Ú", "&Uacute;": "Ú", "&Uarr;": "↟", "&Uarrocir;": "⥉", "&Ubrcy;": "Ў", "&Ubreve;": "Ŭ", "&Ucirc": "Û", "&Ucirc;": "Û", "&Ucy;": "У", "&Udblac;": "Ű", "&Ufr;": "𝔘", "&Ugrave": "Ù", "&Ugrave;": "Ù", "&Umacr;": "Ū", "&UnderBar;": "_", "&UnderBrace;": "⏟", "&UnderBracket;": "⎵", "&UnderParenthesis;": "⏝", "&Union;": "⋃", "&UnionPlus;": "⊎", "&Uogon;": "Ų", "&Uopf;": "𝕌", "&UpArrow;": "↑", "&UpArrowBar;": "⤒", "&UpArrowDownArrow;": "⇅", "&UpDownArrow;": "↕", "&UpEquilibrium;": "⥮", "&UpTee;": "⊥", "&UpTeeArrow;": "↥", "&Uparrow;": "⇑", "&Updownarrow;": "⇕", "&UpperLeftArrow;": "↖", "&UpperRightArrow;": "↗", "&Upsi;": "ϒ", "&Upsilon;": "Υ", "&Uring;": "Ů", "&Uscr;": "𝒰", "&Utilde;": "Ũ", "&Uuml": "Ü", "&Uuml;": "Ü", "&VDash;": "⊫", "&Vbar;": "⫫", "&Vcy;": "В", "&Vdash;": "⊩", "&Vdashl;": "⫦", "&Vee;": "⋁", "&Verbar;": "‖", "&Vert;": "‖", "&VerticalBar;": "∣", "&VerticalLine;": "|", "&VerticalSeparator;": "❘", "&VerticalTilde;": "≀", "&VeryThinSpace;": " ", "&Vfr;": "𝔙", "&Vopf;": "𝕍", "&Vscr;": "𝒱", "&Vvdash;": "⊪", "&Wcirc;": "Ŵ", "&Wedge;": "⋀", "&Wfr;": "𝔚", "&Wopf;": "𝕎", "&Wscr;": "𝒲", "&Xfr;": "𝔛", "&Xi;": "Ξ", "&Xopf;": "𝕏", "&Xscr;": "𝒳", "&YAcy;": "Я", "&YIcy;": "Ї", "&YUcy;": "Ю", "&Yacute": "Ý", "&Yacute;": "Ý", "&Ycirc;": "Ŷ", "&Ycy;": "Ы", "&Yfr;": "𝔜", "&Yopf;": "𝕐", "&Yscr;": "𝒴", "&Yuml;": "Ÿ", "&ZHcy;": "Ж", "&Zacute;": "Ź", "&Zcaron;": "Ž", "&Zcy;": "З", "&Zdot;": "Ż", "&ZeroWidthSpace;": "​", "&Zeta;": "Ζ", "&Zfr;": "ℨ", "&Zopf;": "ℤ", "&Zscr;": "𝒵", "&aacute": "á", "&aacute;": "á", "&abreve;": "ă", "&ac;": "∾", "&acE;": "∾̳", "&acd;": "∿", "&acirc": "â", "&acirc;": "â", "&acute": "´", "&acute;": "´", "&acy;": "а", "&aelig": "æ", "&aelig;": "æ", "&af;": "⁡", "&afr;": "𝔞", "&agrave": "à", "&agrave;": "à", "&alefsym;": "ℵ", "&aleph;": "ℵ", "&alpha;": "α", "&amacr;": "ā", "&amalg;": "⨿", "&amp": "&", "&amp;": "&", "&and;": "∧", "&andand;": "⩕", "&andd;": "⩜", "&andslope;": "⩘", "&andv;": "⩚", "&ang;": "∠", "&ange;": "⦤", "&angle;": "∠", "&angmsd;": "∡", "&angmsdaa;": "⦨", "&angmsdab;": "⦩", "&angmsdac;": "⦪", "&angmsdad;": "⦫", "&angmsdae;": "⦬", "&angmsdaf;": "⦭", "&angmsdag;": "⦮", "&angmsdah;": "⦯", "&angrt;": "∟", "&angrtvb;": "⊾", "&angrtvbd;": "⦝", "&angsph;": "∢", "&angst;": "Å", "&angzarr;": "⍼", "&aogon;": "ą", "&aopf;": "𝕒", "&ap;": "≈", "&apE;": "⩰", "&apacir;": "⩯", "&ape;": "≊", "&apid;": "≋", "&apos;": "'", "&approx;": "≈", "&approxeq;": "≊", "&aring": "å", "&aring;": "å", "&ascr;": "𝒶", "&ast;": "*", "&asymp;": "≈", "&asympeq;": "≍", "&atilde": "ã", "&atilde;": "ã", "&auml": "ä", "&auml;": "ä", "&awconint;": "∳", "&awint;": "⨑", "&bNot;": "⫭", "&backcong;": "≌", "&backepsilon;": "϶", "&backprime;": "‵", "&backsim;": "∽", "&backsimeq;": "⋍", "&barvee;": "⊽", "&barwed;": "⌅", "&barwedge;": "⌅", "&bbrk;": "⎵", "&bbrktbrk;": "⎶", "&bcong;": "≌", "&bcy;": "б", "&bdquo;": "„", "&becaus;": "∵", "&because;": "∵", "&bemptyv;": "⦰", "&bepsi;": "϶", "&bernou;": "ℬ", "&beta;": "β", "&beth;": "ℶ", "&between;": "≬", "&bfr;": "𝔟", "&bigcap;": "⋂", "&bigcirc;": "◯", "&bigcup;": "⋃", "&bigodot;": "⨀", "&bigoplus;": "⨁", "&bigotimes;": "⨂", "&bigsqcup;": "⨆", "&bigstar;": "★", "&bigtriangledown;": "▽", "&bigtriangleup;": "△", "&biguplus;": "⨄", "&bigvee;": "⋁", "&bigwedge;": "⋀", "&bkarow;": "⤍", "&blacklozenge;": "⧫", "&blacksquare;": "▪", "&blacktriangle;": "▴", "&blacktriangledown;": "▾", "&blacktriangleleft;": "◂", "&blacktriangleright;": "▸", "&blank;": "␣", "&blk12;": "▒", "&blk14;": "░", "&blk34;": "▓", "&block;": "█", "&bne;": "=⃥", "&bnequiv;": "≡⃥", "&bnot;": "⌐", "&bopf;": "𝕓", "&bot;": "⊥", "&bottom;": "⊥", "&bowtie;": "⋈", "&boxDL;": "╗", "&boxDR;": "╔", "&boxDl;": "╖", "&boxDr;": "╓", "&boxH;": "═", "&boxHD;": "╦", "&boxHU;": "╩", "&boxHd;": "╤", "&boxHu;": "╧", "&boxUL;": "╝", "&boxUR;": "╚", "&boxUl;": "╜", "&boxUr;": "╙", "&boxV;": "║", "&boxVH;": "╬", "&boxVL;": "╣", "&boxVR;": "╠", "&boxVh;": "╫", "&boxVl;": "╢", "&boxVr;": "╟", "&boxbox;": "⧉", "&boxdL;": "╕", "&boxdR;": "╒", "&boxdl;": "┐", "&boxdr;": "┌", "&boxh;": "─", "&boxhD;": "╥", "&boxhU;": "╨", "&boxhd;": "┬", "&boxhu;": "┴", "&boxminus;": "⊟", "&boxplus;": "⊞", "&boxtimes;": "⊠", "&boxuL;": "╛", "&boxuR;": "╘", "&boxul;": "┘", "&boxur;": "└", "&boxv;": "│", "&boxvH;": "╪", "&boxvL;": "╡", "&boxvR;": "╞", "&boxvh;": "┼", "&boxvl;": "┤", "&boxvr;": "├", "&bprime;": "‵", "&breve;": "˘", "&brvbar": "¦", "&brvbar;": "¦", "&bscr;": "𝒷", "&bsemi;": "⁏", "&bsim;": "∽", "&bsime;": "⋍", "&bsol;": "\\", "&bsolb;": "⧅", "&bsolhsub;": "⟈", "&bull;": "•", "&bullet;": "•", "&bump;": "≎", "&bumpE;": "⪮", "&bumpe;": "≏", "&bumpeq;": "≏", "&cacute;": "ć", "&cap;": "∩", "&capand;": "⩄", "&capbrcup;": "⩉", "&capcap;": "⩋", "&capcup;": "⩇", "&capdot;": "⩀", "&caps;": "∩︀", "&caret;": "⁁", "&caron;": "ˇ", "&ccaps;": "⩍", "&ccaron;": "č", "&ccedil": "ç", "&ccedil;": "ç", "&ccirc;": "ĉ", "&ccups;": "⩌", "&ccupssm;": "⩐", "&cdot;": "ċ", "&cedil": "¸", "&cedil;": "¸", "&cemptyv;": "⦲", "&cent": "¢", "&cent;": "¢", "&centerdot;": "·", "&cfr;": "𝔠", "&chcy;": "ч", "&check;": "✓", "&checkmark;": "✓", "&chi;": "χ", "&cir;": "○", "&cirE;": "⧃", "&circ;": "ˆ", "&circeq;": "≗", "&circlearrowleft;": "↺", "&circlearrowright;": "↻", "&circledR;": "®", "&circledS;": "Ⓢ", "&circledast;": "⊛", "&circledcirc;": "⊚", "&circleddash;": "⊝", "&cire;": "≗", "&cirfnint;": "⨐", "&cirmid;": "⫯", "&cirscir;": "⧂", "&clubs;": "♣", "&clubsuit;": "♣", "&colon;": ":", "&colone;": "≔", "&coloneq;": "≔", "&comma;": ",", "&commat;": "@", "&comp;": "∁", "&compfn;": "∘", "&complement;": "∁", "&complexes;": "ℂ", "&cong;": "≅", "&congdot;": "⩭", "&conint;": "∮", "&copf;": "𝕔", "&coprod;": "∐", "&copy": "©", "&copy;": "©", "&copysr;": "℗", "&crarr;": "↵", "&cross;": "✗", "&cscr;": "𝒸", "&csub;": "⫏", "&csube;": "⫑", "&csup;": "⫐", "&csupe;": "⫒", "&ctdot;": "⋯", "&cudarrl;": "⤸", "&cudarrr;": "⤵", "&cuepr;": "⋞", "&cuesc;": "⋟", "&cularr;": "↶", "&cularrp;": "⤽", "&cup;": "∪", "&cupbrcap;": "⩈", "&cupcap;": "⩆", "&cupcup;": "⩊", "&cupdot;": "⊍", "&cupor;": "⩅", "&cups;": "∪︀", "&curarr;": "↷", "&curarrm;": "⤼", "&curlyeqprec;": "⋞", "&curlyeqsucc;": "⋟", "&curlyvee;": "⋎", "&curlywedge;": "⋏", "&curren": "¤", "&curren;": "¤", "&curvearrowleft;": "↶", "&curvearrowright;": "↷", "&cuvee;": "⋎", "&cuwed;": "⋏", "&cwconint;": "∲", "&cwint;": "∱", "&cylcty;": "⌭", "&dArr;": "⇓", "&dHar;": "⥥", "&dagger;": "†", "&daleth;": "ℸ", "&darr;": "↓", "&dash;": "‐", "&dashv;": "⊣", "&dbkarow;": "⤏", "&dblac;": "˝", "&dcaron;": "ď", "&dcy;": "д", "&dd;": "ⅆ", "&ddagger;": "‡", "&ddarr;": "⇊", "&ddotseq;": "⩷", "&deg": "°", "&deg;": "°", "&delta;": "δ", "&demptyv;": "⦱", "&dfisht;": "⥿", "&dfr;": "𝔡", "&dharl;": "⇃", "&dharr;": "⇂", "&diam;": "⋄", "&diamond;": "⋄", "&diamondsuit;": "♦", "&diams;": "♦", "&die;": "¨", "&digamma;": "ϝ", "&disin;": "⋲", "&div;": "÷", "&divide": "÷", "&divide;": "÷", "&divideontimes;": "⋇", "&divonx;": "⋇", "&djcy;": "ђ", "&dlcorn;": "⌞", "&dlcrop;": "⌍", "&dollar;": "$", "&dopf;": "𝕕", "&dot;": "˙", "&doteq;": "≐", "&doteqdot;": "≑", "&dotminus;": "∸", "&dotplus;": "∔", "&dotsquare;": "⊡", "&doublebarwedge;": "⌆", "&downarrow;": "↓", "&downdownarrows;": "⇊", "&downharpoonleft;": "⇃", "&downharpoonright;": "⇂", "&drbkarow;": "⤐", "&drcorn;": "⌟", "&drcrop;": "⌌", "&dscr;": "𝒹", "&dscy;": "ѕ", "&dsol;": "⧶", "&dstrok;": "đ", "&dtdot;": "⋱", "&dtri;": "▿", "&dtrif;": "▾", "&duarr;": "⇵", "&duhar;": "⥯", "&dwangle;": "⦦", "&dzcy;": "џ", "&dzigrarr;": "⟿", "&eDDot;": "⩷", "&eDot;": "≑", "&eacute": "é", "&eacute;": "é", "&easter;": "⩮", "&ecaron;": "ě", "&ecir;": "≖", "&ecirc": "ê", "&ecirc;": "ê", "&ecolon;": "≕", "&ecy;": "э", "&edot;": "ė", "&ee;": "ⅇ", "&efDot;": "≒", "&efr;": "𝔢", "&eg;": "⪚", "&egrave": "è", "&egrave;": "è", "&egs;": "⪖", "&egsdot;": "⪘", "&el;": "⪙", "&elinters;": "⏧", "&ell;": "ℓ", "&els;": "⪕", "&elsdot;": "⪗", "&emacr;": "ē", "&empty;": "∅", "&emptyset;": "∅", "&emptyv;": "∅", "&emsp13;": " ", "&emsp14;": " ", "&emsp;": " ", "&eng;": "ŋ", "&ensp;": " ", "&eogon;": "ę", "&eopf;": "𝕖", "&epar;": "⋕", "&eparsl;": "⧣", "&eplus;": "⩱", "&epsi;": "ε", "&epsilon;": "ε", "&epsiv;": "ϵ", "&eqcirc;": "≖", "&eqcolon;": "≕", "&eqsim;": "≂", "&eqslantgtr;": "⪖", "&eqslantless;": "⪕", "&equals;": "=", "&equest;": "≟", "&equiv;": "≡", "&equivDD;": "⩸", "&eqvparsl;": "⧥", "&erDot;": "≓", "&erarr;": "⥱", "&escr;": "ℯ", "&esdot;": "≐", "&esim;": "≂", "&eta;": "η", "&eth": "ð", "&eth;": "ð", "&euml": "ë", "&euml;": "ë", "&euro;": "€", "&excl;": "!", "&exist;": "∃", "&expectation;": "ℰ", "&exponentiale;": "ⅇ", "&fallingdotseq;": "≒", "&fcy;": "ф", "&female;": "♀", "&ffilig;": "ﬃ", "&fflig;": "ﬀ", "&ffllig;": "ﬄ", "&ffr;": "𝔣", "&filig;": "ﬁ", "&fjlig;": "fj", "&flat;": "♭", "&fllig;": "ﬂ", "&fltns;": "▱", "&fnof;": "ƒ", "&fopf;": "𝕗", "&forall;": "∀", "&fork;": "⋔", "&forkv;": "⫙", "&fpartint;": "⨍", "&frac12": "½", "&frac12;": "½", "&frac13;": "⅓", "&frac14": "¼", "&frac14;": "¼", "&frac15;": "⅕", "&frac16;": "⅙", "&frac18;": "⅛", "&frac23;": "⅔", "&frac25;": "⅖", "&frac34": "¾", "&frac34;": "¾", "&frac35;": "⅗", "&frac38;": "⅜", "&frac45;": "⅘", "&frac56;": "⅚", "&frac58;": "⅝", "&frac78;": "⅞", "&frasl;": "⁄", "&frown;": "⌢", "&fscr;": "𝒻", "&gE;": "≧", "&gEl;": "⪌", "&gacute;": "ǵ", "&gamma;": "γ", "&gammad;": "ϝ", "&gap;": "⪆", "&gbreve;": "ğ", "&gcirc;": "ĝ", "&gcy;": "г", "&gdot;": "ġ", "&ge;": "≥", "&gel;": "⋛", "&geq;": "≥", "&geqq;": "≧", "&geqslant;": "⩾", "&ges;": "⩾", "&gescc;": "⪩", "&gesdot;": "⪀", "&gesdoto;": "⪂", "&gesdotol;": "⪄", "&gesl;": "⋛︀", "&gesles;": "⪔", "&gfr;": "𝔤", "&gg;": "≫", "&ggg;": "⋙", "&gimel;": "ℷ", "&gjcy;": "ѓ", "&gl;": "≷", "&glE;": "⪒", "&gla;": "⪥", "&glj;": "⪤", "&gnE;": "≩", "&gnap;": "⪊", "&gnapprox;": "⪊", "&gne;": "⪈", "&gneq;": "⪈", "&gneqq;": "≩", "&gnsim;": "⋧", "&gopf;": "𝕘", "&grave;": "`", "&gscr;": "ℊ", "&gsim;": "≳", "&gsime;": "⪎", "&gsiml;": "⪐", "&gt": ">", "&gt;": ">", "&gtcc;": "⪧", "&gtcir;": "⩺", "&gtdot;": "⋗", "&gtlPar;": "⦕", "&gtquest;": "⩼", "&gtrapprox;": "⪆", "&gtrarr;": "⥸", "&gtrdot;": "⋗", "&gtreqless;": "⋛", "&gtreqqless;": "⪌", "&gtrless;": "≷", "&gtrsim;": "≳", "&gvertneqq;": "≩︀", "&gvnE;": "≩︀", "&hArr;": "⇔", "&hairsp;": " ", "&half;": "½", "&hamilt;": "ℋ", "&hardcy;": "ъ", "&harr;": "↔", "&harrcir;": "⥈", "&harrw;": "↭", "&hbar;": "ℏ", "&hcirc;": "ĥ", "&hearts;": "♥", "&heartsuit;": "♥", "&hellip;": "…", "&hercon;": "⊹", "&hfr;": "𝔥", "&hksearow;": "⤥", "&hkswarow;": "⤦", "&hoarr;": "⇿", "&homtht;": "∻", "&hookleftarrow;": "↩", "&hookrightarrow;": "↪", "&hopf;": "𝕙", "&horbar;": "―", "&hscr;": "𝒽", "&hslash;": "ℏ", "&hstrok;": "ħ", "&hybull;": "⁃", "&hyphen;": "‐", "&iacute": "í", "&iacute;": "í", "&ic;": "⁣", "&icirc": "î", "&icirc;": "î", "&icy;": "и", "&iecy;": "е", "&iexcl": "¡", "&iexcl;": "¡", "&iff;": "⇔", "&ifr;": "𝔦", "&igrave": "ì", "&igrave;": "ì", "&ii;": "ⅈ", "&iiiint;": "⨌", "&iiint;": "∭", "&iinfin;": "⧜", "&iiota;": "℩", "&ijlig;": "ĳ", "&imacr;": "ī", "&image;": "ℑ", "&imagline;": "ℐ", "&imagpart;": "ℑ", "&imath;": "ı", "&imof;": "⊷", "&imped;": "Ƶ", "&in;": "∈", "&incare;": "℅", "&infin;": "∞", "&infintie;": "⧝", "&inodot;": "ı", "&int;": "∫", "&intcal;": "⊺", "&integers;": "ℤ", "&intercal;": "⊺", "&intlarhk;": "⨗", "&intprod;": "⨼", "&iocy;": "ё", "&iogon;": "į", "&iopf;": "𝕚", "&iota;": "ι", "&iprod;": "⨼", "&iquest": "¿", "&iquest;": "¿", "&iscr;": "𝒾", "&isin;": "∈", "&isinE;": "⋹", "&isindot;": "⋵", "&isins;": "⋴", "&isinsv;": "⋳", "&isinv;": "∈", "&it;": "⁢", "&itilde;": "ĩ", "&iukcy;": "і", "&iuml": "ï", "&iuml;": "ï", "&jcirc;": "ĵ", "&jcy;": "й", "&jfr;": "𝔧", "&jmath;": "ȷ", "&jopf;": "𝕛", "&jscr;": "𝒿", "&jsercy;": "ј", "&jukcy;": "є", "&kappa;": "κ", "&kappav;": "ϰ", "&kcedil;": "ķ", "&kcy;": "к", "&kfr;": "𝔨", "&kgreen;": "ĸ", "&khcy;": "х", "&kjcy;": "ќ", "&kopf;": "𝕜", "&kscr;": "𝓀", "&lAarr;": "⇚", "&lArr;": "⇐", "&lAtail;": "⤛", "&lBarr;": "⤎", "&lE;": "≦", "&lEg;": "⪋", "&lHar;": "⥢", "&lacute;": "ĺ", "&laemptyv;": "⦴", "&lagran;": "ℒ", "&lambda;": "λ", "&lang;": "⟨", "&langd;": "⦑", "&langle;": "⟨", "&lap;": "⪅", "&laquo": "«", "&laquo;": "«", "&larr;": "←", "&larrb;": "⇤", "&larrbfs;": "⤟", "&larrfs;": "⤝", "&larrhk;": "↩", "&larrlp;": "↫", "&larrpl;": "⤹", "&larrsim;": "⥳", "&larrtl;": "↢", "&lat;": "⪫", "&latail;": "⤙", "&late;": "⪭", "&lates;": "⪭︀", "&lbarr;": "⤌", "&lbbrk;": "❲", "&lbrace;": "{", "&lbrack;": "[", "&lbrke;": "⦋", "&lbrksld;": "⦏", "&lbrkslu;": "⦍", "&lcaron;": "ľ", "&lcedil;": "ļ", "&lceil;": "⌈", "&lcub;": "{", "&lcy;": "л", "&ldca;": "⤶", "&ldquo;": "“", "&ldquor;": "„", "&ldrdhar;": "⥧", "&ldrushar;": "⥋", "&ldsh;": "↲", "&le;": "≤", "&leftarrow;": "←", "&leftarrowtail;": "↢", "&leftharpoondown;": "↽", "&leftharpoonup;": "↼", "&leftleftarrows;": "⇇", "&leftrightarrow;": "↔", "&leftrightarrows;": "⇆", "&leftrightharpoons;": "⇋", "&leftrightsquigarrow;": "↭", "&leftthreetimes;": "⋋", "&leg;": "⋚", "&leq;": "≤", "&leqq;": "≦", "&leqslant;": "⩽", "&les;": "⩽", "&lescc;": "⪨", "&lesdot;": "⩿", "&lesdoto;": "⪁", "&lesdotor;": "⪃", "&lesg;": "⋚︀", "&lesges;": "⪓", "&lessapprox;": "⪅", "&lessdot;": "⋖", "&lesseqgtr;": "⋚", "&lesseqqgtr;": "⪋", "&lessgtr;": "≶", "&lesssim;": "≲", "&lfisht;": "⥼", "&lfloor;": "⌊", "&lfr;": "𝔩", "&lg;": "≶", "&lgE;": "⪑", "&lhard;": "↽", "&lharu;": "↼", "&lharul;": "⥪", "&lhblk;": "▄", "&ljcy;": "љ", "&ll;": "≪", "&llarr;": "⇇", "&llcorner;": "⌞", "&llhard;": "⥫", "&lltri;": "◺", "&lmidot;": "ŀ", "&lmoust;": "⎰", "&lmoustache;": "⎰", "&lnE;": "≨", "&lnap;": "⪉", "&lnapprox;": "⪉", "&lne;": "⪇", "&lneq;": "⪇", "&lneqq;": "≨", "&lnsim;": "⋦", "&loang;": "⟬", "&loarr;": "⇽", "&lobrk;": "⟦", "&longleftarrow;": "⟵", "&longleftrightarrow;": "⟷", "&longmapsto;": "⟼", "&longrightarrow;": "⟶", "&looparrowleft;": "↫", "&looparrowright;": "↬", "&lopar;": "⦅", "&lopf;": "𝕝", "&loplus;": "⨭", "&lotimes;": "⨴", "&lowast;": "∗", "&lowbar;": "_", "&loz;": "◊", "&lozenge;": "◊", "&lozf;": "⧫", "&lpar;": "(", "&lparlt;": "⦓", "&lrarr;": "⇆", "&lrcorner;": "⌟", "&lrhar;": "⇋", "&lrhard;": "⥭", "&lrm;": "‎", "&lrtri;": "⊿", "&lsaquo;": "‹", "&lscr;": "𝓁", "&lsh;": "↰", "&lsim;": "≲", "&lsime;": "⪍", "&lsimg;": "⪏", "&lsqb;": "[", "&lsquo;": "‘", "&lsquor;": "‚", "&lstrok;": "ł", "&lt": "<", "&lt;": "<", "&ltcc;": "⪦", "&ltcir;": "⩹", "&ltdot;": "⋖", "&lthree;": "⋋", "&ltimes;": "⋉", "&ltlarr;": "⥶", "&ltquest;": "⩻", "&ltrPar;": "⦖", "&ltri;": "◃", "&ltrie;": "⊴", "&ltrif;": "◂", "&lurdshar;": "⥊", "&luruhar;": "⥦", "&lvertneqq;": "≨︀", "&lvnE;": "≨︀", "&mDDot;": "∺", "&macr": "¯", "&macr;": "¯", "&male;": "♂", "&malt;": "✠", "&maltese;": "✠", "&map;": "↦", "&mapsto;": "↦", "&mapstodown;": "↧", "&mapstoleft;": "↤", "&mapstoup;": "↥", "&marker;": "▮", "&mcomma;": "⨩", "&mcy;": "м", "&mdash;": "—", "&measuredangle;": "∡", "&mfr;": "𝔪", "&mho;": "℧", "&micro": "µ", "&micro;": "µ", "&mid;": "∣", "&midast;": "*", "&midcir;": "⫰", "&middot": "·", "&middot;": "·", "&minus;": "−", "&minusb;": "⊟", "&minusd;": "∸", "&minusdu;": "⨪", "&mlcp;": "⫛", "&mldr;": "…", "&mnplus;": "∓", "&models;": "⊧", "&mopf;": "𝕞", "&mp;": "∓", "&mscr;": "𝓂", "&mstpos;": "∾", "&mu;": "μ", "&multimap;": "⊸", "&mumap;": "⊸", "&nGg;": "⋙̸", "&nGt;": "≫⃒", "&nGtv;": "≫̸", "&nLeftarrow;": "⇍", "&nLeftrightarrow;": "⇎", "&nLl;": "⋘̸", "&nLt;": "≪⃒", "&nLtv;": "≪̸", "&nRightarrow;": "⇏", "&nVDash;": "⊯", "&nVdash;": "⊮", "&nabla;": "∇", "&nacute;": "ń", "&nang;": "∠⃒", "&nap;": "≉", "&napE;": "⩰̸", "&napid;": "≋̸", "&napos;": "ŉ", "&napprox;": "≉", "&natur;": "♮", "&natural;": "♮", "&naturals;": "ℕ", "&nbsp": " ", "&nbsp;": " ", "&nbump;": "≎̸", "&nbumpe;": "≏̸", "&ncap;": "⩃", "&ncaron;": "ň", "&ncedil;": "ņ", "&ncong;": "≇", "&ncongdot;": "⩭̸", "&ncup;": "⩂", "&ncy;": "н", "&ndash;": "–", "&ne;": "≠", "&neArr;": "⇗", "&nearhk;": "⤤", "&nearr;": "↗", "&nearrow;": "↗", "&nedot;": "≐̸", "&nequiv;": "≢", "&nesear;": "⤨", "&nesim;": "≂̸", "&nexist;": "∄", "&nexists;": "∄", "&nfr;": "𝔫", "&ngE;": "≧̸", "&nge;": "≱", "&ngeq;": "≱", "&ngeqq;": "≧̸", "&ngeqslant;": "⩾̸", "&nges;": "⩾̸", "&ngsim;": "≵", "&ngt;": "≯", "&ngtr;": "≯", "&nhArr;": "⇎", "&nharr;": "↮", "&nhpar;": "⫲", "&ni;": "∋", "&nis;": "⋼", "&nisd;": "⋺", "&niv;": "∋", "&njcy;": "њ", "&nlArr;": "⇍", "&nlE;": "≦̸", "&nlarr;": "↚", "&nldr;": "‥", "&nle;": "≰", "&nleftarrow;": "↚", "&nleftrightarrow;": "↮", "&nleq;": "≰", "&nleqq;": "≦̸", "&nleqslant;": "⩽̸", "&nles;": "⩽̸", "&nless;": "≮", "&nlsim;": "≴", "&nlt;": "≮", "&nltri;": "⋪", "&nltrie;": "⋬", "&nmid;": "∤", "&nopf;": "𝕟", "&not": "¬", "&not;": "¬", "&notin;": "∉", "&notinE;": "⋹̸", "&notindot;": "⋵̸", "&notinva;": "∉", "&notinvb;": "⋷", "&notinvc;": "⋶", "&notni;": "∌", "&notniva;": "∌", "&notnivb;": "⋾", "&notnivc;": "⋽", "&npar;": "∦", "&nparallel;": "∦", "&nparsl;": "⫽⃥", "&npart;": "∂̸", "&npolint;": "⨔", "&npr;": "⊀", "&nprcue;": "⋠", "&npre;": "⪯̸", "&nprec;": "⊀", "&npreceq;": "⪯̸", "&nrArr;": "⇏", "&nrarr;": "↛", "&nrarrc;": "⤳̸", "&nrarrw;": "↝̸", "&nrightarrow;": "↛", "&nrtri;": "⋫", "&nrtrie;": "⋭", "&nsc;": "⊁", "&nsccue;": "⋡", "&nsce;": "⪰̸", "&nscr;": "𝓃", "&nshortmid;": "∤", "&nshortparallel;": "∦", "&nsim;": "≁", "&nsime;": "≄", "&nsimeq;": "≄", "&nsmid;": "∤", "&nspar;": "∦", "&nsqsube;": "⋢", "&nsqsupe;": "⋣", "&nsub;": "⊄", "&nsubE;": "⫅̸", "&nsube;": "⊈", "&nsubset;": "⊂⃒", "&nsubseteq;": "⊈", "&nsubseteqq;": "⫅̸", "&nsucc;": "⊁", "&nsucceq;": "⪰̸", "&nsup;": "⊅", "&nsupE;": "⫆̸", "&nsupe;": "⊉", "&nsupset;": "⊃⃒", "&nsupseteq;": "⊉", "&nsupseteqq;": "⫆̸", "&ntgl;": "≹", "&ntilde": "ñ", "&ntilde;": "ñ", "&ntlg;": "≸", "&ntriangleleft;": "⋪", "&ntrianglelefteq;": "⋬", "&ntriangleright;": "⋫", "&ntrianglerighteq;": "⋭", "&nu;": "ν", "&num;": "#", "&numero;": "№", "&numsp;": " ", "&nvDash;": "⊭", "&nvHarr;": "⤄", "&nvap;": "≍⃒", "&nvdash;": "⊬", "&nvge;": "≥⃒", "&nvgt;": ">⃒", "&nvinfin;": "⧞", "&nvlArr;": "⤂", "&nvle;": "≤⃒", "&nvlt;": "<⃒", "&nvltrie;": "⊴⃒", "&nvrArr;": "⤃", "&nvrtrie;": "⊵⃒", "&nvsim;": "∼⃒", "&nwArr;": "⇖", "&nwarhk;": "⤣", "&nwarr;": "↖", "&nwarrow;": "↖", "&nwnear;": "⤧", "&oS;": "Ⓢ", "&oacute": "ó", "&oacute;": "ó", "&oast;": "⊛", "&ocir;": "⊚", "&ocirc": "ô", "&ocirc;": "ô", "&ocy;": "о", "&odash;": "⊝", "&odblac;": "ő", "&odiv;": "⨸", "&odot;": "⊙", "&odsold;": "⦼", "&oelig;": "œ", "&ofcir;": "⦿", "&ofr;": "𝔬", "&ogon;": "˛", "&ograve": "ò", "&ograve;": "ò", "&ogt;": "⧁", "&ohbar;": "⦵", "&ohm;": "Ω", "&oint;": "∮", "&olarr;": "↺", "&olcir;": "⦾", "&olcross;": "⦻", "&oline;": "‾", "&olt;": "⧀", "&omacr;": "ō", "&omega;": "ω", "&omicron;": "ο", "&omid;": "⦶", "&ominus;": "⊖", "&oopf;": "𝕠", "&opar;": "⦷", "&operp;": "⦹", "&oplus;": "⊕", "&or;": "∨", "&orarr;": "↻", "&ord;": "⩝", "&order;": "ℴ", "&orderof;": "ℴ", "&ordf": "ª", "&ordf;": "ª", "&ordm": "º", "&ordm;": "º", "&origof;": "⊶", "&oror;": "⩖", "&orslope;": "⩗", "&orv;": "⩛", "&oscr;": "ℴ", "&oslash": "ø", "&oslash;": "ø", "&osol;": "⊘", "&otilde": "õ", "&otilde;": "õ", "&otimes;": "⊗", "&otimesas;": "⨶", "&ouml": "ö", "&ouml;": "ö", "&ovbar;": "⌽", "&par;": "∥", "&para": "¶", "&para;": "¶", "&parallel;": "∥", "&parsim;": "⫳", "&parsl;": "⫽", "&part;": "∂", "&pcy;": "п", "&percnt;": "%", "&period;": ".", "&permil;": "‰", "&perp;": "⊥", "&pertenk;": "‱", "&pfr;": "𝔭", "&phi;": "φ", "&phiv;": "ϕ", "&phmmat;": "ℳ", "&phone;": "☎", "&pi;": "π", "&pitchfork;": "⋔", "&piv;": "ϖ", "&planck;": "ℏ", "&planckh;": "ℎ", "&plankv;": "ℏ", "&plus;": "+", "&plusacir;": "⨣", "&plusb;": "⊞", "&pluscir;": "⨢", "&plusdo;": "∔", "&plusdu;": "⨥", "&pluse;": "⩲", "&plusmn": "±", "&plusmn;": "±", "&plussim;": "⨦", "&plustwo;": "⨧", "&pm;": "±", "&pointint;": "⨕", "&popf;": "𝕡", "&pound": "£", "&pound;": "£", "&pr;": "≺", "&prE;": "⪳", "&prap;": "⪷", "&prcue;": "≼", "&pre;": "⪯", "&prec;": "≺", "&precapprox;": "⪷", "&preccurlyeq;": "≼", "&preceq;": "⪯", "&precnapprox;": "⪹", "&precneqq;": "⪵", "&precnsim;": "⋨", "&precsim;": "≾", "&prime;": "′", "&primes;": "ℙ", "&prnE;": "⪵", "&prnap;": "⪹", "&prnsim;": "⋨", "&prod;": "∏", "&profalar;": "⌮", "&profline;": "⌒", "&profsurf;": "⌓", "&prop;": "∝", "&propto;": "∝", "&prsim;": "≾", "&prurel;": "⊰", "&pscr;": "𝓅", "&psi;": "ψ", "&puncsp;": " ", "&qfr;": "𝔮", "&qint;": "⨌", "&qopf;": "𝕢", "&qprime;": "⁗", "&qscr;": "𝓆", "&quaternions;": "ℍ", "&quatint;": "⨖", "&quest;": "?", "&questeq;": "≟", "&quot": '"', "&quot;": '"', "&rAarr;": "⇛", "&rArr;": "⇒", "&rAtail;": "⤜", "&rBarr;": "⤏", "&rHar;": "⥤", "&race;": "∽̱", "&racute;": "ŕ", "&radic;": "√", "&raemptyv;": "⦳", "&rang;": "⟩", "&rangd;": "⦒", "&range;": "⦥", "&rangle;": "⟩", "&raquo": "»", "&raquo;": "»", "&rarr;": "→", "&rarrap;": "⥵", "&rarrb;": "⇥", "&rarrbfs;": "⤠", "&rarrc;": "⤳", "&rarrfs;": "⤞", "&rarrhk;": "↪", "&rarrlp;": "↬", "&rarrpl;": "⥅", "&rarrsim;": "⥴", "&rarrtl;": "↣", "&rarrw;": "↝", "&ratail;": "⤚", "&ratio;": "∶", "&rationals;": "ℚ", "&rbarr;": "⤍", "&rbbrk;": "❳", "&rbrace;": "}", "&rbrack;": "]", "&rbrke;": "⦌", "&rbrksld;": "⦎", "&rbrkslu;": "⦐", "&rcaron;": "ř", "&rcedil;": "ŗ", "&rceil;": "⌉", "&rcub;": "}", "&rcy;": "р", "&rdca;": "⤷", "&rdldhar;": "⥩", "&rdquo;": "”", "&rdquor;": "”", "&rdsh;": "↳", "&real;": "ℜ", "&realine;": "ℛ", "&realpart;": "ℜ", "&reals;": "ℝ", "&rect;": "▭", "&reg": "®", "&reg;": "®", "&rfisht;": "⥽", "&rfloor;": "⌋", "&rfr;": "𝔯", "&rhard;": "⇁", "&rharu;": "⇀", "&rharul;": "⥬", "&rho;": "ρ", "&rhov;": "ϱ", "&rightarrow;": "→", "&rightarrowtail;": "↣", "&rightharpoondown;": "⇁", "&rightharpoonup;": "⇀", "&rightleftarrows;": "⇄", "&rightleftharpoons;": "⇌", "&rightrightarrows;": "⇉", "&rightsquigarrow;": "↝", "&rightthreetimes;": "⋌", "&ring;": "˚", "&risingdotseq;": "≓", "&rlarr;": "⇄", "&rlhar;": "⇌", "&rlm;": "‏", "&rmoust;": "⎱", "&rmoustache;": "⎱", "&rnmid;": "⫮", "&roang;": "⟭", "&roarr;": "⇾", "&robrk;": "⟧", "&ropar;": "⦆", "&ropf;": "𝕣", "&roplus;": "⨮", "&rotimes;": "⨵", "&rpar;": ")", "&rpargt;": "⦔", "&rppolint;": "⨒", "&rrarr;": "⇉", "&rsaquo;": "›", "&rscr;": "𝓇", "&rsh;": "↱", "&rsqb;": "]", "&rsquo;": "’", "&rsquor;": "’", "&rthree;": "⋌", "&rtimes;": "⋊", "&rtri;": "▹", "&rtrie;": "⊵", "&rtrif;": "▸", "&rtriltri;": "⧎", "&ruluhar;": "⥨", "&rx;": "℞", "&sacute;": "ś", "&sbquo;": "‚", "&sc;": "≻", "&scE;": "⪴", "&scap;": "⪸", "&scaron;": "š", "&sccue;": "≽", "&sce;": "⪰", "&scedil;": "ş", "&scirc;": "ŝ", "&scnE;": "⪶", "&scnap;": "⪺", "&scnsim;": "⋩", "&scpolint;": "⨓", "&scsim;": "≿", "&scy;": "с", "&sdot;": "⋅", "&sdotb;": "⊡", "&sdote;": "⩦", "&seArr;": "⇘", "&searhk;": "⤥", "&searr;": "↘", "&searrow;": "↘", "&sect": "§", "&sect;": "§", "&semi;": ";", "&seswar;": "⤩", "&setminus;": "∖", "&setmn;": "∖", "&sext;": "✶", "&sfr;": "𝔰", "&sfrown;": "⌢", "&sharp;": "♯", "&shchcy;": "щ", "&shcy;": "ш", "&shortmid;": "∣", "&shortparallel;": "∥", "&shy": "­", "&shy;": "­", "&sigma;": "σ", "&sigmaf;": "ς", "&sigmav;": "ς", "&sim;": "∼", "&simdot;": "⩪", "&sime;": "≃", "&simeq;": "≃", "&simg;": "⪞", "&simgE;": "⪠", "&siml;": "⪝", "&simlE;": "⪟", "&simne;": "≆", "&simplus;": "⨤", "&simrarr;": "⥲", "&slarr;": "←", "&smallsetminus;": "∖", "&smashp;": "⨳", "&smeparsl;": "⧤", "&smid;": "∣", "&smile;": "⌣", "&smt;": "⪪", "&smte;": "⪬", "&smtes;": "⪬︀", "&softcy;": "ь", "&sol;": "/", "&solb;": "⧄", "&solbar;": "⌿", "&sopf;": "𝕤", "&spades;": "♠", "&spadesuit;": "♠", "&spar;": "∥", "&sqcap;": "⊓", "&sqcaps;": "⊓︀", "&sqcup;": "⊔", "&sqcups;": "⊔︀", "&sqsub;": "⊏", "&sqsube;": "⊑", "&sqsubset;": "⊏", "&sqsubseteq;": "⊑", "&sqsup;": "⊐", "&sqsupe;": "⊒", "&sqsupset;": "⊐", "&sqsupseteq;": "⊒", "&squ;": "□", "&square;": "□", "&squarf;": "▪", "&squf;": "▪", "&srarr;": "→", "&sscr;": "𝓈", "&ssetmn;": "∖", "&ssmile;": "⌣", "&sstarf;": "⋆", "&star;": "☆", "&starf;": "★", "&straightepsilon;": "ϵ", "&straightphi;": "ϕ", "&strns;": "¯", "&sub;": "⊂", "&subE;": "⫅", "&subdot;": "⪽", "&sube;": "⊆", "&subedot;": "⫃", "&submult;": "⫁", "&subnE;": "⫋", "&subne;": "⊊", "&subplus;": "⪿", "&subrarr;": "⥹", "&subset;": "⊂", "&subseteq;": "⊆", "&subseteqq;": "⫅", "&subsetneq;": "⊊", "&subsetneqq;": "⫋", "&subsim;": "⫇", "&subsub;": "⫕", "&subsup;": "⫓", "&succ;": "≻", "&succapprox;": "⪸", "&succcurlyeq;": "≽", "&succeq;": "⪰", "&succnapprox;": "⪺", "&succneqq;": "⪶", "&succnsim;": "⋩", "&succsim;": "≿", "&sum;": "∑", "&sung;": "♪", "&sup1": "¹", "&sup1;": "¹", "&sup2": "²", "&sup2;": "²", "&sup3": "³", "&sup3;": "³", "&sup;": "⊃", "&supE;": "⫆", "&supdot;": "⪾", "&supdsub;": "⫘", "&supe;": "⊇", "&supedot;": "⫄", "&suphsol;": "⟉", "&suphsub;": "⫗", "&suplarr;": "⥻", "&supmult;": "⫂", "&supnE;": "⫌", "&supne;": "⊋", "&supplus;": "⫀", "&supset;": "⊃", "&supseteq;": "⊇", "&supseteqq;": "⫆", "&supsetneq;": "⊋", "&supsetneqq;": "⫌", "&supsim;": "⫈", "&supsub;": "⫔", "&supsup;": "⫖", "&swArr;": "⇙", "&swarhk;": "⤦", "&swarr;": "↙", "&swarrow;": "↙", "&swnwar;": "⤪", "&szlig": "ß", "&szlig;": "ß", "&target;": "⌖", "&tau;": "τ", "&tbrk;": "⎴", "&tcaron;": "ť", "&tcedil;": "ţ", "&tcy;": "т", "&tdot;": "⃛", "&telrec;": "⌕", "&tfr;": "𝔱", "&there4;": "∴", "&therefore;": "∴", "&theta;": "θ", "&thetasym;": "ϑ", "&thetav;": "ϑ", "&thickapprox;": "≈", "&thicksim;": "∼", "&thinsp;": " ", "&thkap;": "≈", "&thksim;": "∼", "&thorn": "þ", "&thorn;": "þ", "&tilde;": "˜", "&times": "×", "&times;": "×", "&timesb;": "⊠", "&timesbar;": "⨱", "&timesd;": "⨰", "&tint;": "∭", "&toea;": "⤨", "&top;": "⊤", "&topbot;": "⌶", "&topcir;": "⫱", "&topf;": "𝕥", "&topfork;": "⫚", "&tosa;": "⤩", "&tprime;": "‴", "&trade;": "™", "&triangle;": "▵", "&triangledown;": "▿", "&triangleleft;": "◃", "&trianglelefteq;": "⊴", "&triangleq;": "≜", "&triangleright;": "▹", "&trianglerighteq;": "⊵", "&tridot;": "◬", "&trie;": "≜", "&triminus;": "⨺", "&triplus;": "⨹", "&trisb;": "⧍", "&tritime;": "⨻", "&trpezium;": "⏢", "&tscr;": "𝓉", "&tscy;": "ц", "&tshcy;": "ћ", "&tstrok;": "ŧ", "&twixt;": "≬", "&twoheadleftarrow;": "↞", "&twoheadrightarrow;": "↠", "&uArr;": "⇑", "&uHar;": "⥣", "&uacute": "ú", "&uacute;": "ú", "&uarr;": "↑", "&ubrcy;": "ў", "&ubreve;": "ŭ", "&ucirc": "û", "&ucirc;": "û", "&ucy;": "у", "&udarr;": "⇅", "&udblac;": "ű", "&udhar;": "⥮", "&ufisht;": "⥾", "&ufr;": "𝔲", "&ugrave": "ù", "&ugrave;": "ù", "&uharl;": "↿", "&uharr;": "↾", "&uhblk;": "▀", "&ulcorn;": "⌜", "&ulcorner;": "⌜", "&ulcrop;": "⌏", "&ultri;": "◸", "&umacr;": "ū", "&uml": "¨", "&uml;": "¨", "&uogon;": "ų", "&uopf;": "𝕦", "&uparrow;": "↑", "&updownarrow;": "↕", "&upharpoonleft;": "↿", "&upharpoonright;": "↾", "&uplus;": "⊎", "&upsi;": "υ", "&upsih;": "ϒ", "&upsilon;": "υ", "&upuparrows;": "⇈", "&urcorn;": "⌝", "&urcorner;": "⌝", "&urcrop;": "⌎", "&uring;": "ů", "&urtri;": "◹", "&uscr;": "𝓊", "&utdot;": "⋰", "&utilde;": "ũ", "&utri;": "▵", "&utrif;": "▴", "&uuarr;": "⇈", "&uuml": "ü", "&uuml;": "ü", "&uwangle;": "⦧", "&vArr;": "⇕", "&vBar;": "⫨", "&vBarv;": "⫩", "&vDash;": "⊨", "&vangrt;": "⦜", "&varepsilon;": "ϵ", "&varkappa;": "ϰ", "&varnothing;": "∅", "&varphi;": "ϕ", "&varpi;": "ϖ", "&varpropto;": "∝", "&varr;": "↕", "&varrho;": "ϱ", "&varsigma;": "ς", "&varsubsetneq;": "⊊︀", "&varsubsetneqq;": "⫋︀", "&varsupsetneq;": "⊋︀", "&varsupsetneqq;": "⫌︀", "&vartheta;": "ϑ", "&vartriangleleft;": "⊲", "&vartriangleright;": "⊳", "&vcy;": "в", "&vdash;": "⊢", "&vee;": "∨", "&veebar;": "⊻", "&veeeq;": "≚", "&vellip;": "⋮", "&verbar;": "|", "&vert;": "|", "&vfr;": "𝔳", "&vltri;": "⊲", "&vnsub;": "⊂⃒", "&vnsup;": "⊃⃒", "&vopf;": "𝕧", "&vprop;": "∝", "&vrtri;": "⊳", "&vscr;": "𝓋", "&vsubnE;": "⫋︀", "&vsubne;": "⊊︀", "&vsupnE;": "⫌︀", "&vsupne;": "⊋︀", "&vzigzag;": "⦚", "&wcirc;": "ŵ", "&wedbar;": "⩟", "&wedge;": "∧", "&wedgeq;": "≙", "&weierp;": "℘", "&wfr;": "𝔴", "&wopf;": "𝕨", "&wp;": "℘", "&wr;": "≀", "&wreath;": "≀", "&wscr;": "𝓌", "&xcap;": "⋂", "&xcirc;": "◯", "&xcup;": "⋃", "&xdtri;": "▽", "&xfr;": "𝔵", "&xhArr;": "⟺", "&xharr;": "⟷", "&xi;": "ξ", "&xlArr;": "⟸", "&xlarr;": "⟵", "&xmap;": "⟼", "&xnis;": "⋻", "&xodot;": "⨀", "&xopf;": "𝕩", "&xoplus;": "⨁", "&xotime;": "⨂", "&xrArr;": "⟹", "&xrarr;": "⟶", "&xscr;": "𝓍", "&xsqcup;": "⨆", "&xuplus;": "⨄", "&xutri;": "△", "&xvee;": "⋁", "&xwedge;": "⋀", "&yacute": "ý", "&yacute;": "ý", "&yacy;": "я", "&ycirc;": "ŷ", "&ycy;": "ы", "&yen": "¥", "&yen;": "¥", "&yfr;": "𝔶", "&yicy;": "ї", "&yopf;": "𝕪", "&yscr;": "𝓎", "&yucy;": "ю", "&yuml": "ÿ", "&yuml;": "ÿ", "&zacute;": "ź", "&zcaron;": "ž", "&zcy;": "з", "&zdot;": "ż", "&zeetrf;": "ℨ", "&zeta;": "ζ", "&zfr;": "𝔷", "&zhcy;": "ж", "&zigrarr;": "⇝", "&zopf;": "𝕫", "&zscr;": "𝓏", "&zwj;": "‍", "&zwnj;": "‌" }, characters: { "Æ": "&AElig;", "&": "&amp;", "Á": "&Aacute;", "Ă": "&Abreve;", "Â": "&Acirc;", "А": "&Acy;", "𝔄": "&Afr;", "À": "&Agrave;", "Α": "&Alpha;", "Ā": "&Amacr;", "⩓": "&And;", "Ą": "&Aogon;", "𝔸": "&Aopf;", "⁡": "&af;", "Å": "&angst;", "𝒜": "&Ascr;", "≔": "&coloneq;", "Ã": "&Atilde;", "Ä": "&Auml;", "∖": "&ssetmn;", "⫧": "&Barv;", "⌆": "&doublebarwedge;", "Б": "&Bcy;", "∵": "&because;", "ℬ": "&bernou;", "Β": "&Beta;", "𝔅": "&Bfr;", "𝔹": "&Bopf;", "˘": "&breve;", "≎": "&bump;", "Ч": "&CHcy;", "©": "&copy;", "Ć": "&Cacute;", "⋒": "&Cap;", "ⅅ": "&DD;", "ℭ": "&Cfr;", "Č": "&Ccaron;", "Ç": "&Ccedil;", "Ĉ": "&Ccirc;", "∰": "&Cconint;", "Ċ": "&Cdot;", "¸": "&cedil;", "·": "&middot;", "Χ": "&Chi;", "⊙": "&odot;", "⊖": "&ominus;", "⊕": "&oplus;", "⊗": "&otimes;", "∲": "&cwconint;", "”": "&rdquor;", "’": "&rsquor;", "∷": "&Proportion;", "⩴": "&Colone;", "≡": "&equiv;", "∯": "&DoubleContourIntegral;", "∮": "&oint;", "ℂ": "&complexes;", "∐": "&coprod;", "∳": "&awconint;", "⨯": "&Cross;", "𝒞": "&Cscr;", "⋓": "&Cup;", "≍": "&asympeq;", "⤑": "&DDotrahd;", "Ђ": "&DJcy;", "Ѕ": "&DScy;", "Џ": "&DZcy;", "‡": "&ddagger;", "↡": "&Darr;", "⫤": "&DoubleLeftTee;", "Ď": "&Dcaron;", "Д": "&Dcy;", "∇": "&nabla;", "Δ": "&Delta;", "𝔇": "&Dfr;", "´": "&acute;", "˙": "&dot;", "˝": "&dblac;", "`": "&grave;", "˜": "&tilde;", "⋄": "&diamond;", "ⅆ": "&dd;", "𝔻": "&Dopf;", "¨": "&uml;", "⃜": "&DotDot;", "≐": "&esdot;", "⇓": "&dArr;", "⇐": "&lArr;", "⇔": "&iff;", "⟸": "&xlArr;", "⟺": "&xhArr;", "⟹": "&xrArr;", "⇒": "&rArr;", "⊨": "&vDash;", "⇑": "&uArr;", "⇕": "&vArr;", "∥": "&spar;", "↓": "&downarrow;", "⤓": "&DownArrowBar;", "⇵": "&duarr;", "̑": "&DownBreve;", "⥐": "&DownLeftRightVector;", "⥞": "&DownLeftTeeVector;", "↽": "&lhard;", "⥖": "&DownLeftVectorBar;", "⥟": "&DownRightTeeVector;", "⇁": "&rightharpoondown;", "⥗": "&DownRightVectorBar;", "⊤": "&top;", "↧": "&mapstodown;", "𝒟": "&Dscr;", "Đ": "&Dstrok;", "Ŋ": "&ENG;", "Ð": "&ETH;", "É": "&Eacute;", "Ě": "&Ecaron;", "Ê": "&Ecirc;", "Э": "&Ecy;", "Ė": "&Edot;", "𝔈": "&Efr;", "È": "&Egrave;", "∈": "&isinv;", "Ē": "&Emacr;", "◻": "&EmptySmallSquare;", "▫": "&EmptyVerySmallSquare;", "Ę": "&Eogon;", "𝔼": "&Eopf;", "Ε": "&Epsilon;", "⩵": "&Equal;", "≂": "&esim;", "⇌": "&rlhar;", "ℰ": "&expectation;", "⩳": "&Esim;", "Η": "&Eta;", "Ë": "&Euml;", "∃": "&exist;", "ⅇ": "&exponentiale;", "Ф": "&Fcy;", "𝔉": "&Ffr;", "◼": "&FilledSmallSquare;", "▪": "&squf;", "𝔽": "&Fopf;", "∀": "&forall;", "ℱ": "&Fscr;", "Ѓ": "&GJcy;", ">": "&gt;", "Γ": "&Gamma;", "Ϝ": "&Gammad;", "Ğ": "&Gbreve;", "Ģ": "&Gcedil;", "Ĝ": "&Gcirc;", "Г": "&Gcy;", "Ġ": "&Gdot;", "𝔊": "&Gfr;", "⋙": "&ggg;", "𝔾": "&Gopf;", "≥": "&geq;", "⋛": "&gtreqless;", "≧": "&geqq;", "⪢": "&GreaterGreater;", "≷": "&gtrless;", "⩾": "&ges;", "≳": "&gtrsim;", "𝒢": "&Gscr;", "≫": "&gg;", "Ъ": "&HARDcy;", "ˇ": "&caron;", "^": "&Hat;", "Ĥ": "&Hcirc;", "ℌ": "&Poincareplane;", "ℋ": "&hamilt;", "ℍ": "&quaternions;", "─": "&boxh;", "Ħ": "&Hstrok;", "≏": "&bumpeq;", "Е": "&IEcy;", "Ĳ": "&IJlig;", "Ё": "&IOcy;", "Í": "&Iacute;", "Î": "&Icirc;", "И": "&Icy;", "İ": "&Idot;", "ℑ": "&imagpart;", "Ì": "&Igrave;", "Ī": "&Imacr;", "ⅈ": "&ii;", "∬": "&Int;", "∫": "&int;", "⋂": "&xcap;", "⁣": "&ic;", "⁢": "&it;", "Į": "&Iogon;", "𝕀": "&Iopf;", "Ι": "&Iota;", "ℐ": "&imagline;", "Ĩ": "&Itilde;", "І": "&Iukcy;", "Ï": "&Iuml;", "Ĵ": "&Jcirc;", "Й": "&Jcy;", "𝔍": "&Jfr;", "𝕁": "&Jopf;", "𝒥": "&Jscr;", "Ј": "&Jsercy;", "Є": "&Jukcy;", "Х": "&KHcy;", "Ќ": "&KJcy;", "Κ": "&Kappa;", "Ķ": "&Kcedil;", "К": "&Kcy;", "𝔎": "&Kfr;", "𝕂": "&Kopf;", "𝒦": "&Kscr;", "Љ": "&LJcy;", "<": "&lt;", "Ĺ": "&Lacute;", "Λ": "&Lambda;", "⟪": "&Lang;", "ℒ": "&lagran;", "↞": "&twoheadleftarrow;", "Ľ": "&Lcaron;", "Ļ": "&Lcedil;", "Л": "&Lcy;", "⟨": "&langle;", "←": "&slarr;", "⇤": "&larrb;", "⇆": "&lrarr;", "⌈": "&lceil;", "⟦": "&lobrk;", "⥡": "&LeftDownTeeVector;", "⇃": "&downharpoonleft;", "⥙": "&LeftDownVectorBar;", "⌊": "&lfloor;", "↔": "&leftrightarrow;", "⥎": "&LeftRightVector;", "⊣": "&dashv;", "↤": "&mapstoleft;", "⥚": "&LeftTeeVector;", "⊲": "&vltri;", "⧏": "&LeftTriangleBar;", "⊴": "&trianglelefteq;", "⥑": "&LeftUpDownVector;", "⥠": "&LeftUpTeeVector;", "↿": "&upharpoonleft;", "⥘": "&LeftUpVectorBar;", "↼": "&lharu;", "⥒": "&LeftVectorBar;", "⋚": "&lesseqgtr;", "≦": "&leqq;", "≶": "&lg;", "⪡": "&LessLess;", "⩽": "&les;", "≲": "&lsim;", "𝔏": "&Lfr;", "⋘": "&Ll;", "⇚": "&lAarr;", "Ŀ": "&Lmidot;", "⟵": "&xlarr;", "⟷": "&xharr;", "⟶": "&xrarr;", "𝕃": "&Lopf;", "↙": "&swarrow;", "↘": "&searrow;", "↰": "&lsh;", "Ł": "&Lstrok;", "≪": "&ll;", "⤅": "&Map;", "М": "&Mcy;", " ": "&MediumSpace;", "ℳ": "&phmmat;", "𝔐": "&Mfr;", "∓": "&mp;", "𝕄": "&Mopf;", "Μ": "&Mu;", "Њ": "&NJcy;", "Ń": "&Nacute;", "Ň": "&Ncaron;", "Ņ": "&Ncedil;", "Н": "&Ncy;", "​": "&ZeroWidthSpace;", "\n": "&NewLine;", "𝔑": "&Nfr;", "⁠": "&NoBreak;", " ": "&nbsp;", "ℕ": "&naturals;", "⫬": "&Not;", "≢": "&nequiv;", "≭": "&NotCupCap;", "∦": "&nspar;", "∉": "&notinva;", "≠": "&ne;", "≂̸": "&nesim;", "∄": "&nexists;", "≯": "&ngtr;", "≱": "&ngeq;", "≧̸": "&ngeqq;", "≫̸": "&nGtv;", "≹": "&ntgl;", "⩾̸": "&nges;", "≵": "&ngsim;", "≎̸": "&nbump;", "≏̸": "&nbumpe;", "⋪": "&ntriangleleft;", "⧏̸": "&NotLeftTriangleBar;", "⋬": "&ntrianglelefteq;", "≮": "&nlt;", "≰": "&nleq;", "≸": "&ntlg;", "≪̸": "&nLtv;", "⩽̸": "&nles;", "≴": "&nlsim;", "⪢̸": "&NotNestedGreaterGreater;", "⪡̸": "&NotNestedLessLess;", "⊀": "&nprec;", "⪯̸": "&npreceq;", "⋠": "&nprcue;", "∌": "&notniva;", "⋫": "&ntriangleright;", "⧐̸": "&NotRightTriangleBar;", "⋭": "&ntrianglerighteq;", "⊏̸": "&NotSquareSubset;", "⋢": "&nsqsube;", "⊐̸": "&NotSquareSuperset;", "⋣": "&nsqsupe;", "⊂⃒": "&vnsub;", "⊈": "&nsubseteq;", "⊁": "&nsucc;", "⪰̸": "&nsucceq;", "⋡": "&nsccue;", "≿̸": "&NotSucceedsTilde;", "⊃⃒": "&vnsup;", "⊉": "&nsupseteq;", "≁": "&nsim;", "≄": "&nsimeq;", "≇": "&ncong;", "≉": "&napprox;", "∤": "&nsmid;", "𝒩": "&Nscr;", "Ñ": "&Ntilde;", "Ν": "&Nu;", "Œ": "&OElig;", "Ó": "&Oacute;", "Ô": "&Ocirc;", "О": "&Ocy;", "Ő": "&Odblac;", "𝔒": "&Ofr;", "Ò": "&Ograve;", "Ō": "&Omacr;", "Ω": "&ohm;", "Ο": "&Omicron;", "𝕆": "&Oopf;", "“": "&ldquo;", "‘": "&lsquo;", "⩔": "&Or;", "𝒪": "&Oscr;", "Ø": "&Oslash;", "Õ": "&Otilde;", "⨷": "&Otimes;", "Ö": "&Ouml;", "‾": "&oline;", "⏞": "&OverBrace;", "⎴": "&tbrk;", "⏜": "&OverParenthesis;", "∂": "&part;", "П": "&Pcy;", "𝔓": "&Pfr;", "Φ": "&Phi;", "Π": "&Pi;", "±": "&pm;", "ℙ": "&primes;", "⪻": "&Pr;", "≺": "&prec;", "⪯": "&preceq;", "≼": "&preccurlyeq;", "≾": "&prsim;", "″": "&Prime;", "∏": "&prod;", "∝": "&vprop;", "𝒫": "&Pscr;", "Ψ": "&Psi;", '"': "&quot;", "𝔔": "&Qfr;", "ℚ": "&rationals;", "𝒬": "&Qscr;", "⤐": "&drbkarow;", "®": "&reg;", "Ŕ": "&Racute;", "⟫": "&Rang;", "↠": "&twoheadrightarrow;", "⤖": "&Rarrtl;", "Ř": "&Rcaron;", "Ŗ": "&Rcedil;", "Р": "&Rcy;", "ℜ": "&realpart;", "∋": "&niv;", "⇋": "&lrhar;", "⥯": "&duhar;", "Ρ": "&Rho;", "⟩": "&rangle;", "→": "&srarr;", "⇥": "&rarrb;", "⇄": "&rlarr;", "⌉": "&rceil;", "⟧": "&robrk;", "⥝": "&RightDownTeeVector;", "⇂": "&downharpoonright;", "⥕": "&RightDownVectorBar;", "⌋": "&rfloor;", "⊢": "&vdash;", "↦": "&mapsto;", "⥛": "&RightTeeVector;", "⊳": "&vrtri;", "⧐": "&RightTriangleBar;", "⊵": "&trianglerighteq;", "⥏": "&RightUpDownVector;", "⥜": "&RightUpTeeVector;", "↾": "&upharpoonright;", "⥔": "&RightUpVectorBar;", "⇀": "&rightharpoonup;", "⥓": "&RightVectorBar;", "ℝ": "&reals;", "⥰": "&RoundImplies;", "⇛": "&rAarr;", "ℛ": "&realine;", "↱": "&rsh;", "⧴": "&RuleDelayed;", "Щ": "&SHCHcy;", "Ш": "&SHcy;", "Ь": "&SOFTcy;", "Ś": "&Sacute;", "⪼": "&Sc;", "Š": "&Scaron;", "Ş": "&Scedil;", "Ŝ": "&Scirc;", "С": "&Scy;", "𝔖": "&Sfr;", "↑": "&uparrow;", "Σ": "&Sigma;", "∘": "&compfn;", "𝕊": "&Sopf;", "√": "&radic;", "□": "&square;", "⊓": "&sqcap;", "⊏": "&sqsubset;", "⊑": "&sqsubseteq;", "⊐": "&sqsupset;", "⊒": "&sqsupseteq;", "⊔": "&sqcup;", "𝒮": "&Sscr;", "⋆": "&sstarf;", "⋐": "&Subset;", "⊆": "&subseteq;", "≻": "&succ;", "⪰": "&succeq;", "≽": "&succcurlyeq;", "≿": "&succsim;", "∑": "&sum;", "⋑": "&Supset;", "⊃": "&supset;", "⊇": "&supseteq;", "Þ": "&THORN;", "™": "&trade;", "Ћ": "&TSHcy;", "Ц": "&TScy;", "	": "&Tab;", "Τ": "&Tau;", "Ť": "&Tcaron;", "Ţ": "&Tcedil;", "Т": "&Tcy;", "𝔗": "&Tfr;", "∴": "&therefore;", "Θ": "&Theta;", "  ": "&ThickSpace;", " ": "&thinsp;", "∼": "&thksim;", "≃": "&simeq;", "≅": "&cong;", "≈": "&thkap;", "𝕋": "&Topf;", "⃛": "&tdot;", "𝒯": "&Tscr;", "Ŧ": "&Tstrok;", "Ú": "&Uacute;", "↟": "&Uarr;", "⥉": "&Uarrocir;", "Ў": "&Ubrcy;", "Ŭ": "&Ubreve;", "Û": "&Ucirc;", "У": "&Ucy;", "Ű": "&Udblac;", "𝔘": "&Ufr;", "Ù": "&Ugrave;", "Ū": "&Umacr;", _: "&lowbar;", "⏟": "&UnderBrace;", "⎵": "&bbrk;", "⏝": "&UnderParenthesis;", "⋃": "&xcup;", "⊎": "&uplus;", "Ų": "&Uogon;", "𝕌": "&Uopf;", "⤒": "&UpArrowBar;", "⇅": "&udarr;", "↕": "&varr;", "⥮": "&udhar;", "⊥": "&perp;", "↥": "&mapstoup;", "↖": "&nwarrow;", "↗": "&nearrow;", "ϒ": "&upsih;", "Υ": "&Upsilon;", "Ů": "&Uring;", "𝒰": "&Uscr;", "Ũ": "&Utilde;", "Ü": "&Uuml;", "⊫": "&VDash;", "⫫": "&Vbar;", "В": "&Vcy;", "⊩": "&Vdash;", "⫦": "&Vdashl;", "⋁": "&xvee;", "‖": "&Vert;", "∣": "&smid;", "|": "&vert;", "❘": "&VerticalSeparator;", "≀": "&wreath;", " ": "&hairsp;", "𝔙": "&Vfr;", "𝕍": "&Vopf;", "𝒱": "&Vscr;", "⊪": "&Vvdash;", "Ŵ": "&Wcirc;", "⋀": "&xwedge;", "𝔚": "&Wfr;", "𝕎": "&Wopf;", "𝒲": "&Wscr;", "𝔛": "&Xfr;", "Ξ": "&Xi;", "𝕏": "&Xopf;", "𝒳": "&Xscr;", "Я": "&YAcy;", "Ї": "&YIcy;", "Ю": "&YUcy;", "Ý": "&Yacute;", "Ŷ": "&Ycirc;", "Ы": "&Ycy;", "𝔜": "&Yfr;", "𝕐": "&Yopf;", "𝒴": "&Yscr;", "Ÿ": "&Yuml;", "Ж": "&ZHcy;", "Ź": "&Zacute;", "Ž": "&Zcaron;", "З": "&Zcy;", "Ż": "&Zdot;", "Ζ": "&Zeta;", "ℨ": "&zeetrf;", "ℤ": "&integers;", "𝒵": "&Zscr;", "á": "&aacute;", "ă": "&abreve;", "∾": "&mstpos;", "∾̳": "&acE;", "∿": "&acd;", "â": "&acirc;", "а": "&acy;", "æ": "&aelig;", "𝔞": "&afr;", "à": "&agrave;", "ℵ": "&aleph;", "α": "&alpha;", "ā": "&amacr;", "⨿": "&amalg;", "∧": "&wedge;", "⩕": "&andand;", "⩜": "&andd;", "⩘": "&andslope;", "⩚": "&andv;", "∠": "&angle;", "⦤": "&ange;", "∡": "&measuredangle;", "⦨": "&angmsdaa;", "⦩": "&angmsdab;", "⦪": "&angmsdac;", "⦫": "&angmsdad;", "⦬": "&angmsdae;", "⦭": "&angmsdaf;", "⦮": "&angmsdag;", "⦯": "&angmsdah;", "∟": "&angrt;", "⊾": "&angrtvb;", "⦝": "&angrtvbd;", "∢": "&angsph;", "⍼": "&angzarr;", "ą": "&aogon;", "𝕒": "&aopf;", "⩰": "&apE;", "⩯": "&apacir;", "≊": "&approxeq;", "≋": "&apid;", "'": "&apos;", "å": "&aring;", "𝒶": "&ascr;", "*": "&midast;", "ã": "&atilde;", "ä": "&auml;", "⨑": "&awint;", "⫭": "&bNot;", "≌": "&bcong;", "϶": "&bepsi;", "‵": "&bprime;", "∽": "&bsim;", "⋍": "&bsime;", "⊽": "&barvee;", "⌅": "&barwedge;", "⎶": "&bbrktbrk;", "б": "&bcy;", "„": "&ldquor;", "⦰": "&bemptyv;", "β": "&beta;", "ℶ": "&beth;", "≬": "&twixt;", "𝔟": "&bfr;", "◯": "&xcirc;", "⨀": "&xodot;", "⨁": "&xoplus;", "⨂": "&xotime;", "⨆": "&xsqcup;", "★": "&starf;", "▽": "&xdtri;", "△": "&xutri;", "⨄": "&xuplus;", "⤍": "&rbarr;", "⧫": "&lozf;", "▴": "&utrif;", "▾": "&dtrif;", "◂": "&ltrif;", "▸": "&rtrif;", "␣": "&blank;", "▒": "&blk12;", "░": "&blk14;", "▓": "&blk34;", "█": "&block;", "=⃥": "&bne;", "≡⃥": "&bnequiv;", "⌐": "&bnot;", "𝕓": "&bopf;", "⋈": "&bowtie;", "╗": "&boxDL;", "╔": "&boxDR;", "╖": "&boxDl;", "╓": "&boxDr;", "═": "&boxH;", "╦": "&boxHD;", "╩": "&boxHU;", "╤": "&boxHd;", "╧": "&boxHu;", "╝": "&boxUL;", "╚": "&boxUR;", "╜": "&boxUl;", "╙": "&boxUr;", "║": "&boxV;", "╬": "&boxVH;", "╣": "&boxVL;", "╠": "&boxVR;", "╫": "&boxVh;", "╢": "&boxVl;", "╟": "&boxVr;", "⧉": "&boxbox;", "╕": "&boxdL;", "╒": "&boxdR;", "┐": "&boxdl;", "┌": "&boxdr;", "╥": "&boxhD;", "╨": "&boxhU;", "┬": "&boxhd;", "┴": "&boxhu;", "⊟": "&minusb;", "⊞": "&plusb;", "⊠": "&timesb;", "╛": "&boxuL;", "╘": "&boxuR;", "┘": "&boxul;", "└": "&boxur;", "│": "&boxv;", "╪": "&boxvH;", "╡": "&boxvL;", "╞": "&boxvR;", "┼": "&boxvh;", "┤": "&boxvl;", "├": "&boxvr;", "¦": "&brvbar;", "𝒷": "&bscr;", "⁏": "&bsemi;", "\\": "&bsol;", "⧅": "&bsolb;", "⟈": "&bsolhsub;", "•": "&bullet;", "⪮": "&bumpE;", "ć": "&cacute;", "∩": "&cap;", "⩄": "&capand;", "⩉": "&capbrcup;", "⩋": "&capcap;", "⩇": "&capcup;", "⩀": "&capdot;", "∩︀": "&caps;", "⁁": "&caret;", "⩍": "&ccaps;", "č": "&ccaron;", "ç": "&ccedil;", "ĉ": "&ccirc;", "⩌": "&ccups;", "⩐": "&ccupssm;", "ċ": "&cdot;", "⦲": "&cemptyv;", "¢": "&cent;", "𝔠": "&cfr;", "ч": "&chcy;", "✓": "&checkmark;", "χ": "&chi;", "○": "&cir;", "⧃": "&cirE;", "ˆ": "&circ;", "≗": "&cire;", "↺": "&olarr;", "↻": "&orarr;", "Ⓢ": "&oS;", "⊛": "&oast;", "⊚": "&ocir;", "⊝": "&odash;", "⨐": "&cirfnint;", "⫯": "&cirmid;", "⧂": "&cirscir;", "♣": "&clubsuit;", ":": "&colon;", ",": "&comma;", "@": "&commat;", "∁": "&complement;", "⩭": "&congdot;", "𝕔": "&copf;", "℗": "&copysr;", "↵": "&crarr;", "✗": "&cross;", "𝒸": "&cscr;", "⫏": "&csub;", "⫑": "&csube;", "⫐": "&csup;", "⫒": "&csupe;", "⋯": "&ctdot;", "⤸": "&cudarrl;", "⤵": "&cudarrr;", "⋞": "&curlyeqprec;", "⋟": "&curlyeqsucc;", "↶": "&curvearrowleft;", "⤽": "&cularrp;", "∪": "&cup;", "⩈": "&cupbrcap;", "⩆": "&cupcap;", "⩊": "&cupcup;", "⊍": "&cupdot;", "⩅": "&cupor;", "∪︀": "&cups;", "↷": "&curvearrowright;", "⤼": "&curarrm;", "⋎": "&cuvee;", "⋏": "&cuwed;", "¤": "&curren;", "∱": "&cwint;", "⌭": "&cylcty;", "⥥": "&dHar;", "†": "&dagger;", "ℸ": "&daleth;", "‐": "&hyphen;", "⤏": "&rBarr;", "ď": "&dcaron;", "д": "&dcy;", "⇊": "&downdownarrows;", "⩷": "&eDDot;", "°": "&deg;", "δ": "&delta;", "⦱": "&demptyv;", "⥿": "&dfisht;", "𝔡": "&dfr;", "♦": "&diams;", "ϝ": "&gammad;", "⋲": "&disin;", "÷": "&divide;", "⋇": "&divonx;", "ђ": "&djcy;", "⌞": "&llcorner;", "⌍": "&dlcrop;", $: "&dollar;", "𝕕": "&dopf;", "≑": "&eDot;", "∸": "&minusd;", "∔": "&plusdo;", "⊡": "&sdotb;", "⌟": "&lrcorner;", "⌌": "&drcrop;", "𝒹": "&dscr;", "ѕ": "&dscy;", "⧶": "&dsol;", "đ": "&dstrok;", "⋱": "&dtdot;", "▿": "&triangledown;", "⦦": "&dwangle;", "џ": "&dzcy;", "⟿": "&dzigrarr;", "é": "&eacute;", "⩮": "&easter;", "ě": "&ecaron;", "≖": "&eqcirc;", "ê": "&ecirc;", "≕": "&eqcolon;", "э": "&ecy;", "ė": "&edot;", "≒": "&fallingdotseq;", "𝔢": "&efr;", "⪚": "&eg;", "è": "&egrave;", "⪖": "&eqslantgtr;", "⪘": "&egsdot;", "⪙": "&el;", "⏧": "&elinters;", "ℓ": "&ell;", "⪕": "&eqslantless;", "⪗": "&elsdot;", "ē": "&emacr;", "∅": "&varnothing;", " ": "&emsp13;", " ": "&emsp14;", " ": "&emsp;", "ŋ": "&eng;", " ": "&ensp;", "ę": "&eogon;", "𝕖": "&eopf;", "⋕": "&epar;", "⧣": "&eparsl;", "⩱": "&eplus;", "ε": "&epsilon;", "ϵ": "&varepsilon;", "=": "&equals;", "≟": "&questeq;", "⩸": "&equivDD;", "⧥": "&eqvparsl;", "≓": "&risingdotseq;", "⥱": "&erarr;", "ℯ": "&escr;", "η": "&eta;", "ð": "&eth;", "ë": "&euml;", "€": "&euro;", "!": "&excl;", "ф": "&fcy;", "♀": "&female;", "ﬃ": "&ffilig;", "ﬀ": "&fflig;", "ﬄ": "&ffllig;", "𝔣": "&ffr;", "ﬁ": "&filig;", fj: "&fjlig;", "♭": "&flat;", "ﬂ": "&fllig;", "▱": "&fltns;", "ƒ": "&fnof;", "𝕗": "&fopf;", "⋔": "&pitchfork;", "⫙": "&forkv;", "⨍": "&fpartint;", "½": "&half;", "⅓": "&frac13;", "¼": "&frac14;", "⅕": "&frac15;", "⅙": "&frac16;", "⅛": "&frac18;", "⅔": "&frac23;", "⅖": "&frac25;", "¾": "&frac34;", "⅗": "&frac35;", "⅜": "&frac38;", "⅘": "&frac45;", "⅚": "&frac56;", "⅝": "&frac58;", "⅞": "&frac78;", "⁄": "&frasl;", "⌢": "&sfrown;", "𝒻": "&fscr;", "⪌": "&gtreqqless;", "ǵ": "&gacute;", "γ": "&gamma;", "⪆": "&gtrapprox;", "ğ": "&gbreve;", "ĝ": "&gcirc;", "г": "&gcy;", "ġ": "&gdot;", "⪩": "&gescc;", "⪀": "&gesdot;", "⪂": "&gesdoto;", "⪄": "&gesdotol;", "⋛︀": "&gesl;", "⪔": "&gesles;", "𝔤": "&gfr;", "ℷ": "&gimel;", "ѓ": "&gjcy;", "⪒": "&glE;", "⪥": "&gla;", "⪤": "&glj;", "≩": "&gneqq;", "⪊": "&gnapprox;", "⪈": "&gneq;", "⋧": "&gnsim;", "𝕘": "&gopf;", "ℊ": "&gscr;", "⪎": "&gsime;", "⪐": "&gsiml;", "⪧": "&gtcc;", "⩺": "&gtcir;", "⋗": "&gtrdot;", "⦕": "&gtlPar;", "⩼": "&gtquest;", "⥸": "&gtrarr;", "≩︀": "&gvnE;", "ъ": "&hardcy;", "⥈": "&harrcir;", "↭": "&leftrightsquigarrow;", "ℏ": "&plankv;", "ĥ": "&hcirc;", "♥": "&heartsuit;", "…": "&mldr;", "⊹": "&hercon;", "𝔥": "&hfr;", "⤥": "&searhk;", "⤦": "&swarhk;", "⇿": "&hoarr;", "∻": "&homtht;", "↩": "&larrhk;", "↪": "&rarrhk;", "𝕙": "&hopf;", "―": "&horbar;", "𝒽": "&hscr;", "ħ": "&hstrok;", "⁃": "&hybull;", "í": "&iacute;", "î": "&icirc;", "и": "&icy;", "е": "&iecy;", "¡": "&iexcl;", "𝔦": "&ifr;", "ì": "&igrave;", "⨌": "&qint;", "∭": "&tint;", "⧜": "&iinfin;", "℩": "&iiota;", "ĳ": "&ijlig;", "ī": "&imacr;", "ı": "&inodot;", "⊷": "&imof;", "Ƶ": "&imped;", "℅": "&incare;", "∞": "&infin;", "⧝": "&infintie;", "⊺": "&intercal;", "⨗": "&intlarhk;", "⨼": "&iprod;", "ё": "&iocy;", "į": "&iogon;", "𝕚": "&iopf;", "ι": "&iota;", "¿": "&iquest;", "𝒾": "&iscr;", "⋹": "&isinE;", "⋵": "&isindot;", "⋴": "&isins;", "⋳": "&isinsv;", "ĩ": "&itilde;", "і": "&iukcy;", "ï": "&iuml;", "ĵ": "&jcirc;", "й": "&jcy;", "𝔧": "&jfr;", "ȷ": "&jmath;", "𝕛": "&jopf;", "𝒿": "&jscr;", "ј": "&jsercy;", "є": "&jukcy;", "κ": "&kappa;", "ϰ": "&varkappa;", "ķ": "&kcedil;", "к": "&kcy;", "𝔨": "&kfr;", "ĸ": "&kgreen;", "х": "&khcy;", "ќ": "&kjcy;", "𝕜": "&kopf;", "𝓀": "&kscr;", "⤛": "&lAtail;", "⤎": "&lBarr;", "⪋": "&lesseqqgtr;", "⥢": "&lHar;", "ĺ": "&lacute;", "⦴": "&laemptyv;", "λ": "&lambda;", "⦑": "&langd;", "⪅": "&lessapprox;", "«": "&laquo;", "⤟": "&larrbfs;", "⤝": "&larrfs;", "↫": "&looparrowleft;", "⤹": "&larrpl;", "⥳": "&larrsim;", "↢": "&leftarrowtail;", "⪫": "&lat;", "⤙": "&latail;", "⪭": "&late;", "⪭︀": "&lates;", "⤌": "&lbarr;", "❲": "&lbbrk;", "{": "&lcub;", "[": "&lsqb;", "⦋": "&lbrke;", "⦏": "&lbrksld;", "⦍": "&lbrkslu;", "ľ": "&lcaron;", "ļ": "&lcedil;", "л": "&lcy;", "⤶": "&ldca;", "⥧": "&ldrdhar;", "⥋": "&ldrushar;", "↲": "&ldsh;", "≤": "&leq;", "⇇": "&llarr;", "⋋": "&lthree;", "⪨": "&lescc;", "⩿": "&lesdot;", "⪁": "&lesdoto;", "⪃": "&lesdotor;", "⋚︀": "&lesg;", "⪓": "&lesges;", "⋖": "&ltdot;", "⥼": "&lfisht;", "𝔩": "&lfr;", "⪑": "&lgE;", "⥪": "&lharul;", "▄": "&lhblk;", "љ": "&ljcy;", "⥫": "&llhard;", "◺": "&lltri;", "ŀ": "&lmidot;", "⎰": "&lmoustache;", "≨": "&lneqq;", "⪉": "&lnapprox;", "⪇": "&lneq;", "⋦": "&lnsim;", "⟬": "&loang;", "⇽": "&loarr;", "⟼": "&xmap;", "↬": "&rarrlp;", "⦅": "&lopar;", "𝕝": "&lopf;", "⨭": "&loplus;", "⨴": "&lotimes;", "∗": "&lowast;", "◊": "&lozenge;", "(": "&lpar;", "⦓": "&lparlt;", "⥭": "&lrhard;", "‎": "&lrm;", "⊿": "&lrtri;", "‹": "&lsaquo;", "𝓁": "&lscr;", "⪍": "&lsime;", "⪏": "&lsimg;", "‚": "&sbquo;", "ł": "&lstrok;", "⪦": "&ltcc;", "⩹": "&ltcir;", "⋉": "&ltimes;", "⥶": "&ltlarr;", "⩻": "&ltquest;", "⦖": "&ltrPar;", "◃": "&triangleleft;", "⥊": "&lurdshar;", "⥦": "&luruhar;", "≨︀": "&lvnE;", "∺": "&mDDot;", "¯": "&strns;", "♂": "&male;", "✠": "&maltese;", "▮": "&marker;", "⨩": "&mcomma;", "м": "&mcy;", "—": "&mdash;", "𝔪": "&mfr;", "℧": "&mho;", "µ": "&micro;", "⫰": "&midcir;", "−": "&minus;", "⨪": "&minusdu;", "⫛": "&mlcp;", "⊧": "&models;", "𝕞": "&mopf;", "𝓂": "&mscr;", "μ": "&mu;", "⊸": "&mumap;", "⋙̸": "&nGg;", "≫⃒": "&nGt;", "⇍": "&nlArr;", "⇎": "&nhArr;", "⋘̸": "&nLl;", "≪⃒": "&nLt;", "⇏": "&nrArr;", "⊯": "&nVDash;", "⊮": "&nVdash;", "ń": "&nacute;", "∠⃒": "&nang;", "⩰̸": "&napE;", "≋̸": "&napid;", "ŉ": "&napos;", "♮": "&natural;", "⩃": "&ncap;", "ň": "&ncaron;", "ņ": "&ncedil;", "⩭̸": "&ncongdot;", "⩂": "&ncup;", "н": "&ncy;", "–": "&ndash;", "⇗": "&neArr;", "⤤": "&nearhk;", "≐̸": "&nedot;", "⤨": "&toea;", "𝔫": "&nfr;", "↮": "&nleftrightarrow;", "⫲": "&nhpar;", "⋼": "&nis;", "⋺": "&nisd;", "њ": "&njcy;", "≦̸": "&nleqq;", "↚": "&nleftarrow;", "‥": "&nldr;", "𝕟": "&nopf;", "¬": "&not;", "⋹̸": "&notinE;", "⋵̸": "&notindot;", "⋷": "&notinvb;", "⋶": "&notinvc;", "⋾": "&notnivb;", "⋽": "&notnivc;", "⫽⃥": "&nparsl;", "∂̸": "&npart;", "⨔": "&npolint;", "↛": "&nrightarrow;", "⤳̸": "&nrarrc;", "↝̸": "&nrarrw;", "𝓃": "&nscr;", "⊄": "&nsub;", "⫅̸": "&nsubseteqq;", "⊅": "&nsup;", "⫆̸": "&nsupseteqq;", "ñ": "&ntilde;", "ν": "&nu;", "#": "&num;", "№": "&numero;", " ": "&numsp;", "⊭": "&nvDash;", "⤄": "&nvHarr;", "≍⃒": "&nvap;", "⊬": "&nvdash;", "≥⃒": "&nvge;", ">⃒": "&nvgt;", "⧞": "&nvinfin;", "⤂": "&nvlArr;", "≤⃒": "&nvle;", "<⃒": "&nvlt;", "⊴⃒": "&nvltrie;", "⤃": "&nvrArr;", "⊵⃒": "&nvrtrie;", "∼⃒": "&nvsim;", "⇖": "&nwArr;", "⤣": "&nwarhk;", "⤧": "&nwnear;", "ó": "&oacute;", "ô": "&ocirc;", "о": "&ocy;", "ő": "&odblac;", "⨸": "&odiv;", "⦼": "&odsold;", "œ": "&oelig;", "⦿": "&ofcir;", "𝔬": "&ofr;", "˛": "&ogon;", "ò": "&ograve;", "⧁": "&ogt;", "⦵": "&ohbar;", "⦾": "&olcir;", "⦻": "&olcross;", "⧀": "&olt;", "ō": "&omacr;", "ω": "&omega;", "ο": "&omicron;", "⦶": "&omid;", "𝕠": "&oopf;", "⦷": "&opar;", "⦹": "&operp;", "∨": "&vee;", "⩝": "&ord;", "ℴ": "&oscr;", "ª": "&ordf;", "º": "&ordm;", "⊶": "&origof;", "⩖": "&oror;", "⩗": "&orslope;", "⩛": "&orv;", "ø": "&oslash;", "⊘": "&osol;", "õ": "&otilde;", "⨶": "&otimesas;", "ö": "&ouml;", "⌽": "&ovbar;", "¶": "&para;", "⫳": "&parsim;", "⫽": "&parsl;", "п": "&pcy;", "%": "&percnt;", ".": "&period;", "‰": "&permil;", "‱": "&pertenk;", "𝔭": "&pfr;", "φ": "&phi;", "ϕ": "&varphi;", "☎": "&phone;", "π": "&pi;", "ϖ": "&varpi;", "ℎ": "&planckh;", "+": "&plus;", "⨣": "&plusacir;", "⨢": "&pluscir;", "⨥": "&plusdu;", "⩲": "&pluse;", "⨦": "&plussim;", "⨧": "&plustwo;", "⨕": "&pointint;", "𝕡": "&popf;", "£": "&pound;", "⪳": "&prE;", "⪷": "&precapprox;", "⪹": "&prnap;", "⪵": "&prnE;", "⋨": "&prnsim;", "′": "&prime;", "⌮": "&profalar;", "⌒": "&profline;", "⌓": "&profsurf;", "⊰": "&prurel;", "𝓅": "&pscr;", "ψ": "&psi;", " ": "&puncsp;", "𝔮": "&qfr;", "𝕢": "&qopf;", "⁗": "&qprime;", "𝓆": "&qscr;", "⨖": "&quatint;", "?": "&quest;", "⤜": "&rAtail;", "⥤": "&rHar;", "∽̱": "&race;", "ŕ": "&racute;", "⦳": "&raemptyv;", "⦒": "&rangd;", "⦥": "&range;", "»": "&raquo;", "⥵": "&rarrap;", "⤠": "&rarrbfs;", "⤳": "&rarrc;", "⤞": "&rarrfs;", "⥅": "&rarrpl;", "⥴": "&rarrsim;", "↣": "&rightarrowtail;", "↝": "&rightsquigarrow;", "⤚": "&ratail;", "∶": "&ratio;", "❳": "&rbbrk;", "}": "&rcub;", "]": "&rsqb;", "⦌": "&rbrke;", "⦎": "&rbrksld;", "⦐": "&rbrkslu;", "ř": "&rcaron;", "ŗ": "&rcedil;", "р": "&rcy;", "⤷": "&rdca;", "⥩": "&rdldhar;", "↳": "&rdsh;", "▭": "&rect;", "⥽": "&rfisht;", "𝔯": "&rfr;", "⥬": "&rharul;", "ρ": "&rho;", "ϱ": "&varrho;", "⇉": "&rrarr;", "⋌": "&rthree;", "˚": "&ring;", "‏": "&rlm;", "⎱": "&rmoustache;", "⫮": "&rnmid;", "⟭": "&roang;", "⇾": "&roarr;", "⦆": "&ropar;", "𝕣": "&ropf;", "⨮": "&roplus;", "⨵": "&rotimes;", ")": "&rpar;", "⦔": "&rpargt;", "⨒": "&rppolint;", "›": "&rsaquo;", "𝓇": "&rscr;", "⋊": "&rtimes;", "▹": "&triangleright;", "⧎": "&rtriltri;", "⥨": "&ruluhar;", "℞": "&rx;", "ś": "&sacute;", "⪴": "&scE;", "⪸": "&succapprox;", "š": "&scaron;", "ş": "&scedil;", "ŝ": "&scirc;", "⪶": "&succneqq;", "⪺": "&succnapprox;", "⋩": "&succnsim;", "⨓": "&scpolint;", "с": "&scy;", "⋅": "&sdot;", "⩦": "&sdote;", "⇘": "&seArr;", "§": "&sect;", ";": "&semi;", "⤩": "&tosa;", "✶": "&sext;", "𝔰": "&sfr;", "♯": "&sharp;", "щ": "&shchcy;", "ш": "&shcy;", "­": "&shy;", "σ": "&sigma;", "ς": "&varsigma;", "⩪": "&simdot;", "⪞": "&simg;", "⪠": "&simgE;", "⪝": "&siml;", "⪟": "&simlE;", "≆": "&simne;", "⨤": "&simplus;", "⥲": "&simrarr;", "⨳": "&smashp;", "⧤": "&smeparsl;", "⌣": "&ssmile;", "⪪": "&smt;", "⪬": "&smte;", "⪬︀": "&smtes;", "ь": "&softcy;", "/": "&sol;", "⧄": "&solb;", "⌿": "&solbar;", "𝕤": "&sopf;", "♠": "&spadesuit;", "⊓︀": "&sqcaps;", "⊔︀": "&sqcups;", "𝓈": "&sscr;", "☆": "&star;", "⊂": "&subset;", "⫅": "&subseteqq;", "⪽": "&subdot;", "⫃": "&subedot;", "⫁": "&submult;", "⫋": "&subsetneqq;", "⊊": "&subsetneq;", "⪿": "&subplus;", "⥹": "&subrarr;", "⫇": "&subsim;", "⫕": "&subsub;", "⫓": "&subsup;", "♪": "&sung;", "¹": "&sup1;", "²": "&sup2;", "³": "&sup3;", "⫆": "&supseteqq;", "⪾": "&supdot;", "⫘": "&supdsub;", "⫄": "&supedot;", "⟉": "&suphsol;", "⫗": "&suphsub;", "⥻": "&suplarr;", "⫂": "&supmult;", "⫌": "&supsetneqq;", "⊋": "&supsetneq;", "⫀": "&supplus;", "⫈": "&supsim;", "⫔": "&supsub;", "⫖": "&supsup;", "⇙": "&swArr;", "⤪": "&swnwar;", "ß": "&szlig;", "⌖": "&target;", "τ": "&tau;", "ť": "&tcaron;", "ţ": "&tcedil;", "т": "&tcy;", "⌕": "&telrec;", "𝔱": "&tfr;", "θ": "&theta;", "ϑ": "&vartheta;", "þ": "&thorn;", "×": "&times;", "⨱": "&timesbar;", "⨰": "&timesd;", "⌶": "&topbot;", "⫱": "&topcir;", "𝕥": "&topf;", "⫚": "&topfork;", "‴": "&tprime;", "▵": "&utri;", "≜": "&trie;", "◬": "&tridot;", "⨺": "&triminus;", "⨹": "&triplus;", "⧍": "&trisb;", "⨻": "&tritime;", "⏢": "&trpezium;", "𝓉": "&tscr;", "ц": "&tscy;", "ћ": "&tshcy;", "ŧ": "&tstrok;", "⥣": "&uHar;", "ú": "&uacute;", "ў": "&ubrcy;", "ŭ": "&ubreve;", "û": "&ucirc;", "у": "&ucy;", "ű": "&udblac;", "⥾": "&ufisht;", "𝔲": "&ufr;", "ù": "&ugrave;", "▀": "&uhblk;", "⌜": "&ulcorner;", "⌏": "&ulcrop;", "◸": "&ultri;", "ū": "&umacr;", "ų": "&uogon;", "𝕦": "&uopf;", "υ": "&upsilon;", "⇈": "&uuarr;", "⌝": "&urcorner;", "⌎": "&urcrop;", "ů": "&uring;", "◹": "&urtri;", "𝓊": "&uscr;", "⋰": "&utdot;", "ũ": "&utilde;", "ü": "&uuml;", "⦧": "&uwangle;", "⫨": "&vBar;", "⫩": "&vBarv;", "⦜": "&vangrt;", "⊊︀": "&vsubne;", "⫋︀": "&vsubnE;", "⊋︀": "&vsupne;", "⫌︀": "&vsupnE;", "в": "&vcy;", "⊻": "&veebar;", "≚": "&veeeq;", "⋮": "&vellip;", "𝔳": "&vfr;", "𝕧": "&vopf;", "𝓋": "&vscr;", "⦚": "&vzigzag;", "ŵ": "&wcirc;", "⩟": "&wedbar;", "≙": "&wedgeq;", "℘": "&wp;", "𝔴": "&wfr;", "𝕨": "&wopf;", "𝓌": "&wscr;", "𝔵": "&xfr;", "ξ": "&xi;", "⋻": "&xnis;", "𝕩": "&xopf;", "𝓍": "&xscr;", "ý": "&yacute;", "я": "&yacy;", "ŷ": "&ycirc;", "ы": "&ycy;", "¥": "&yen;", "𝔶": "&yfr;", "ї": "&yicy;", "𝕪": "&yopf;", "𝓎": "&yscr;", "ю": "&yucy;", "ÿ": "&yuml;", "ź": "&zacute;", "ž": "&zcaron;", "з": "&zcy;", "ż": "&zdot;", "ζ": "&zeta;", "𝔷": "&zfr;", "ж": "&zhcy;", "⇝": "&zigrarr;", "𝕫": "&zopf;", "𝓏": "&zscr;", "‍": "&zwj;", "‌": "&zwnj;" } } };
  }
});

// node_modules/html-entities/lib/numeric-unicode-map.js
var require_numeric_unicode_map = __commonJS({
  "node_modules/html-entities/lib/numeric-unicode-map.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numericUnicodeMap = { 0: 65533, 128: 8364, 130: 8218, 131: 402, 132: 8222, 133: 8230, 134: 8224, 135: 8225, 136: 710, 137: 8240, 138: 352, 139: 8249, 140: 338, 142: 381, 145: 8216, 146: 8217, 147: 8220, 148: 8221, 149: 8226, 150: 8211, 151: 8212, 152: 732, 153: 8482, 154: 353, 155: 8250, 156: 339, 158: 382, 159: 376 };
  }
});

// node_modules/html-entities/lib/surrogate-pairs.js
var require_surrogate_pairs = __commonJS({
  "node_modules/html-entities/lib/surrogate-pairs.js"(exports) {
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

// node_modules/html-entities/lib/index.js
var require_lib = __commonJS({
  "node_modules/html-entities/lib/index.js"(exports) {
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

// src/main.js
var main_exports = {};
__export(main_exports, {
  getRequestOptions: () => getRequestOptions,
  read: () => read,
  setRequestOptions: () => setRequestOptions
});
module.exports = __toCommonJS(main_exports);

// src/utils/logger.js
var import_src = __toESM(require_src(), 1);
var name = "feed-reader";
var info = (0, import_src.default)(`${name}:info`);
var error = (0, import_src.default)(`${name}:error`);
var warning = (0, import_src.default)(`${name}:warning`);
var logger_default = {
  info: (0, import_src.default)(`${name}:info`),
  error: (0, import_src.default)(`${name}:error`),
  warning: (0, import_src.default)(`${name}:warning`)
};

// src/config.js
var import_bellajs = __toESM(require_bella(), 1);
var requestOptions = {
  headers: {
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0"
  },
  responseType: "text",
  responseEncoding: "utf8",
  timeout: 6e4,
  maxRedirects: 3
};
var getRequestOptions = () => {
  return (0, import_bellajs.clone)(requestOptions);
};
var setRequestOptions = (opts) => {
  (0, import_bellajs.copies)(opts, requestOptions);
};

// src/utils/retrieve.js
var retrieve_default = async (url, requestFn) => {
  try {
    const res = await requestFn(url, getRequestOptions);
    const contentType = res.headers["content-type"] || "";
    if (!contentType || !contentType.includes("xml")) {
      logger_default.error(`Got invalid content-type (${contentType}) from "${url}"`);
      return null;
    }
    const result = {
      url,
      xml: res.data
    };
    return result;
  } catch (err) {
    logger_default.error(err.message || err);
    return null;
  }
};

// src/utils/xml2obj.js
var import_fxp = __toESM(require_fxp(), 1);
var xml2obj_default = (xml = "") => {
  const options = {
    ignoreAttributes: false
  };
  info("Parsing XML data...");
  const parser = new import_fxp.XMLParser(options);
  const jsonObj = parser.parse(xml);
  return jsonObj;
};

// src/utils/parser.js
var import_html_entities = __toESM(require_lib(), 1);
var import_bellajs2 = __toESM(require_bella(), 1);

// src/utils/purifyUrl.js
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
var purifyUrl_default = (url) => {
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

// src/utils/parser.js
var toISODateString = (dstr) => {
  try {
    return new Date(dstr).toISOString();
  } catch (err) {
    return "";
  }
};
var toDate = (val) => {
  return val ? toISODateString(val) : "";
};
var toText = (val) => {
  const txt = (0, import_bellajs2.isObject)(val) ? val._text || val["#text"] || val._cdata || val.$t : val;
  return txt ? (0, import_html_entities.decode)(String(txt).trim()) : "";
};
var toDesc = (val) => {
  const txt = toText(val);
  const stripped = (0, import_bellajs2.stripTags)(txt);
  return (0, import_bellajs2.truncate)(stripped, 240);
};
var toLink = (val) => {
  const getEntryLink = (links) => {
    const link = links.find((item) => {
      return item.rel === "alternate";
    });
    return link ? toText(link.href) : "";
  };
  return (0, import_bellajs2.isString)(val) ? toText(val) : (0, import_bellajs2.isObject)(val) && (0, import_bellajs2.hasProperty)(val, "href") ? toText(val.href) : (0, import_bellajs2.isObject)(val) && (0, import_bellajs2.hasProperty)(val, "@_href") ? toText(val["@_href"]) : (0, import_bellajs2.isObject)(val) && (0, import_bellajs2.hasProperty)(val, "_attributes") ? toText(val._attributes.href) : (0, import_bellajs2.isArray)(val) ? toLink(val[0]) : getEntryLink(val);
};
var nomalizeRssItem = (entry) => {
  return {
    title: toText(entry.title),
    link: purifyUrl_default(toLink(entry.link)),
    description: toDesc(entry.description),
    published: toDate(toText(entry.pubDate))
  };
};
var nomalizeAtomItem = (entry) => {
  return {
    title: toText(entry.title),
    link: purifyUrl_default(toLink(entry.link)),
    description: toDesc(entry.summary || entry.description || entry.content),
    published: toDate(toText(entry.updated || entry.published))
  };
};
var parseRSS = (xmldata) => {
  const { rss = {} } = xmldata;
  const { channel = {} } = rss;
  const {
    title = "",
    link = "",
    description = "",
    generator = "",
    language = "",
    lastBuildDate = "",
    item = []
  } = channel;
  const entries = (0, import_bellajs2.isArray)(item) ? item.map(nomalizeRssItem) : [nomalizeRssItem(item)];
  return {
    title,
    link: purifyUrl_default(link),
    description,
    generator,
    language,
    published: toDate(lastBuildDate),
    entries
  };
};
var parseAtom = (xmldata) => {
  const { feed = {} } = xmldata;
  const {
    title = "",
    link = "",
    subtitle = "",
    generator = "",
    language = "",
    updated = "",
    entry = []
  } = feed;
  const entries = (0, import_bellajs2.isArray)(entry) ? entry.map(nomalizeAtomItem) : [nomalizeAtomItem(entry)];
  return {
    title: toText(title),
    link: purifyUrl_default(toLink(link)),
    description: subtitle,
    generator,
    language,
    published: toDate(updated),
    entries
  };
};

// src/utils/validator.js
var import_bellajs3 = __toESM(require_bella(), 1);
var import_fast_xml_parser = __toESM(require_fxp(), 1);
var isRSS = (data = {}) => {
  return (0, import_bellajs3.hasProperty)(data, "rss") && (0, import_bellajs3.hasProperty)(data.rss, "channel");
};
var isAtom = (data = {}) => {
  return (0, import_bellajs3.hasProperty)(data, "feed") && (0, import_bellajs3.hasProperty)(data.feed, "entry");
};
var validate = (xml = "") => {
  const result = import_fast_xml_parser.XMLValidator.validate(xml);
  return result === true;
};

// src/main.js
var read = async (url, requestFn) => {
  const xmldata = await retrieve_default(url, requestFn);
  if (!xmldata) {
    throw new Error(`Could not fetch XML content from "${url}"`);
  }
  const { xml } = xmldata;
  if (!validate(xml)) {
    throw new Error(`Failed while validating XML format from "${url}"`);
  }
  info("Parsing XML data...");
  const jsonObj = xml2obj_default(xml);
  return isRSS(jsonObj) ? parseRSS(jsonObj) : isAtom(jsonObj) ? parseAtom(jsonObj) : null;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRequestOptions,
  read,
  setRequestOptions
});

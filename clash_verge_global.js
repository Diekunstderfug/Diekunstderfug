// ======================================================
// Clash Verge Rev / Mihomo — Ultimate Rules v5.5
// ======================================================
// ↓↓↓ 日常只改这一段，下面的引擎部分不用动 ↓↓↓
// ======================================================


// ======================================================
// User config
// ======================================================

// ----- VPS 节点名（精确匹配）-----
const VPS_NODE_NAME = [];

// ----- VPS 专用规则（会插到所有规则最前）-----
const VPS_RULES = [];

// ----- 自定义规则（Layer 0，优先级最高）-----
const CUSTOM_RULES = [
    "DOMAIN-SUFFIX,pku.edu.cn,DIRECT"
];

// ----- 自定义 provider（同名会覆盖内置 provider）-----
const CUSTOM_RULE_PROVIDERS = {};

// ----- Rule-set 下载源 -----
const META = "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo";
const APPLICATIONS = "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt";

// ----- provider 下载出口：字符串 "🚀 PROXY" / "🎯 DIRECT" / null(直连) -----
const RULE_DOWNLOAD_PROXY = "🚀 PROXY";   // = GROUP.PROXY

// ----- DNS -----
const DNS_BOOTSTRAP = ["223.5.5.5", "119.29.29.29"];
const DNS_DOH = ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"];

// ----- 健康检查 -----
const TEST_URL = "https://www.gstatic.com/generate_204";
const TEST_INTERVAL = 300;

// ----- 机场信息节点过滤 -----
const NODE_EXCLUDE = String.raw`(?i)(官网|官網|套餐|流量|机场|機場|订阅|訂閱|剩余|剩餘|到期|过期|過期|有效期|expire|traffic|reset|quota)`;


// ======================================================
// ↓↓↓ 以下为引擎，一般无需修改 ↓↓↓
// ======================================================


// =========================
// Names
// =========================

const GROUP = Object.freeze({
    GFW: "🎏 GFW Mode",
    PROXY: "🚀 PROXY",
    AI: "🤖 AI",
    GOOGLE: "✨ Google",
    GITHUB: "⚛️ GitHub",
    SCHOLAR: "📚 Scholar",
    YOUTUBE: "🍷 Youtube",
    TELEGRAM: "📲 Telegram",
    APPLE: "🍎 Apple",
    MICROSOFT: "Ⓜ️ Microsoft",
    STEAM: "🎮 Steam",
    BILIBILI: "📺 BiliBili",
    TENCENT: "🐧 Tencent",
    VPS: "Vps-service",
    AUTO: "♻️ Auto",
    BALANCE: "⚖️ Balance",
    FAILOVER: "🛠️ Failover",
    DIRECT: "🎯 DIRECT",
    ADS: "🚫 AD",
});

const REGION = Object.freeze({
    HK: "HK 香港",
    TW: "TW 台湾",
    US: "US 美国",
    JP: "JP 日本",
    SG: "SG 狮城",
    KR: "KR 韩国",
    GB: "GB 英国",
});

// Region pattern — 单一来源，(?i)/RegExp 双端派生
const REGION_PATTERN = Object.freeze({
    [REGION.HK]: String.raw`(香港|🇭🇰|(^|[^A-Za-z])HK([^A-Za-z]|$)|HKG|Hong\s?Kong)`,
    [REGION.TW]: String.raw`(台湾|臺灣|🇹🇼|(^|[^A-Za-z])TW([^A-Za-z]|$)|TWN|Taiwan)`,
    [REGION.US]: String.raw`(美国|美國|🇺🇸|(^|[^A-Za-z])US([^A-Za-z]|$)|USA|United\s?States|America)`,
    [REGION.JP]: String.raw`(日本|🇯🇵|(^|[^A-Za-z])JP([^A-Za-z]|$)|JPN|Japan)`,
    [REGION.SG]: String.raw`(新加坡|狮城|獅城|🇸🇬|(^|[^A-Za-z])SG([^A-Za-z]|$)|SGP|Singapore)`,
    [REGION.KR]: String.raw`(韩国|韓國|🇰🇷|(^|[^A-Za-z])KR([^A-Za-z]|$)|KOR|Korea)`,
    [REGION.GB]: String.raw`(英国|英國|🇬🇧|(^|[^A-Za-z])GB([^A-Za-z]|$)|GBR|United\s?Kingdom|England)`,
});

const REGION_FILTER = Object.freeze(
    Object.fromEntries(
        Object.entries(REGION_PATTERN).map(([r, p]) => [r, `(?i)${p}`])
    )
);

const REGION_DETECT = Object.freeze(
    Object.fromEntries(
        Object.entries(REGION_PATTERN).map(([r, p]) => [r, new RegExp(p, "i")])
    )
);

const COMMON_REGIONS = [REGION.HK, REGION.TW, REGION.US, REGION.JP, REGION.SG];

const FAILOVER_ORDER = [REGION.HK, REGION.JP, REGION.SG, REGION.US, REGION.TW, REGION.KR, REGION.GB];


// =========================
// App policies
// =========================

const MODE = Object.freeze({
    REGION: "region",
    NO_DIRECT: "no-direct",
    WITH_DIRECT: "with-direct",
    DIRECT_FIRST: "direct-first",
    DIRECT_PROXY: "direct-proxy",
});

const APP_POLICY = Object.freeze({
    [GROUP.AI]: { mode: MODE.REGION, regions: [REGION.US], emergencyProxy: true },
    [GROUP.GOOGLE]: { mode: MODE.REGION, regions: [REGION.US], emergencyProxy: true },
    [GROUP.GITHUB]: { mode: MODE.NO_DIRECT },
    [GROUP.SCHOLAR]: { mode: MODE.WITH_DIRECT },
    [GROUP.YOUTUBE]: { mode: MODE.NO_DIRECT },
    [GROUP.TELEGRAM]: { mode: MODE.NO_DIRECT },
    [GROUP.APPLE]: { mode: MODE.WITH_DIRECT },
    [GROUP.MICROSOFT]: { mode: MODE.WITH_DIRECT },
    [GROUP.STEAM]: { mode: MODE.WITH_DIRECT },
    [GROUP.BILIBILI]: { mode: MODE.DIRECT_FIRST },
    [GROUP.TENCENT]: { mode: MODE.DIRECT_PROXY },
});


// =========================
// Rule-set registry
// =========================

const SERVICES = Object.freeze([
    ["AI", GROUP.AI, "category-ai-!cn"],
    ["Google", GROUP.GOOGLE, "google"],
    ["GitHub", GROUP.GITHUB, "github"],
    ["Scholar", GROUP.SCHOLAR, "category-scholar-!cn"],
    ["Youtube", GROUP.YOUTUBE, "youtube"],
    ["Telegram", GROUP.TELEGRAM, "telegram"],
    ["Apple", GROUP.APPLE, "apple"],
    ["Microsoft", GROUP.MICROSOFT, "microsoft"],
    ["Steam", GROUP.STEAM, "steam"],
    ["BiliBili", GROUP.BILIBILI, "bilibili"],
    ["Tencent", GROUP.TENCENT, "tencent"],
]);

const ROUTE_ORDER = Object.freeze([
    "AI",
    "Scholar", "Youtube",
    "GitHub",
    "Telegram", "Steam", "BiliBili", "Tencent", "Apple",
    "Google", "Microsoft",
]);

const SERVICE_BY_PROVIDER = Object.freeze(
    Object.fromEntries(
        SERVICES.map(([provider, group, geosite]) => [
            provider, { provider, group, geosite },
        ])
    )
);

// High-priority exceptions — provider 自动创建 + 在所有 APP 规则前匹配
const RULE_EXCEPTIONS = Object.freeze([
    // Steam 国内 CDN（不含 steamcontent.com / steamstatic.com）
    {
        provider: "SteamCN",
        kind: "geosite",
        source: "steam@cn",
        behavior: "domain",
        target: GROUP.DIRECT,
        path: "steam-cn",
    },
    // 国内游戏平台 CDN 全集（steam@cn 的父集）
    {
        provider: "GameCN",
        kind: "geosite",
        source: "category-games@cn",
        behavior: "domain",
        target: GROUP.DIRECT,
        path: "games-cn",
    },
]);


// ======================================================
// Helpers
// ======================================================

const uniq = a => [...new Set(a.filter(Boolean))];
const asArray = v => (Array.isArray(v) ? v : []);

function escapeRegex(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exactRegex(names) {
    const x = names.filter(Boolean).map(escapeRegex);
    return x.length ? `^(?:${x.join("|")})$` : String.raw`a^`;
}

function combineRegionFilters(regions) {
    const patterns = regions.map(r => REGION_PATTERN[r]).filter(Boolean);
    if (!patterns.length) return null;
    if (patterns.length === 1) return `(?i)${patterns[0]}`;
    return `(?i)(?:${patterns.map(p => `(?:${p})`).join("|")})`;
}

function dynamic(filter = null, emptyFallback = "REJECT") {
    const x = {
        "include-all": true,
        "exclude-type": "Direct",
        "exclude-filter": NODE_EXCLUDE,
        "empty-fallback": emptyFallback,
    };
    if (filter) x.filter = filter;
    return x;
}


// ======================================================
// Detect actually available regions
// ======================================================

function collectProxyNames(config) {
    const names = new Set();
    const oldGroups = asArray(config["proxy-groups"]);
    const oldGroupNames = new Set(oldGroups.map(g => g?.name).filter(Boolean));

    for (const p of config.proxies || []) {
        if (p?.name) names.add(p.name);
    }

    for (const g of oldGroups) {
        for (const n of g?.proxies || []) {
            if (
                typeof n === "string" &&
                !oldGroupNames.has(n) &&
                n !== "DIRECT" && n !== "REJECT" && n !== "REJECT-DROP"
            ) {
                names.add(n);
            }
        }
    }

    for (const p of Object.values(config["proxy-providers"] || {})) {
        for (const list of [p?.proxies, p?.payload]) {
            if (!Array.isArray(list)) continue;
            for (const n of list) {
                if (typeof n === "string") names.add(n);
                else if (n?.name) names.add(n.name);
            }
        }
    }
    return names;
}

function providersAreOpaque(config) {
    return Object.values(config["proxy-providers"] || {})
        .some(p => !Array.isArray(p?.proxies) && !Array.isArray(p?.payload));
}

function detectRegions(config) {
    if (providersAreOpaque(config)) {
        return new Set(Object.values(REGION));
    }
    const names = [...collectProxyNames(config)];
    return new Set(
        Object.entries(REGION_DETECT)
            .filter(([, re]) => names.some(name => re.test(name)))
            .map(([region]) => region)
    );
}


// ======================================================
// Group builders
// ======================================================

function commonNoDirect(available) {
    return [
        GROUP.PROXY,
        GROUP.AUTO,
        GROUP.FAILOVER,
        ...COMMON_REGIONS.filter(r => available.has(r)),
    ];
}

function commonWithDirect(available) {
    return [...commonNoDirect(available), GROUP.DIRECT];
}

function buildApp(name, available) {
    const p = APP_POLICY[name];
    if (!p) throw new Error(`Missing APP_POLICY: ${name}`);

    // REGION — AI/Google：US url-test + US nodes + PROXY emergency
    if (p.mode === MODE.REGION) {
        const regions = uniq(p.regions || []).filter(r => available.has(r));

        if (!regions.length) {
            const fallback = p.emergencyProxy ? GROUP.PROXY : "REJECT";
            return {
                name, type: "select",
                proxies: [fallback],
                "default-selected": fallback,
            };
        }

        const proxies = [...regions];
        if (p.emergencyProxy) proxies.push(GROUP.PROXY);

        return {
            name, type: "select", proxies,
            ...dynamic(combineRegionFilters(regions)),
            "default-selected": regions[0],
        };
    }

    if (p.mode === MODE.NO_DIRECT) {
        return {
            name, type: "select",
            proxies: commonNoDirect(available),
            "default-selected": GROUP.PROXY,
        };
    }

    if (p.mode === MODE.WITH_DIRECT) {
        return {
            name, type: "select",
            proxies: commonWithDirect(available),
            "default-selected": GROUP.PROXY,
        };
    }

    if (p.mode === MODE.DIRECT_FIRST) {
        return {
            name, type: "select",
            proxies: [GROUP.DIRECT, ...commonNoDirect(available)],
            "default-selected": GROUP.DIRECT,
        };
    }

    if (p.mode === MODE.DIRECT_PROXY) {
        return {
            name, type: "select",
            proxies: [GROUP.DIRECT, GROUP.PROXY],
            "default-selected": GROUP.DIRECT,
        };
    }

    throw new Error(`Unknown APP_MODE: ${name}`);
}

function buildRegions(available) {
    return Object.entries(REGION_FILTER)
        .filter(([name]) => available.has(name))
        .map(([name, filter]) => ({
            name,
            type: "url-test",
            url: TEST_URL,
            interval: TEST_INTERVAL,
            timeout: 5000,
            lazy: true,
            tolerance: 30,
            "expected-status": 204,
            ...dynamic(filter),
        }));
}

function buildGroups(available) {
    const failRegions = FAILOVER_ORDER.filter(r => available.has(r));

    return [
        // Global
        {
            name: GROUP.GFW, type: "select",
            proxies: [GROUP.PROXY, GROUP.DIRECT],
            "default-selected": GROUP.PROXY,
        },
        {
            name: GROUP.PROXY, type: "select",
            proxies: [GROUP.AUTO, GROUP.FAILOVER, GROUP.BALANCE],
            ...dynamic(),
            "default-selected": GROUP.AUTO,
        },

        // Primary apps
        buildApp(GROUP.AI, available),
        buildApp(GROUP.GOOGLE, available),
        buildApp(GROUP.GITHUB, available),
        buildApp(GROUP.SCHOLAR, available),
        buildApp(GROUP.YOUTUBE, available),
        buildApp(GROUP.TELEGRAM, available),

        // General apps
        buildApp(GROUP.APPLE, available),
        buildApp(GROUP.MICROSOFT, available),
        buildApp(GROUP.STEAM, available),
        buildApp(GROUP.BILIBILI, available),
        buildApp(GROUP.TENCENT, available),

        // VPS
        {
            name: GROUP.VPS, type: "select",
            proxies: [GROUP.DIRECT],
            ...dynamic(exactRegex(VPS_NODE_NAME), "DIRECT"),
            "default-selected": VPS_NODE_NAME[0] || GROUP.DIRECT,
        },

        // Advanced engines
        {
            name: GROUP.AUTO, type: "url-test",
            url: TEST_URL, interval: TEST_INTERVAL,
            timeout: 5000, lazy: true, tolerance: 30,
            "expected-status": 204,
            ...dynamic(),
        },
        {
            name: GROUP.BALANCE, type: "load-balance",
            strategy: "consistent-hashing",
            url: TEST_URL, interval: TEST_INTERVAL,
            timeout: 5000, lazy: true,
            "expected-status": 204,
            ...dynamic(),
        },
        {
            name: GROUP.FAILOVER, type: "fallback",
            proxies: [...failRegions, GROUP.AUTO],
            url: TEST_URL, interval: TEST_INTERVAL,
            timeout: 5000, lazy: true,
            "expected-status": 204,
        },

        // Region groups
        ...buildRegions(available),

        // Utilities
        {
            name: GROUP.DIRECT, type: "select",
            proxies: ["DIRECT"],
        },
        {
            name: GROUP.ADS, type: "select",
            proxies: ["REJECT", "REJECT-DROP", GROUP.DIRECT],
            "default-selected": "REJECT",
        },
    ];
}


// ======================================================
// Rule providers
// ======================================================

function viaProxy(x) {
    return RULE_DOWNLOAD_PROXY ? { ...x, proxy: RULE_DOWNLOAD_PROXY } : x;
}

function mrs(kind, source, behavior, path = source) {
    return viaProxy({
        type: "http",
        behavior,
        format: "mrs",
        interval: 86400,
        url: `${META}/${kind}/${source}.mrs`,
        path: `./ruleset/${path}.mrs`,
    });
}

function buildProviders() {
    const x = {
        applications: viaProxy({
            type: "http",
            behavior: "classical",
            format: "text",
            interval: 86400,
            url: APPLICATIONS,
            path: "./ruleset/applications.txt",
        }),
        private: mrs("geosite", "private", "domain", "private-domain"),
        "geoip-private": mrs("geoip", "private", "ipcidr", "private-ip"),
        "geosite-cn": mrs("geosite", "cn", "domain", "cn-domain"),
        "geoip-cn": mrs("geoip", "cn", "ipcidr", "cn-ip"),
        geolocationNotCN: mrs("geosite", "geolocation-!cn", "domain", "geolocation-not-cn"),
        telegramcidr: mrs("geoip", "telegram", "ipcidr", "telegram-ip"),
        ads: mrs("geosite", "category-ads-all", "domain", "ads"),
    };

    for (const [provider, , geosite] of SERVICES) {
        x[provider] = mrs("geosite", geosite, "domain", `service-${provider.toLowerCase()}`);
    }

    for (const exception of RULE_EXCEPTIONS) {
        x[exception.provider] = mrs(
            exception.kind,
            exception.source,
            exception.behavior,
            exception.path || exception.provider.toLowerCase()
        );
    }

    return { ...x, ...CUSTOM_RULE_PROVIDERS };
}


// ======================================================
// Routing
// ======================================================

function buildRules() {
    const serviceRules = ROUTE_ORDER.map(provider => {
        const service = SERVICE_BY_PROVIDER[provider];
        if (!service) throw new Error(`Unknown ROUTE_ORDER provider: ${provider}`);
        return `RULE-SET,${service.provider},${service.group}`;
    });

    return [
        // Layer 0 — overrides
        ...VPS_RULES,
        ...CUSTOM_RULES,

        // Layer 1 — local / private
        `RULE-SET,applications,${GROUP.DIRECT}`,
        `RULE-SET,private,${GROUP.DIRECT}`,
        `RULE-SET,geoip-private,${GROUP.DIRECT},no-resolve`,

        // Layer 2 — ads
        `RULE-SET,ads,${GROUP.ADS}`,

        // Layer 3 — service exceptions (SteamCN MUST precede Steam)
        ...RULE_EXCEPTIONS.map(e => `RULE-SET,${e.provider},${e.target}`),

        // Layer 4 — explicit services
        ...serviceRules,

        // Layer 5 — telegram direct-IP
        `RULE-SET,telegramcidr,${GROUP.TELEGRAM},no-resolve`,

        // Layer 6 — generic overseas
        `RULE-SET,geolocationNotCN,${GROUP.GFW}`,

        // Layer 7 — mainland China
        `RULE-SET,geosite-cn,${GROUP.DIRECT}`,
        `RULE-SET,geoip-cn,${GROUP.DIRECT},no-resolve`,

        // Layer 8 — unknown
        `MATCH,${GROUP.GFW}`,
    ];
}


// ======================================================
// DNS
// ======================================================

function patchDns(config) {
    const old = config.dns || {};
    const policy = (old["nameserver-policy"] && typeof old["nameserver-policy"] === "object")
        ? old["nameserver-policy"]
        : {};

    config.dns = {
        ...old,
        "default-nameserver": [...DNS_BOOTSTRAP],
        nameserver: [...DNS_DOH],
        "proxy-server-nameserver": [...DNS_DOH],
        "direct-nameserver": [...DNS_DOH],
        "direct-nameserver-follow-policy": true,
        "nameserver-policy": {
            ...policy,
            "geosite:cn": [...DNS_DOH],
            "+.lan": "system",
            "+.local": "system",
            "+.home.arpa": "system",
        },
        "fake-ip-filter": uniq([
            ...asArray(old["fake-ip-filter"]),
            "routerlogin.net",
            "+.msftconnecttest.com",
            "+.msftncsi.com",
            "+.lan", "+.local", "+.home.arpa",
            "time.windows.com",
            "time.apple.com",
            "pool.ntp.org",
        ]),
    };
}


// ======================================================
// Main
// ======================================================

function main(config) {
    const hasStatic = Array.isArray(config.proxies) && config.proxies.length > 0;
    const hasProviders = config["proxy-providers"] &&
        Object.keys(config["proxy-providers"]).length > 0;

    if (!hasStatic && !hasProviders) {
        throw new Error("配置中未找到 proxies 或 proxy-providers");
    }

    const availableRegions = detectRegions(config);
    const groups = buildGroups(availableRegions);

    const managed = new Set([
        ...Object.values(GROUP),
        ...Object.values(REGION),
        "🎏 Proxy mode",
        "💊 GFWlist",
        "🩹 Whitelist",
    ]);

    const preserved = asArray(config["proxy-groups"])
        .filter(g => g?.name && !managed.has(g.name));

    config["proxy-groups"] = [...groups, ...preserved];

    config["rule-providers"] = {
        ...(config["rule-providers"] || {}),
        ...buildProviders(),
    };

    config.rules = buildRules();
    patchDns(config);

    return config;
}


// ======================================================
// Clash Verge Rev extension interface
// ======================================================

main.customRuleInterface = {
    providers: CUSTOM_RULE_PROVIDERS,
    rules: CUSTOM_RULES,
};

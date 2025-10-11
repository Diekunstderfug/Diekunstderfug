// ======================================================
// Clash Verge Rev 2025 — Structured Optimized Script
// Author: Jensen custom + GPT-5 Engineering Refactor
// 功能：区域组自动生成 + 策略组优先化 + 稳定远程规则集 + DNS合并增强
// Core: Mihomo / Verge Rev v1.19+
// ======================================================

// ------------------------------------------------------
// 0️⃣ 全局配置（全部常量提前集中管理）
// ------------------------------------------------------
// 最高优先级自定义规则（放在最前面）
const CUSTOM_RULES = [
    // "RULE-SET,my-ip-pool,🚀 PROXY"
];
// 🌍 CDN fallback 列表
const CDN_BASES = [
    "https://fastly.jsdelivr.net/gh",     // Cloudflare CDN
    "https://gcore.jsdelivr.net/gh",      // GCore CDN (稳定)
    "https://cdn.jsdelivr.net/gh",        // 官方 jsDelivr
    "https://mirror.ghproxy.com/gh",      // GHProxy
    "https://ghproxy.net/gh"              // GHProxy备用
];

// CDN 拼接函数
function cdn(path) {
    for (const base of CDN_BASES) return `${base}/${path}`;
}

// 🧩 区域匹配正则
const REGION_PATTERNS = {
    "HK 香港": /(香港|🇭🇰|HK(?![A-Z])|HKG|Hong\s?Kong)/i,
    "TW 台湾": /(台湾|🇹🇼|TW(?![A-Z])|TWN|Taiwan)/i,
    "JP 日本": /(日本|🇯🇵|JP(?![A-Z])|JPN|Japan)/i,
    "US 美国": /(美国|🇺🇸|US(?![A-Z])|USA|United\s?States|American)/i,
    "SG 狮城": /(新加坡|狮城|🇸🇬|SG(?![A-Z])|SGP|Singapore)/i,
    "KR 韩国": /(韩国|🇰🇷|KR(?![A-Z])|KOR|Korea)/i,
    "GB 英国": /(英国|🇬🇧|GB(?![A-Z])|GBR|United\s?Kingdom|England)/i
};

// ⚙️ 通用 ruleProvider 配置模板
const RULE_PROVIDER_COMMON = {
    type: "http",
    format: "text",
    interval: 86400
};

// 🧷 自定义规则集入口（供多订阅统一维护）
const CUSTOM_RULE_PROVIDERS = {
    // "my-ip-pool": {
    //     type: "http",
    //     behavior: "ipcidr",
    //     url: "https://example.com/ip-pool.txt",
    //     interval: 86400,
    //     format: "text",
    //     path: "./ruleset/my-ip-pool.txt"
    // }
};


// 📜 定义远程规则集（按优先顺序选取CDN）
const RULE_PROVIDERS = {
    // Loyalsoldier 基础规则集
    proxy: { type: "http", behavior: "domain", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/proxy.txt"), path: "./ruleset/proxy.txt" },
    direct: { type: "http", behavior: "domain", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/direct.txt"), path: "./ruleset/direct.txt" },
    private: { type: "http", behavior: "domain", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/private.txt"), path: "./ruleset/private.txt" },
    gfw: { type: "http", behavior: "domain", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/gfw.txt"), path: "./ruleset/gfw.txt" },
    greatfire: { type: "http", behavior: "domain", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/greatfire.txt"), path: "./ruleset/greatfire.txt" },
    "tld-not-cn": { type: "http", behavior: "domain", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/tld-not-cn.txt"), path: "./ruleset/tld-not-cn.txt" },
    cncidr: { type: "http", behavior: "ipcidr", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/cncidr.txt"), path: "./ruleset/cncidr.txt" },
    telegramcidr: { type: "http", behavior: "ipcidr", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/telegramcidr.txt"), path: "./ruleset/telegramcidr.txt" },
    lancidr: { type: "http", behavior: "ipcidr", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/lancidr.txt"), path: "./ruleset/lancidr.txt" },
    applications: { type: "http", behavior: "classical", interval: 86400, url: cdn("Loyalsoldier/clash-rules@release/applications.txt"), path: "./ruleset/applications.txt" },

    // MetaCubeX 分类规则集
    Microsoft: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.yaml", path: "./ruleset/microsoft.yaml" },
    Google: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.yaml", path: "./ruleset/google.yaml" },
    Apple: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple.yaml", path: "./ruleset/apple.yaml" },
    OpenAI: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/openai.yaml", path: "./ruleset/openai.yaml" },
    Youtube: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.yaml", path: "./ruleset/youtube.yaml" },
    BiliBili: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/bilibili.yaml", path: "./ruleset/bilibili.yaml" },
    GitHub: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.yaml", path: "./ruleset/github.yaml" },
    Steam: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/steam.yaml", path: "./ruleset/steam.yaml" },

    // 学术资源规则集
    Scholar: { type: "http", behavior: "domain", format: "yaml", interval: 86400, url: "https://raw.githubusercontent.com/Diekunstderfug/Diekunstderfug/refs/heads/main/scholar.yaml", path: "./ruleset/scholar.yaml" }
};

// 🧠 默认 prependRules（优先顺序）
const DEFAULT_RULES = [
    "RULE-SET,Scholar,📚 Scholar",
    "RULE-SET,OpenAI,🤖 OpenAI",
    "RULE-SET,applications,🎯 DIRECT",
    "RULE-SET,private,🎯 DIRECT",
    "RULE-SET,GitHub,⚛️ GitHub",
    "RULE-SET,Apple,🍎 Apple",
    "RULE-SET,Microsoft,Ⓜ️ Microsoft",
    "RULE-SET,Google,✨ Google",
    "RULE-SET,Youtube,🍷 Youtube",
    "RULE-SET,BiliBili,📺 BiliBili",
    "RULE-SET,Steam,🎮 Steam",
    "RULE-SET,proxy,🚀 PROXY",
    "RULE-SET,gfw,🚀 PROXY",
    "RULE-SET,greatfire,🚀 PROXY",
    "RULE-SET,tld-not-cn,🚀 PROXY",
    "RULE-SET,direct,🎯 DIRECT",
    "RULE-SET,lancidr,🎯 DIRECT,no-resolve",
    "RULE-SET,cncidr,🎯 DIRECT,no-resolve",
    "RULE-SET,telegramcidr,📲 Telegram,no-resolve",
    "GEOIP,LAN,🎯 DIRECT,no-resolve",
    "GEOIP,CN,🎯 DIRECT,no-resolve",
    "MATCH,🛠️ Failover"
];

// 🧩 DNS增量配置模板（插入型合并）
const DNS_PATCH = {
    "default-nameserver": ["114.114.114.114", "223.5.5.5", "119.29.29.29", "1.1.1.1", "8.8.8.8"],
    "nameserver": ["https://dns.114dns.com/dns-query"],
    "fake-ip-filter": ["routerlogin.net", "+.msftconnecttest.com", "+.msftncsi.com"]
};

// ------------------------------------------------------
// 主函数逻辑
// ------------------------------------------------------
function main(config) {
    // 1️⃣ 收集代理节点
    const allProxies = new Set();
    if (Array.isArray(config.proxies))
        for (const p of config.proxies) if (p?.name) allProxies.add(p.name);
    if (Array.isArray(config["proxy-groups"]))
        for (const g of config["proxy-groups"]) if (Array.isArray(g.proxies))
            for (const n of g.proxies) if (typeof n === "string") allProxies.add(n);
    if (config["proxy-providers"])
        for (const prov of Object.values(config["proxy-providers"]))
            if (prov?.proxies) for (const p of prov.proxies) if (p?.name) allProxies.add(p.name);
    if (allProxies.size === 0) throw new Error("配置文件中未找到任何代理节点");

    // 2️⃣ 自动生成地区组
    const regionGroups = [];
    for (const [name, regex] of Object.entries(REGION_PATTERNS)) {
        const matched = [...allProxies].filter(x => regex.test(x));
        regionGroups.push({
            name,
            type: "url-test",
            url: "http://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 30,
            proxies: matched.length ? matched : ["DIRECT"]
        });
    }

    // 3️⃣ 主策略组
    const filtered = [...allProxies].filter(n => !/(官网|套餐|流量|机场|订阅)/.test(n));
    const common = ["🎯 DIRECT", "🚀 PROXY", "♻️ Auto", "⚖️ Balance", "🛠️ Failover", "HK 香港", "TW 台湾", "US 美国", "JP 日本", "SG 狮城"];
    const customGroups = [
        { name: "🎏 Proxy mode", type: "select", proxies: ["💊 GFWlist", "🩹 Whitelist"] },
        { name: "🚀 PROXY", type: "select", proxies: ["♻️ Auto", "⚖️ Balance", "🛠️ Failover", ...filtered] },
        { name: "🤖 OpenAI", type: "select", proxies: common },
        { name: "📚 Scholar", type: "select", proxies: common },
        { name: "✨ Google", type: "select", proxies: common },
        { name: "🍷 Youtube", type: "select", proxies: common },
        { name: "⚛️ GitHub", type: "select", proxies: common },
        { name: "📲 Telegram", type: "select", proxies: common },
        { name: "📺 BiliBili", type: "select", proxies: ["🎯 DIRECT", ...common.slice(1)] },
        { name: "🎮 Steam", type: "select", proxies: common },
        { name: "🍎 Apple", type: "select", proxies: common },
        { name: "Ⓜ️ Microsoft", type: "select", proxies: common },
        { name: "💊 GFWlist", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 86400, proxies: ["🎯 DIRECT"] },
        { name: "🩹 Whitelist", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 86400, proxies: ["🚀 PROXY"] },
        { name: "🎯 DIRECT", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 86400, proxies: ["DIRECT"] },
        { name: "♻️ Auto", type: "url-test", url: "http://www.gstatic.com/generate_204", interval: 300, tolerance: 30, proxies: filtered },
        { name: "⚖️ Balance", type: "load-balance", url: "http://www.gstatic.com/generate_204", interval: 300, tolerance: 30, proxies: filtered },
        { name: "🛠️ Failover", type: "fallback", url: "http://www.gstatic.com/generate_204", interval: 300, tolerance: 30, proxies: filtered }
    ];
    const oldGroups = Array.isArray(config["proxy-groups"]) ? config["proxy-groups"] : [];
    config["proxy-groups"] = [...customGroups, ...regionGroups, ...oldGroups];

    // 4️⃣ 规则集与规则
    const activeRuleProviders = { ...RULE_PROVIDERS, ...CUSTOM_RULE_PROVIDERS };
    for (const v of Object.values(activeRuleProviders)) v.version = Date.now().toString();
    config["rule-providers"] = activeRuleProviders;
    config["rules"] = [...CUSTOM_RULES, ...DEFAULT_RULES, ...(config["rules"] || [])];

    // 5️⃣ DNS增量合并
    config.dns = config.dns || {};
    for (const [key, arr] of Object.entries(DNS_PATCH)) {
        if (Array.isArray(arr)) {
            config.dns[key] = Array.from(new Set([...(config.dns[key] || []), ...arr]));
        }
    }

    return config;
}

// 🔌 暴露自定义入口，方便脚本外部接入调整
main.customRuleInterface = {
    providers: CUSTOM_RULE_PROVIDERS,
    rules: CUSTOM_RULES
};

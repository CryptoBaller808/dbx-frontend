export const dev = true; // True to enable logs inside the console

// Make requests to CryptoCompare API
export async function makeApiRequest(path) {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
    return response.json();
  } catch (error) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}

// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

export function getIBCompatibleTimeframe(timeframe) {
  const timeframes = {
    "1S": "1 secs",
    "5S": "5 secs",
    "10S": "10 secs",
    "15S": "15 secs",
    "30S": "30 secs",
    1: "1m",
    2: "2m",
    3: "3m",
    5: "5m",
    10: "10m",
    15: "15m",
    20: "20m",
    30: "30m",
    60: "1h",
    120: "2h",
    180: "3h",
    240: "4 hours",
    480: "8 hours",
    360: "6h",
    720: "12h",
    "1D": "1d",
    "3D": "3d",
    "1W": "1w",
    "1M": "1 month",
  };

  return timeframes[timeframe];
}

export const configurationData = {
  supported_resolutions: ["1", "3", "5", "15", "30", "60", "180", "360", "720", "1D", "3D", "1W"],
  exchanges: [
    {
      value: "Bitfinex",
      name: "Bitfinex",
      desc: "Bitfinex",
    },
    {
      // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
      value: "Kraken",

      // filter name
      name: "Kraken",

      // full exchange name displayed in the filter popup
      desc: "Kraken bitcoin exchange",
    },
  ],
  symbols_types: [
    {
      name: "crypto",

      // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
      value: "crypto",
    },
    // ...
  ],
};

export const currencies = {
  DBX: {
    currency: "DBX",
    issuer: "rDBXAAAPcMDfUU8S8GSfydVaUK5cXKnHRt",
  },
  XRP: {
    currency: "XRP",
    issuer: "",
  },
  SOLO: {
    currency: "SOLO",
    issuer: "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
  },
  XRdoge: {
    currency: "XRdoge",
    issuer: "rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA",
  },
  CORE: {
    currency: "CORE",
    issuer: "rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D",
  },
  USD: {
    currency: "USD",
    issuer: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
  },
  EUR: {
    currency: "EUR",
    issuer: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
  },
  CSC: {
    currency: "CSC",
    issuer: "rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr",
  },
  BTC: {
    currency: "BTC",
    issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
  },
  EQ: {
    currency: "EQ",
    issuer: "rpakCr61Q92abPXJnVboKENmpKssWyHpwu",
  },
  ETH: {
    currency: "ETH",
    issuer: "rcA8X3TVMST1n3CJeAdGk1RdRCHii7N2h",
  },
  ELS: {
    currency: "ELS",
    issuer: "rHXuEaRYnnJHbDeuBH5w8yPh5uwNVh5zAg",
  },
  CNY: {
    currency: "CNY",
    issuer: "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
  },
  LOX: {
    currency: "LOX",
    issuer: "rLLJvh6bwj2eTYwzLL484AW6EyH4rdZqWZ",
  },
  VGO: {
    currency: "VGO",
    issuer: "rPYJU7Un1ayZ9uHe3QQm8fRiGKZnGYNzhv",
  },
  ADV: {
    currency: "ADV",
    issuer: "rPneN8WPHZJaMT9pF4Ynyyq4pZZZSeTuHu",
  },
  TRSRY: {
    currency: "TRSRY",
    issuer: "rLBnhMjV6ifEHYeV4gaS6jPKerZhQddFxW",
  },
  XGBL: {
    currency: "XGBL",
    issuer: "rMy6sCaDVF1C2BT3qmNG6kgjVDZqZ74uoF",
  },
  UtiliteX: {
    currency: "UtiliteX",
    issuer: "rKDsnVfFMzdqrU8Bqno37d29L8ZW3hvrf8",
  },
  RPR: {
    currency: "RPR",
    issuer: "r3qWgpz2ry3BhcRJ8JE6rxM8esrfhuKp4R",
  },
  STX: {
    currency: "STX",
    issuer: "rSTAYKxF2K77ZLZ8GoAwTqPGaphAqMyXV",
  },
  LUC: {
    currency: "LUC",
    issuer: "rsygE5ynt2iSasscfCCeqaGBGiFKMCAUu7",
  },
  LCC: {
    currency: "LCC",
    issuer: "rG9Fo4mgx5DEZp7zKUEchs3R3jSMbx3NhR",
  },
};

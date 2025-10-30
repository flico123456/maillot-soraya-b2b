const zoneMap: { [key: string]: string } = {
    // Zone 1
    FR: "1", MC: "1", AD: "1",
    // Zone 2
    BE: "2", DE: "2", LU: "2", NL: "2", AN: "2",
    // Zone 3
    AT: "3", ES: "3", UK: "3", GG: "3", GI: "3", IE: "3", IM: "3", IT: "3", JE: "3", PT: "3", VA: "3", SM: "3",
    // Zone 4
    CH: "4", CZ: "4", DK: "4", EE: "4", FO: "4", GL: "4", HU: "4", LI: "4", LT: "4", LV: "4", PL: "4", SK: "4", SI: "4", SE: "4",
    // Zone 5
    AL: "5", AM: "5", AZ: "5", BA: "5", BG: "5", BY: "5", CY: "5", DZ: "5", FI: "5", GE: "5", MA: "5", TN: "5", HR: "5", GR: "5", IS: "5", MK: "5", MT: "5", MD: "5", ME: "5", NO: "5", RO: "5", TR: "5", UA: "5",
    // Zone 6
    AU: "6", CA: "6", CN: "6", HK: "6", IL: "6", IN: "6", JP: "6", KR: "6", RU: "6", SG: "6", TW: "6", TH: "6", VN: "6", US: "6",
    // Zone 7
    DM: "7", MX: "7",
    // Zone 8
    BL: "8", GF: "8", GP: "8", MQ: "8", PM: "8", RE: "8", YT: "8", MF: "8",
    // Zone 9
    NC: "9", PF: "9", TF: "9", WF: "9",
    // Zone 10
    AQ: "10", IO: "10", LC: "10", NE: "10", PS: "10", UM: "10"
};

export function getZoneId(countryCode: string): string | undefined {
    return zoneMap[countryCode];
}

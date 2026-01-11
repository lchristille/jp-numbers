const DIGIT = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"] as const;
const UNIT1 = ["", "十", "百", "千"] as const;
const UNIT2 = ["", "万", "億", "兆", "京"] as const;

const OTHER_STYLES: Record<string, string[]> = {
  "〇": ["零", "ぜろ", "れい"],
  "一": ["壱", "壹", "弌", "いち", "いっ"],
  "二": ["弐", "貳", "貮", "贰", "に"],
  "三": ["参", "參", "弎", "叁", "さん"],
  "四": ["肆", "䦉", "し", "よん"],
  "五": ["伍", "ご"],
  "六": ["陸", "陆", "ろく", "ろっ"],
  "七": ["漆", "質", "柒", "なな", "しち"],
  "八": ["捌", "はち", "はっ"],
  "九": ["玖", "きゅう"],
  "十": ["拾", "什", "じゅう", "じっ", "じゅっ"],
  "二十": ["廿", "〹", "念"],
  "三十": ["丗", "卅"],
  "四十": ["卌"],
  "百": ["佰", "陌", "ひゃく", "びゃく", "ぴゃく"],
  "千": ["仟", "阡", "せん", "ぜん"],
  "万": ["萬", "まん"],
  "億": ["おく"],
  "兆": ["ちょう"],
  "京": ["けい"],
  "マイナス": ["-", "負の", "負", "まいなす"],
  "": ["とんで"],
};

/**
 * Convert Japanese notation string to number.
 * @param str Japanese notation string
 * @returns numeric value
 */
export function jp2number(str: string): number {
  if (typeof str !== "string") throw new TypeError();

  let normalizedStr = str;
  for (const to in OTHER_STYLES) {
    const froms = OTHER_STYLES[to];
    if (froms) {
      for (const from of froms) {
        normalizedStr = normalizedStr.split(from).join(to);
      }
    }
  }

  if (normalizedStr === "〇") return 0;
  if (normalizedStr.startsWith("マイナス")) return -jp2number(normalizedStr.slice(4));

  let groupLevel = UNIT2.length - 1;
  let groupBase = 1e16;
  let answer = 0;
  let remainingStr = normalizedStr;
  while (remainingStr.length > 0) {
    if (groupLevel < 0) throw new Error();
    const unit2 = UNIT2[groupLevel];
    if (unit2 !== undefined && remainingStr.includes(unit2)) {
      let index = remainingStr.indexOf(unit2);
      let groupStr = groupLevel === 0 ? remainingStr : remainingStr.substring(0, index);
      remainingStr = groupLevel === 0 ? "" : remainingStr.slice(index + 1);

      let chars = ["〇", "〇", "〇", "〇"];
      for (let i = 0; i < 3; i++) {
        const unit1 = UNIT1[3 - i];
        if (unit1 !== undefined && groupStr.includes(unit1)) {
          let splitted = groupStr.split(unit1, 2);
          if (splitted[0]!.length > 1) throw new Error();
          chars[i] = splitted[0] === "" ? "一" : (splitted[0] || "〇");
          groupStr = splitted[1] || "";
        }
      }
      if (groupStr.length > 1) throw new Error();
      chars[3] = groupStr === "" ? "〇" : groupStr;

      chars.forEach((c) => {
        if (!(DIGIT as readonly string[]).includes(c)) throw new Error();
      });

      answer +=
        ((DIGIT as readonly string[]).indexOf(chars[0]!) * 1000 +
          (DIGIT as readonly string[]).indexOf(chars[1]!) * 100 +
          (DIGIT as readonly string[]).indexOf(chars[2]!) * 10 +
          (DIGIT as readonly string[]).indexOf(chars[3]!)) *
        groupBase;
    }
    groupLevel--;
    groupBase /= 10000;
  }

  return answer;
}

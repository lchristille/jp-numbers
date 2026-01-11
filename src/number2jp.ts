const DIGIT = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"] as const;
const UNIT1 = ["", "十", "百", "千"] as const;
const UNIT2 = ["", "万", "億", "兆", "京"] as const;

/**
 * Convert number to Japanese notation.
 * @param n number to convert
 * @returns Japanese notation string
 */
export function number2jp(n: number): string {
  if (
    typeof n !== "number" ||
    isNaN(n) ||
    -n < -Number.MAX_SAFE_INTEGER ||
    Number.MAX_SAFE_INTEGER < n
  )
    throw new TypeError();

  if (n === 0) return "〇";
  if (n < 0) return "マイナス" + number2jp(-n);

  let groupLevel = 0;
  let answer = "";
  let currentN = n;
  while (currentN > 0) {
    let groupNumber = currentN % 10000;
    currentN = Math.floor(currentN / 10000);
    let n0 = groupNumber % 10;
    let n1 = Math.floor(((groupNumber % 100) - (groupNumber % 10)) / 10);
    let n2 = Math.floor(((groupNumber % 1000) - (groupNumber % 100)) / 100);
    let n3 = Math.floor((groupNumber - (groupNumber % 1000)) / 1000);

    const digitN3 = DIGIT[n3];
    const digitN2 = DIGIT[n2];
    const digitN1 = DIGIT[n1];
    const digitN0 = DIGIT[n0];

    if (digitN3 === undefined || digitN2 === undefined || digitN1 === undefined || digitN0 === undefined) {
      throw new Error("Invalid digit");
    }

    answer =
      (n3 <= 1 ? "" : digitN3) +
      (n3 === 0 ? "" : UNIT1[3]) +
      (n2 <= 1 ? "" : digitN2) +
      (n2 === 0 ? "" : UNIT1[2]) +
      (n1 <= 1 ? "" : digitN1) +
      (n1 === 0 ? "" : UNIT1[1]) +
      (n0 === 0 ? "" : digitN0) +
      (groupNumber === 0 ? "" : (UNIT2[groupLevel] ?? "")) +
      answer;

    groupLevel++;
  }

  return answer;
}

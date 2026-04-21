// Ported verbatim from upstream `/tmp/upstream-sbtj/src/utils/numbers.ts`.
// rich_text ordered lists use Roman numerals at indent 2/5/8 and alpha
// letters at indent 1/4/7 — both helpers generate Slack-compatible strings.

export function numberToRoman(num: number): string {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) {
    throw new Error("Input must be a positive integer between 1 and 3999");
  }
  const romanNumerals: [number, string][] = [
    [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"],
    [90, "xc"], [50, "l"], [40, "xl"], [10, "x"], [9, "ix"],
    [5, "v"], [4, "iv"], [1, "i"],
  ];
  let result = "";
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

export function numberToAlpha(num: number): string {
  if (num < 1 || !Number.isInteger(num)) {
    throw new Error("Input must be a positive integer");
  }
  let result = "";
  while (num > 0) {
    num--;
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
}

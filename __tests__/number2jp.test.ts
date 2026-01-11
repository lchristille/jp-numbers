import { number2jp, jp2number } from "../src/index";

test("number to japanese", () => {
  expect(number2jp(0)).toBe("〇");
  expect(number2jp(1)).toBe("一");
  expect(number2jp(-1)).toBe("マイナス一");
  expect(number2jp(100001101)).toBe("一億千百一");
  expect(number2jp(1234567890)).toBe("十二億三千四百五十六万七千八百九十");
});

test("japanese to number", () => {
  expect(jp2number("〇")).toBe(0);
  expect(jp2number("一")).toBe(1);
  expect(jp2number("マイナス一")).toBe(-1);
  expect(jp2number("一億千百一")).toBe(100001101);
  expect(jp2number("十二億三千四百五十六万七千八百九十")).toBe(1234567890);
});

test("jp2number other styles", () => {
  expect(jp2number("零")).toBe(0);
  expect(jp2number("壱")).toBe(1);
  expect(jp2number("負の廿")).toBe(-20);
  expect(jp2number("一萬阡陌拾")).toBe(11110);
  expect(jp2number("じゅうにおくさんぜんよんひゃくまん")).toBe(1234000000);
  expect(jp2number("ごじゅうろくまんななせんはっぴゃく")).toBe(567800);
  expect(jp2number("にせんとんでにじゅう")).toBe(2020);
});

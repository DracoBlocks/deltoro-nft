import { Suite } from "mocha";

const slowDescribe = function (
  title: string,
  fn: (this: Suite) => void
): Suite {
  if (process.env.MOCHA_SLOW_TEST) {
    return describe(title, fn);
  }
  return new Suite(title);
};

slowDescribe.skip = describe.skip;
slowDescribe.only = describe.only;

export { slowDescribe };

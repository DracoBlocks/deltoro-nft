function address(num: number): string;
function address(num: bigint): string;

function address(num: any): string {
  let result = "0x" + num.toString(16);
  return result.replace("0x", "0x" + getZeroes(42 - result.length));
}

function getZeroes(amount: number) {
  let result = "";
  while (amount-- > 0) {
    result += "0";
  }
  return result;
}

export { address };

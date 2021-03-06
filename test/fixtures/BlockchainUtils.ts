import { network } from "hardhat";
import { PalmaNFT } from "../../typechain";

const advanceToFuture = async (seconds?: number) => {
  await network.provider.send("evm_increaseTime", [seconds ?? 3600]);
  await network.provider.send("evm_mine");
};

const advanceToSaleFinishTime = async (contract: PalmaNFT) => {
  const time = (await contract.saleFinishTime()).sub(
    Math.floor(new Date().getTime() / 1000)
  );

  advanceToFuture(time.toNumber());
};

export { advanceToFuture, advanceToSaleFinishTime };

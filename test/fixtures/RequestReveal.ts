import { EstrellaNFT, RequestIDProducer__factory } from "../../typechain";
import { ChainlinkContractFactory } from "./chainlink/ChainlinkContracts";
import { getAddresses } from "./TokenInitialisation";

const getRequestId = async (contract: EstrellaNFT, requestNumber?: number) => {
  const [owner] = await getAddresses();
  const requestIdProducer = await new RequestIDProducer__factory(
    owner
  ).deploy();
  return await requestIdProducer.getRequestId(
    await contract.keyHash(),
    contract.address,
    requestNumber ?? 0
  );
};

const processReveal = async (contract: EstrellaNFT, requestNumber?: number) => {
  const requestId = await getRequestId(contract, requestNumber);

  await (
    await ChainlinkContractFactory.get()
  ).vrfCoordinator.callBackWithRandomness(
    requestId,
    Math.floor(Math.random() * 1000),
    contract.address
  );
};

export { processReveal };

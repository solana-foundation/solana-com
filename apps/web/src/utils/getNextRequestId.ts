let nextRequestId = 0n;

export default function getNextRequestId(): bigint {
  return ++nextRequestId;
}

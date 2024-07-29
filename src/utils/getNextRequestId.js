let nextRequestId = 0n;

export default function getNextRequestId() {
  return ++nextRequestId;
}

export const getDeadline = (deadlineAfterSeconds: number) => {
  return BigInt(Math.floor(Date.now() / 1000) + deadlineAfterSeconds);
};

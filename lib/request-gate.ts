export function claimRequest(active: Set<string>, key: string) {
  if (active.has(key)) return false;
  active.add(key);
  return true;
}

export function releaseRequest(active: Set<string>, key: string) {
  active.delete(key);
}

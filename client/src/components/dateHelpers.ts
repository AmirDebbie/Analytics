export function getStartOfDay(dateNow: number): number {
  const startOfDay = new Date(dateNow).setHours(0, 0, 0);
  return startOfDay;
}
export const today = new Date().valueOf();

export function convertDateToString(date: number) {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const generatedDate = `${yyyy}-${mm}-${dd}`;
  return `${generatedDate}`;
}

export function getOffset(date: string): number {
  const offsetInDate = new Date(date).valueOf();
  const now = getStartOfDay(new Date().valueOf());
  return (now - offsetInDate) / (1000 * 60 * 60 * 24);
}

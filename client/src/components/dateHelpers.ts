// Gets a date in milliseconds and return the beginning of the same date in milliseconds.
export function getStartOfDay(date: number): number {
  return new Date(new Date(date).toDateString()).valueOf();
}

// Returns current date in milliseconds
export const today = new Date().valueOf();

// Gets a date in milliseconds and returns it in yyyy-mm-dd format
export function convertDateToString(date: number) {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const generatedDate = `${yyyy}-${mm}-${dd}`;
  return `${generatedDate}`;
}

// Gets a date (string) and returns the offset in days from the current date
export function getOffset(date: string): number {
  const offsetInDate = new Date(date).valueOf();
  const now = getStartOfDay(new Date().valueOf());
  return (now - offsetInDate) / (1000 * 60 * 60 * 24) + 1;
}

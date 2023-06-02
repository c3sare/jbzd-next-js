import { compareAsc, parseISO } from "date-fns";

export function isPremiumUser(premiumExpires: string) {
  const premiumDate = new Date(parseISO(premiumExpires));
  const currentDate = new Date();

  return compareAsc(premiumDate, currentDate) > 0;
}

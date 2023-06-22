import formatISO from "date-fns/formatISO";

type DateFilterTypes = {
  from?: string;
  to?: string;
  datePreset?: "6h" | "12h" | "24h" | "48h" | "7d";
};

export default function dateFilter({ from, to, datePreset }: DateFilterTypes) {
  if (datePreset) {
    const presets = {
      "6h": 6,
      "12h": 12,
      "24h": 24,
      "48h": 48,
      "7d": 168,
    };

    if (Object.keys(presets).includes(datePreset)) {
      const date = new Date();
      date.setHours(date.getHours() - presets[datePreset]);
      return {
        addTime: {
          $gt: formatISO(date),
        },
      };
    }
  } else if (from && to) {
    const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
    if (dateRegex.test(from) && dateRegex.test(to)) {
      return {
        addTime: {
          $gt: formatISO(new Date(from)),
          $lt: formatISO(new Date(to)),
        },
      };
    }
  }
  return {};
}

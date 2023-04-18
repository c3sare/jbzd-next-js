export default function alongAgo(time: string) {
    const currentTime = new Date().getTime();
    const addTime = new Date(time).getTime();

    const inSeconds = (currentTime - addTime) / 1000;

    if (inSeconds < 60) {
      const secs = Math.floor(inSeconds);
      return `${secs} sek.`;
    } else if (inSeconds >= 60 && inSeconds < 60 * 60) {
      const minutes = Math.floor(inSeconds / 60);
      return `${minutes} min.`;
    } else if (inSeconds >= 60 * 60 && inSeconds < 60 * 60 * 24) {
      const hours = Math.floor(inSeconds / 60 / 60);
      return `${hours} godz.`;
    } else if (inSeconds >= 60 * 60 * 24 && inSeconds < 60 * 60 * 24 * 7) {
      const days = Math.floor(inSeconds / 60 / 60 / 24);
      return `${days} ${days > 1 ? "dni" : "dzień"}`;
    } else if (inSeconds >= 60 * 60 * 24 * 7 && inSeconds < 60 * 60 * 24 * 30) {
      const weeks = Math.floor(inSeconds / 60 / 60 / 24 / 7);
      return `${weeks} tyg.`;
    } else if (
      inSeconds >= 60 * 60 * 24 * 30 &&
      inSeconds < 60 * 60 * 24 * 365
    ) {
      const months = Math.floor(inSeconds / 60 / 60 / 24 / 30);
      return `${months} mies.`;
    } else if (inSeconds >= 60 * 60 * 24 * 365) {
      const years = Math.floor(inSeconds / 60 / 60 / 24 / 365);
      return `${years} ${
        years > 1 ? (years < 5 ? "lata" : "lat") : "rok"
      }`;
    }
  };
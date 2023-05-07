import { uniqueId } from "./uniqueId";

export default function createNotifycation(
  setNotify: any,
  type: string,
  message: string
) {
  const id = uniqueId();
  let timeout: any;
  const newNotify = {
    id: id,
    text: message,
    type: type,
    closeFn: () => {
      setNotify((state: any[]) => state.filter((item) => item.id !== id));
      clearTimeout(timeout);
    },
  };
  setNotify((state: any[]) => [...state, newNotify]);

  timeout = setTimeout(() => {
    setNotify((state: any[]) => state.filter((item) => item.id !== id));
  }, 5000);
}

import { uniqueId } from "./uniqueId";

export default function createNotifycation(
  dispatch: any,
  type: string,
  message: string
) {
  const id = uniqueId();
  let timeout: any;
  dispatch({
    type: "ADD",
    notify: {
      id: id,
      text: message,
      type: type,
      closeFn: () => {
        dispatch({
          type: "DELETE",
          id,
        });
        clearTimeout(timeout);
      },
    },
  });
  timeout = setTimeout(() => {
    dispatch({
      type: "DELETE",
      id,
    });
  }, 5000);
}

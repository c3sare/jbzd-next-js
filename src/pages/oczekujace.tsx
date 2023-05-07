import { useForm } from "react-hook-form";

interface SendImageForm {
  image: File[];
}

const Waitings = () => {
  const { register, handleSubmit } = useForm<SendImageForm>();

  const sendFile = (data: SendImageForm) => {
    const file = data.image[0];

    const fd = new FormData();
    fd.append("image", file);

    fetch("/api/upload", {
      method: "POST",
      body: fd,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <>
      <h1>21</h1>
      <form onSubmit={handleSubmit(sendFile)}>
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Nie podano żadnego pliku!" })}
        />
        <button type="submit">Wyślij</button>
      </form>
    </>
  );
};

export default Waitings;

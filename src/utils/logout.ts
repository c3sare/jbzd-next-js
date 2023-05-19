import Router from "next/router";

export default async function logout() {
  const req = await fetch("/api/logout");
  const res = await req.json();

  if (req.status === 200) {
    if (res.logout) Router.router?.reload();
  } else {
    console.error(res.message);
  }
}

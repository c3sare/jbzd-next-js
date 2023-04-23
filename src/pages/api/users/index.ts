import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import currentDate from "@/utils/currentDate";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  repassword: string;
  rules: boolean;
}

function checkFormData({
  username,
  email,
  password,
  repassword,
  rules,
}: RegisterForm) {
  const userNameRegex = /[a-z]?(.|\-)+(\w+|\b)/;
  const emailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!username || !email || !password || !repassword || rules === false) {
    return false;
  }

  if (
    !userNameRegex.test(username) ||
    !emailRegex.test(email) ||
    !passwordRegex.test(password) ||
    !passwordRegex.test(repassword) ||
    password !== repassword
  )
    return false;

  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  if (req.method === "GET") {
    const data = await User.find({});
    const users = data.map((item) => ({
      _id: item._id,
      username: item.username,
      avatar: item.avatar,
    }));

    return res.status(200).json(users);
  } else if (req.method === "PUT") {
    const { username, email, password }: RegisterForm = req.body;

    if (!checkFormData(req.body))
      return res.status(400).json({ message: "Data from request is invalid." });

    const searchByUsername = await User.findOne({ username });
    if (searchByUsername) {
      return res
        .status(409)
        .json({ field: "username", message: "Taki użytkownik już istnieje!" });
    }

    const searchByEmail = await User.findOne({ email });
    if (searchByEmail) {
      return res
        .status(409)
        .json({ field: "email", message: "Taki email jest już używany!" });
    }

    const addUser = await User.collection.insertOne({
      username,
      email,
      createDate: currentDate(),
      avatar: "default.jpg",
      password,
      birthday: "",
      city: "",
      country: "",
      gender: 0,
      name: "",
      notify: {
        newOrders: true,
        pins: true,
        commentsOnMain: true,
        newComments: true,
      },
      coins: 0,
      token: "123456789",
    });

    if (!addUser)
      return res.status(500).json({
        message: "Wystąpił nieoczekiwany błąd przy dodawaniu użytkownika!",
      });

    return res.status(200).json({ message: "Zapytanie wykonane prawidłowo!" });
  }
}

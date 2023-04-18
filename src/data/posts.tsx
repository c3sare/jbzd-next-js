export interface Post {
  id: number;
  userId: number;
  userName: string;
  category: string;
  title: string;
  addDate: string;
  img: string;
  likes: number;
  mid_finger_like: number;
  rock_like: number;
  silver_like: number;
  gold_like: number;
  comments: Array<{
    id: number;
    userId: number;
    userName: string;
    likes: number;
    text: string;
    subcomments: Array<{
      id: number;
      userId: number;
      userName: string;
      likes: number;
      text: string;
    }>;
  }>;
}

const posts: Post[] = [
  {
    id: 1,
    userId: 1,
    userName: "Anonimowy",
    category: "Humor",
    title: "tytuł",
    addDate:
      "Fri Jun 24 2022 15:12:00 GMT+0200 (czas środkowoeuropejski letni)",
    img: "/images/upload/1.jpg",
    likes: 0,
    mid_finger_like: 0,
    rock_like: 0,
    silver_like: 0,
    gold_like: 0,
    comments: [
      {
        id: 1,
        userId: 1,
        userName: "Anonim",
        likes: 0,
        text: "no chyba ty",
        subcomments: [
          {
            id: 1,
            userId: 2,
            userName: "Anonim",
            likes: 0,
            text: "nie chyba ty",
          },
        ],
      },
    ],
  },
];

export default posts;

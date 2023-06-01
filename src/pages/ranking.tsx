import Breadcrumb from "@/components/Breadcrumb";
import Seo from "@/components/Seo";
import dbConnect from "@/lib/dbConnect";
import { Usersposts } from "@/models/User";
import style from "@/styles/ranking.module.css";
import Image from "next/image";
import Link from "next/link";
import { TfiCup } from "react-icons/tfi";

const MikroBlog = ({ data }: any) => {
  return (
    <>
      <Seo title="Ranking użytkowników" />
      <Breadcrumb
        currentNode="Ranking użytkowników"
        styles={{ marginLeft: "8px" }}
      >
        <Link href="/">Strona Główna</Link>
      </Breadcrumb>
      <div>
        <div className={style.ranking}>
          <ul>
            {data.map((user: any) => (
              <li key={user._id}>
                <Link href={`/uzytkownik/${user.username}`}>
                  <div className={style.rank}>
                    <span>
                      <TfiCup />
                    </span>
                    <span> {user.rank}. </span>
                  </div>
                  <div className={style.avatar}>
                    <Image
                      width={40}
                      height={40}
                      src={user.avatar || "/images/avatars/default.jpg"}
                      alt="avatar"
                    />
                  </div>
                  <div className={style.username}>{user.username}</div>
                  <div className={style.spearCounter}>
                    <span>
                      <Image
                        src="/images/spear.png"
                        width={22}
                        height={22}
                        alt="Dzida"
                      />
                    </span>
                    <span>{user.spears}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  await dbConnect();
  const data = JSON.parse(
    JSON.stringify(await Usersposts.find({}).sort({ rank: 1 }))
  );

  return {
    props: {
      data,
    },
  };
}

export default MikroBlog;

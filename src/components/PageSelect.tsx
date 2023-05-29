import style from "@/styles/paginator.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GiDiceSixFacesTwo } from "react-icons/gi";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useRouter } from "next/router";

const PageSelect = ({
  pageName = "str",
  currentPage,
  allPages,
}: {
  pageName?: string;
  currentPage: number;
  allPages: number;
}) => {
  const router = useRouter();
  const [drag, setDrag] = useState<boolean>(false);
  const startClientX = useRef<number>(0);
  const scrollThumb = useRef<HTMLDivElement>(null);
  const scrollBar = useRef<HTMLDivElement>(null);
  const [scrollBarProgress, setScrollBarProgress] = useState<number>(0);

  function setScrollBar(e: any) {
    const scrollBarWidth = scrollBar.current!.offsetWidth;
    const thumbWidth =
      allPages > 7 ? (scrollBarWidth / allPages) * 7 : scrollBarWidth;
    const scrollBarLeft = scrollBar.current!.offsetLeft;

    const max = scrollBarWidth - thumbWidth;
    const result = e.clientX - scrollBarLeft - thumbWidth / 2;

    const current = result > max ? max : result < 0 ? 0 : result;
    const percent = current / (max + thumbWidth);
    setScrollBarProgress(percent);

    scrollThumb.current!.style.left = current + "px";
  }

  useEffect(() => {
    function scrollBarSet(e: any) {
      if (drag) setScrollBar(e);
    }

    window.addEventListener("mousemove", scrollBarSet, true);

    return () => window.removeEventListener("mousemove", scrollBarSet, true);
  }, [drag]);

  useEffect(() => {
    function disableDrag() {
      setDrag(false);
    }

    if (drag) {
      window.addEventListener("mouseup", disableDrag, true);
    } else {
      window.removeEventListener("mouseup", disableDrag, true);
    }

    return () => window.removeEventListener("mouseup", disableDrag, true);
  }, [drag]);

  const setScrollBarPage = (page: number) => {
    page -= 1;
    const scrollBarWidth = scrollBar.current!.offsetWidth;
    const thumbWidth =
      allPages > 7 ? (scrollBarWidth / allPages) * 7 : scrollBarWidth;
    const allProgress = scrollBarWidth - thumbWidth;
    const currentProgress = (page / allPages) * allProgress;
    scrollThumb.current!.style.width = `${thumbWidth}px`;
    scrollThumb.current!.style.left = currentProgress + "px";
    setScrollBarProgress(allProgress / currentProgress);
  };

  const getQueryString = () => {
    const datePreset = router.query?.["date-preset"];
    const from = router.query?.["from"];
    const to = router.query?.["to"];
    const pharse = router.query?.["pharse"];
    const video = router.query?.["video"];
    const gif = router.query?.["gif"];
    const image = router.query?.["image"];
    const text = router.query?.["text"];

    return {
      ...(datePreset ? { "date-preset": datePreset } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      ...(pharse ? { pharse } : {}),
      ...(video ? { video } : {}),
      ...(gif ? { gif } : {}),
      ...(image ? { image } : {}),
      ...(text ? { text } : {}),
    };
  };

  const query = getQueryString();

  useEffect(() => {
    setScrollBarPage(currentPage);
  }, []);

  return (
    <>
      <div className={style.paginationModern}>
        <Link
          href={{
            pathname: `/${pageName}/${currentPage - 1}`,
            query,
          }}
          className={
            style.paginationModernPrev +
            (currentPage === 1 ? " " + style.disabled : "")
          }
        >
          <AiOutlineArrowLeft />
        </Link>
        <Link href="/losowe" className={style.paginationModernRandom}>
          <GiDiceSixFacesTwo />
        </Link>
        <Link
          href={{ pathname: `/${pageName}/${currentPage + 1}`, query }}
          className={
            style.paginationModernNext +
            (currentPage + 1 > allPages ? " " + style.disabled : "")
          }
        >
          <AiOutlineArrowRight />
        </Link>
      </div>
      {currentPage < allPages && (
        <div className={style.paginationButtons}>
          <Link
            href={{
              pathname: `/${pageName}/${currentPage + 1}`,
              query,
            }}
            className={style.paginationNext}
          >
            następna strona
          </Link>
          <Link href="/losowe" className={style.paginationRandom}>
            <GiDiceSixFacesTwo />
          </Link>
        </div>
      )}
      <div className={style.pagination}>
        <div className={style.paginator}>
          <table>
            <tbody>
              <tr>
                {[...Array(allPages > 7 ? 7 : allPages)].map(
                  (_i, index: number) => {
                    const ceil = Math.ceil(allPages * scrollBarProgress);

                    const page =
                      allPages > 7
                        ? 1 +
                          index +
                          (ceil > allPages - 7 ? allPages - 7 : ceil)
                        : index + 1;

                    return (
                      <td className={style.paginationButton} key={index}>
                        {currentPage === page ? (
                          <span>
                            <strong>{page}</strong>
                          </span>
                        ) : (
                          <Link
                            href={{
                              pathname:
                                page === 0
                                  ? `/${pageName === "str" ? "" : pageName}`
                                  : `/${pageName}/${page}`,
                              query,
                            }}
                          >
                            {page}
                          </Link>
                        )}
                      </td>
                    );
                  }
                )}
              </tr>
              <tr>
                <td colSpan={7}>
                  <div
                    className={style.scrollBar}
                    ref={scrollBar}
                    onClick={setScrollBar}
                  >
                    <div className={style.scrollTrough} />
                    <div
                      className={style.scrollThumb}
                      style={{ left: "0px" }}
                      ref={scrollThumb}
                      onMouseDown={(e) => {
                        startClientX.current = e.clientX;
                        setDrag(true);
                      }}
                    >
                      <div className={style.scrollKnob} />
                    </div>
                    <div className={style.currentPageMark} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PageSelect;

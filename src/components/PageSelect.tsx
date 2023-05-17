import style from "@/styles/paginator.module.css";

const PageSelect = ({
  currentPage,
  allPages,
}: {
  currentPage: number;
  allPages: number;
}) => {
  return (
    <div className={style.paginator}>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td className={style.paginationButton} width="14.285714285714286%">
              <span>
                <strong>1</strong>
              </span>
            </td>
            <td className={style.paginationButton} width="14.285714285714286%">
              <a href="https://jbzd.com.pl/str/2">2</a>
            </td>
            <td className={style.paginationButton} width="14.285714285714286%">
              <a href="https://jbzd.com.pl/str/3">3</a>
            </td>
            <td className={style.paginationButton} width="14.285714285714286%">
              <a href="https://jbzd.com.pl/str/4">4</a>
            </td>
            <td className={style.paginationButton} width="14.285714285714286%">
              <a href="https://jbzd.com.pl/str/5">5</a>
            </td>
            <td className={style.paginationButton} width="14.285714285714286%">
              <a href="https://jbzd.com.pl/str/6">6</a>
            </td>
            <td className={style.paginationButton} width="14.285714285714286%">
              <a href="https://jbzd.com.pl/str/7">7</a>
            </td>
          </tr>
          <tr>
            <td colSpan={7}>
              <div className="scroll_bar">
                <div className="scroll_trough"></div>
                <div
                  className="scroll_thumb"
                  style={{ width: "8px", left: "0px" }}
                >
                  <div className="scroll_knob"></div>
                </div>
                <div
                  className="current_page_mark"
                  style={{ width: "3px", left: "697.477px" }}
                ></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PageSelect;

import style from "@/styles/userprofile.module.css";

const Breadcrumb = ({ children, currentNode, styles }: any) => {
  console.log(children);
  console.log(currentNode);

  const solo = children instanceof Array;
  return (
    <div className={style.breadcrumbs} style={styles ? styles : {}}>
      {children &&
        (solo ? (
          children
            ?.filter((item: any) => item !== null)
            .map((el: any, i: number) => <span key={i}>{el}</span>)
        ) : (
          <span>{children}</span>
        ))}
      <span>{currentNode}</span>
    </div>
  );
};

export default Breadcrumb;

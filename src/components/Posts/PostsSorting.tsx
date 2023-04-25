import { Dispatch, SetStateAction } from "react";
import styles from "../../styles/posts/PostsSorting.module.css";
import { TbJewishStar, TbFlame } from "react-icons/tb";

interface Props {
  setOrder: Dispatch<SetStateAction<"timestamp" | "upvotes">>;
  order: "timestamp" | "upvotes";
}

const PostSorting = ({ setOrder, order }: Props) => {
  const setStyle = (sort: "new" | "hot") => {
    if (sort === "new" && order === "timestamp") {
      return `${styles.sortBtn} ${styles.activeSort}`;
    }

    if (sort === "hot" && order === "upvotes") {
      return `${styles.sortBtn} ${styles.activeSort}`;
    }

    return styles.sortBtn;
  };

  return (
    <div className={styles.root}>
      <button className={setStyle("new")} onClick={() => setOrder("timestamp")}>
        <TbJewishStar viewBox="1.5 0.7 22 22" />
        New
      </button>

      <button className={setStyle("hot")} onClick={() => setOrder("upvotes")}>
        <TbFlame viewBox="2 3 19 19" style={{ strokeWidth: 1.6 }} />
        Hot
      </button>
    </div>
  );
};

export default PostSorting;

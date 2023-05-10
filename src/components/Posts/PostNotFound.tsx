import notFound from "../../assets/img/not_found.png";
import styles from "../../styles/shared/NotFound.module.css";
import stylesBtn from "../../styles/elements/buttons.module.css";
import { Link } from "react-router-dom";

const PostNotFound = () => (
  <div className={styles.root}>
    <div className={styles.notFoundContent}>
      <img src={notFound} alt="User not found" />
      <h3>Sorry, the post you are looking for could not be found.</h3>
      <p>The post may have been removed or the identifier is incorrect.</p>
      <Link
        to="/"
        className={stylesBtn.btnVariantOne}
        style={{
          fontWeight: "700",
          textTransform: "uppercase",
          width: "100%",
        }}
      >
        Go home
      </Link>
    </div>
  </div>
);

export default PostNotFound;

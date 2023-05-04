import notFound from "../../assets/img/not_found.png";
import styles from "../../styles/shared/NotFound.module.css";
import stylesBtn from "../../styles/elements/buttons.module.css";
import { Link } from "react-router-dom";

const CommunityNotFound = () => (
  <div className={styles.root}>
    <div className={styles.notFoundContent}>
      <img src={notFound} alt="User not found" />
      <h3>Sorry, there aren’t any communities on Re_edit with that name.</h3>
      <p>
        This community may have been banned or the community name is incorrect.
      </p>
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

export default CommunityNotFound;

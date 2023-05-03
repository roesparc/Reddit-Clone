import notFound from "../../assets/img/not_found.png";
import styles from "../../styles/userProfile/UserNotFound.module.css";
import stylesBtn from "../../styles/elements/buttons.module.css";
import { Link } from "react-router-dom";

const UserNotFound = () => (
  <div className={styles.root}>
    <div className={styles.notFoundContent}>
      <img src={notFound} alt="User not found" />
      <h3>Sorry, nobody on Re_edit goes by that name.</h3>
      <p>The person may have been banned or the username is incorrect.</p>
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

export default UserNotFound;

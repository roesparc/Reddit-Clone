import styles from "../../styles/shared/AccessDenied.module.css";
import { IoBan } from "react-icons/io5";

const AccessDenied = () => (
  <div className={styles.root}>
    <IoBan />
    <h3>You do not have permission to access this resource</h3>
  </div>
);

export default AccessDenied;

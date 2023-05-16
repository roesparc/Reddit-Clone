import styles from "../../styles/shared/AccessDenied.module.css";
import { IoBan } from "react-icons/io5";

interface Props {
  fullPage?: boolean;
}

const AccessDenied = ({ fullPage }: Props) => (
  <div
    className={styles.root}
    style={
      fullPage
        ? { height: "calc(100vh - 49px)", backgroundColor: "unset" }
        : undefined
    }
  >
    <IoBan />
    <h3>You do not have permission to access this resource</h3>
  </div>
);

export default AccessDenied;

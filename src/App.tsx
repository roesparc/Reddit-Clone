import { HashRouter } from "react-router-dom";
import styles from "./styles/App.module.css";

function App() {
  return (
    <div className={styles.root}>
      <HashRouter></HashRouter>
    </div>
  );
}

export default App;

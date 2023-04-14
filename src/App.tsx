import { HashRouter } from "react-router-dom";
import styles from "./styles/App.module.css";
import Header from "./components/Header";

function App() {
  return (
    <div className={styles.light}>
      <HashRouter>
        <Header />
      </HashRouter>
    </div>
  );
}

export default App;

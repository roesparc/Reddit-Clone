import { FaGithub } from "react-icons/fa";
import locationInfoStyles from "../../styles/shared/LocationInfo.module.css";
import styles from "../../styles/homePage/HomeInfoCard.module.css";

const HomeInfoCard = () => (
  <div className={`${locationInfoStyles.root} ${styles.root}`}>
    <p>
      This{" "}
      <a href="https://www.theodinproject.com/lessons/node-path-javascript-javascript-final-project">
        project
      </a>{" "}
      was created as part of The Odin Project's curriculum, specifically as the
      final project in their JavaScript course. Throughout this course, I gained
      extensive knowledge and skills, and I successfully completed all its
      projects. If you're interested, you can check out my{" "}
      <a href="https://github.com/roesparc/">GitHub page</a> to see the projects
      I've worked on.
    </p>

    <p>
      I would like to express my gratitude to the curriculum authors and the
      open source community for their invaluable contributions. The Odin Project
      has been fundamental in enhancing my understanding of JavaScript and web
      development, and I highly recommend it to anyone interested in learning
      these subjects.
    </p>

    <div className={styles.authorContainer}>
      <p>
        By <a href="https://github.com/roesparc/">roesparc</a>
      </p>
      <a href="https://github.com/roesparc/">
        <FaGithub />
      </a>
    </div>
  </div>
);

export default HomeInfoCard;

import { useCallback } from "react";
import GradeCard from "../components/GradeCard";
import styles from "./Frame.module.css";

const Frame = () => {
  const onImage5Click = useCallback(() => {
    // Please sync "Personal Information" to the project
  }, []);

  const onImage6Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  return (
    <div className={styles.parent}>
      <main className={styles.main}>
        <header className={styles.child} />
        <h1 className={styles.home}>Home</h1>
        <a className={styles.image5} onClick={onImage5Click} />
        <a className={styles.image6} onClick={onImage6Click} />
        <a className={styles.image7} />
        <img className={styles.image22Icon} alt="" src="/image-22@2x.png" />
        <GradeCard />
        <img className={styles.image23Icon} alt="" src="/image7@2x.png" />
        <a className={styles.teachersName}>Teachers Name</a>
      </main>
    </div>
  );
};

export default Frame;

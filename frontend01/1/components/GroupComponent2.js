import { useMemo } from "react";
import styles from "./GroupComponent2.module.css";

const GroupComponent2 = ({
  groupDivHeight,
  groupDivBottom,
  onGroupContainer2Click,
  onGroupContainer3Click,
}) => {
  const rectangleIcon2Style = useMemo(() => {
    return {
      height: groupDivHeight,
      bottom: groupDivBottom,
    };
  }, [groupDivHeight, groupDivBottom]);

  return (
    <div className={styles.vectorParent}>
      <img
        className={styles.instanceChild}
        alt=""
        src="/rectangle-105.svg"
        style={rectangleIcon2Style}
      />
      <div className={styles.teacherParent}>
        <div className={styles.teacher}>Teacher</div>
        <img className={styles.image38Icon} alt="" src="/image-38@2x.png" />
      </div>
      <div className={styles.classesParent}>
        <div className={styles.classes}>Classes</div>
        <button className={styles.image39} />
      </div>
      <div className={styles.studentParent} onClick={onGroupContainer2Click}>
        <div className={styles.student}>Student</div>
        <button className={styles.image40} />
      </div>
      <div className={styles.messagesParent} onClick={onGroupContainer3Click}>
        <div className={styles.classes}>Messages</div>
        <button className={styles.image41} />
      </div>
    </div>
  );
};

export default GroupComponent2;

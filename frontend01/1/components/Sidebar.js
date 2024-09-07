import { useMemo } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({
  showGroupDiv,
  groupDivWidth,
  groupDivHeight,
  groupDivPosition,
  groupDivTop,
  groupDivRight,
  groupDivBottom,
  groupDivLeft,
  rectangleIconHeight,
  rectangleIconWidth,
  rectangleIconBottom,
  rectangleIconLeft,
  groupDivCursor,
  groupDivCursor1,
  onGroupContainer2Click,
  onGroupContainer3Click,
}) => {
  const groupDivStyle = useMemo(() => {
    return {
      width: groupDivWidth,
      height: groupDivHeight,
      position: groupDivPosition,
      top: groupDivTop,
      right: groupDivRight,
      bottom: groupDivBottom,
      left: groupDivLeft,
    };
  }, [
    groupDivWidth,
    groupDivHeight,
    groupDivPosition,
    groupDivTop,
    groupDivRight,
    groupDivBottom,
    groupDivLeft,
  ]);

  const rectangleIconStyle = useMemo(() => {
    return {
      height: rectangleIconHeight,
      width: rectangleIconWidth,
      bottom: rectangleIconBottom,
      left: rectangleIconLeft,
    };
  }, [
    rectangleIconHeight,
    rectangleIconWidth,
    rectangleIconBottom,
    rectangleIconLeft,
  ]);

  const groupDiv1Style = useMemo(() => {
    return {
      cursor: groupDivCursor,
    };
  }, [groupDivCursor]);

  const groupDiv2Style = useMemo(() => {
    return {
      cursor: groupDivCursor1,
    };
  }, [groupDivCursor1]);

  return (
    <div className={styles.vectorParent} style={groupDivStyle}>
      <img
        className={styles.componentChild}
        alt=""
        src="/rectangle-105.svg"
        style={rectangleIconStyle}
      />
      {showGroupDiv && (
        <div className={styles.teacherParent}>
          <div className={styles.teacher}>Teacher</div>
          <img className={styles.image38Icon} alt="" src="/image-38@2x.png" />
        </div>
      )}
      <div className={styles.classesParent}>
        <div className={styles.classes}>Classes</div>
        <img className={styles.image39Icon} alt="" src="/image-39@2x.png" />
      </div>
      <div
        className={styles.studentParent}
        style={groupDiv1Style}
        onClick={onGroupContainer2Click}
      >
        <div className={styles.student}>Student</div>
        <img className={styles.image40Icon} alt="" src="/image-40@2x.png" />
      </div>
      <div
        className={styles.messagesParent}
        style={groupDiv2Style}
        onClick={onGroupContainer3Click}
      >
        <div className={styles.classes}>Messages</div>
        <img className={styles.image41Icon} alt="" src="/image-41@2x.png" />
      </div>
    </div>
  );
};

export default Sidebar;

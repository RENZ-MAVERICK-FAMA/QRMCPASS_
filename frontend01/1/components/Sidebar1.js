import { useMemo } from "react";
import styles from "./Sidebar1.module.css";

const Sidebar1 = ({
  component1Margin,
  component1Position,
  component1Top,
  component1Left,
  rectangleIconHeight,
  rectangleIconWidth,
  rectangleIconBottom,
  rectangleIconLeft,
  onGroupContainer2Click,
  onGroupContainer3Click,
  onGroupContainer5Click,
  showGroupDiv,
}) => {
  const component1Style = useMemo(() => {
    return {
      margin: component1Margin,
      position: component1Position,
      top: component1Top,
      left: component1Left,
    };
  }, [component1Margin, component1Position, component1Top, component1Left]);

  const rectangleIcon1Style = useMemo(() => {
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

  return (
    <div className={styles.component1} style={component1Style}>
      <div className={styles.vectorParent}>
        <img
          className={styles.instanceChild}
          alt=""
          src="/rectangle-105.svg"
          style={rectangleIcon1Style}
        />
        <div className={styles.teacherParent}>
          <div className={styles.teacher}>Teacher</div>
          <img className={styles.image38Icon} alt="" src="/image-38@2x.png" />
        </div>
        <div className={styles.classesParent}>
          <div className={styles.classes}>Classes</div>
          <img className={styles.image39Icon} alt="" src="/image-39@2x.png" />
        </div>
        <div className={styles.studentParent} onClick={onGroupContainer2Click}>
          <div className={styles.student}>Student</div>
          <img className={styles.image40Icon} alt="" src="/image-40@2x.png" />
        </div>
        <div className={styles.messagesParent} onClick={onGroupContainer3Click}>
          <div className={styles.classes}>Messages</div>
          <img className={styles.image41Icon} alt="" src="/image-41@2x.png" />
        </div>
      </div>
      <div className={styles.usersParent} onClick={onGroupContainer5Click}>
        <div className={styles.users}>Users</div>
        <img className={styles.image42Icon} alt="" src="/image-42@2x.png" />
      </div>
    </div>
  );
};

export default Sidebar1;

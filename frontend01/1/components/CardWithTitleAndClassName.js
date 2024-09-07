import { useMemo } from "react";
import styles from "./CardWithTitleAndClassName.module.css";

const CardWithTitleAndClassName = ({
  rectangleDivLeft,
  rectangleDivTop,
  propBackgroundColor,
  propLeft,
  propTop,
  onRectangle7Click,
}) => {
  const groupButtonStyle = useMemo(() => {
    return {
      left: rectangleDivLeft,
      top: rectangleDivTop,
    };
  }, [rectangleDivLeft, rectangleDivTop]);

  const rectangleDivStyle = useMemo(() => {
    return {
      backgroundColor: propBackgroundColor,
    };
  }, [propBackgroundColor]);

  const lineIconStyle = useMemo(() => {
    return {
      left: propLeft,
      top: propTop,
    };
  }, [propLeft, propTop]);

  return (
    <button className={styles.rectangleParent} style={groupButtonStyle}>
      <div className={styles.groupChild} />
      <div className={styles.groupItem} />
      <div className={styles.groupChild} />
      <div className={styles.groupItem} />
      <div className={styles.className}>CLASS NAME</div>
      <img className={styles.lineIcon} alt="" src="/line-13.svg" />
      <img className={styles.groupChild1} alt="" src="/line-13.svg" />
      <div className={styles.groupChild} />
      <div className={styles.groupItem} />
      <div className={styles.groupChild4} onClick={onRectangle7Click} />
      <div className={styles.groupChild5} style={rectangleDivStyle} />
      <div className={styles.className}>Section</div>
      <img
        className={styles.groupChild6}
        alt=""
        src="/line-13.svg"
        style={lineIconStyle}
      />
      <img className={styles.image25Icon} alt="" src="/image-25@2x.png" />
      <div className={styles.teacherName}>Teacher Name</div>
    </button>
  );
};

export default CardWithTitleAndClassName;

import { useMemo } from "react";
import GroupComponent2 from "./GroupComponent2";
import styles from "./Sidebar11.module.css";

const Sidebar11 = ({
  propTop,
  propHeight,
  propBottom,
  onGroupContainer2Click,
  onGroupContainer3Click,
  onGroupContainer5Click,
}) => {
  const component2Style = useMemo(() => {
    return {
      top: propTop,
    };
  }, [propTop]);

  const rectangleIcon2Style = useMemo(() => {
    return {
      height: propHeight,
      bottom: propBottom,
    };
  }, [propHeight, propBottom]);

  return (
    <nav className={styles.component2} style={component2Style}>
      <GroupComponent2
        onGroupContainer2Click={onGroupContainer2Click}
        onGroupContainer3Click={onGroupContainer3Click}
      />
      <div className={styles.usersParent} onClick={onGroupContainer5Click}>
        <div className={styles.users}>Users</div>
        <button className={styles.image42} />
      </div>
    </nav>
  );
};

export default Sidebar11;

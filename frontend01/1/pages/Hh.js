import { useCallback } from "react";
import CardWithTitleAndClassName from "../components/CardWithTitleAndClassName";
import Sidebar11 from "../components/Sidebar11";
import styles from "./Hh.module.css";

const Hh = () => {
  const onRectangle7Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onRectangle15Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onRectangle23Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onRectangle31Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onRectangle39Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onRectangle47Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onRectangle55Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onRectangle63Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onRectangle71Click = useCallback(() => {
    // Please sync "Principal Class List" to the project
  }, []);

  const onGroupContainer2Click = useCallback(() => {
    // Please sync "Parent Student List" to the project
  }, []);

  const onGroupContainer3Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  const onGroupContainer5Click = useCallback(() => {
    // Please sync "Parent User Management Page" to the project
  }, []);

  const onImage5Click = useCallback(() => {
    // Please sync "Personal Information" to the project
  }, []);

  const onImage6Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  return (
    <div className={styles.hh}>
      <div className={styles.hhChild} />
      <h1 className={styles.home}>Home</h1>
      <button className={styles.image5} onClick={onImage5Click} />
      <button className={styles.image6} onClick={onImage6Click} />
      <button className={styles.image7} />
      <img className={styles.image22Icon} alt="" src="/image-22@2x.png" />
      <section className={styles.hhItem} />
      <div className={styles.hhInner} />
      <CardWithTitleAndClassName onRectangle7Click={onRectangle7Click} />
      <CardWithTitleAndClassName
        rectangleDivLeft="534px"
        rectangleDivTop="85px"
        propBackgroundColor="#ffed46"
        propLeft="798.6px"
        propTop="162.7px"
        onRectangle7Click={onRectangle15Click}
      />
      <CardWithTitleAndClassName
        rectangleDivLeft="843px"
        rectangleDivTop="86px"
        propBackgroundColor="#46ff7a"
        propLeft="1107.6px"
        propTop="163.7px"
        onRectangle7Click={onRectangle23Click}
      />
      <CardWithTitleAndClassName
        rectangleDivLeft="225px"
        rectangleDivTop="668px"
        propBackgroundColor="#46e9ff"
        propLeft="489.6px"
        propTop="745.7px"
        onRectangle7Click={onRectangle31Click}
      />
      <CardWithTitleAndClassName
        rectangleDivLeft="529px"
        rectangleDivTop="669px"
        propBackgroundColor="#ff4646"
        propLeft="793.6px"
        propTop="746.7px"
        onRectangle7Click={onRectangle39Click}
      />
      <CardWithTitleAndClassName
        rectangleDivLeft="838px"
        rectangleDivTop="670px"
        propBackgroundColor="#ff4689"
        propLeft="1102.6px"
        propTop="747.7px"
        onRectangle7Click={onRectangle47Click}
      />
      <CardWithTitleAndClassName
        rectangleDivLeft="847px"
        rectangleDivTop="375px"
        propBackgroundColor="#8146ff"
        propLeft="1111.6px"
        propTop="452.7px"
        onRectangle7Click={onRectangle55Click}
      />
      <CardWithTitleAndClassName
        rectangleDivLeft="534px"
        rectangleDivTop="376px"
        propBackgroundColor="#ff46ed"
        propLeft="798.6px"
        propTop="453.7px"
        onRectangle7Click={onRectangle63Click}
      />
      <CardWithTitleAndClassName
        rectangleDivLeft="228px"
        rectangleDivTop="376px"
        propBackgroundColor="#ffb546"
        propLeft="492.6px"
        propTop="453.7px"
        onRectangle7Click={onRectangle71Click}
      />
      <Sidebar11
        onGroupContainer2Click={onGroupContainer2Click}
        onGroupContainer3Click={onGroupContainer3Click}
        onGroupContainer5Click={onGroupContainer5Click}
      />
    </div>
  );
};

export default Hh;

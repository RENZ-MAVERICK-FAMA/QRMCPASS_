import { useCallback } from "react";
import { Button } from "@mui/material";
import MainCard from "../components/MainCard";
import Sidebar1 from "../components/Sidebar1";
import styles from "./ParentUserManagementPage1.module.css";

const ParentUserManagementPage1 = () => {
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
    <div className={styles.parentUserManagementPage1}>
      <header className={styles.parentUserManagementPage1Child} />
      <div className={styles.home}>Home</div>
      <button className={styles.image5} onClick={onImage5Click} />
      <button className={styles.image6} onClick={onImage6Click} />
      <button className={styles.image7} />
      <img className={styles.image22Icon} alt="" src="/image-22@2x.png" />
      <MainCard />
      <Button
        className={styles.parentUserManagementPage1Item}
        sx={{ width: 132 }}
        color="success"
        variant="contained"
      >
        Add
      </Button>
      <Sidebar1
        component1Margin="0"
        component1Position="absolute"
        component1Top="11px"
        component1Left="-9px"
        rectangleIconHeight="100.41%"
        rectangleIconWidth="102.39%"
        rectangleIconBottom="-0.41%"
        rectangleIconLeft="-0.48%"
        onGroupContainer2Click={onGroupContainer2Click}
        onGroupContainer3Click={onGroupContainer3Click}
        onGroupContainer5Click={onGroupContainer5Click}
        showGroupDiv={false}
      />
    </div>
  );
};

export default ParentUserManagementPage1;

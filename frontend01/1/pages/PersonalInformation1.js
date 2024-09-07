import { useCallback } from "react";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import Sidebar11 from "../components/Sidebar11";
import styles from "./PersonalInformation1.module.css";

const PersonalInformation1 = () => {
  const onGroupContainer2Click = useCallback(() => {
    // Please sync "Parent Student List" to the project
  }, []);

  const onGroupContainer3Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  const onGroupContainer5Click = useCallback(() => {
    // Please sync "Parent User Management Page" to the project
  }, []);

  const onImage6Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  return (
    <div className={styles.personalInformation1}>
      <header className={styles.personalInformation1Child} />
      <div className={styles.home}>Home</div>
      <button className={styles.image5} />
      <button className={styles.image6} onClick={onImage6Click} />
      <button className={styles.image7} />
      <img className={styles.image22Icon} alt="" src="/image-22@2x.png" />
      <main className={styles.personalInformation1Item} />
      <div className={styles.personalInformation1Inner} />
      <img className={styles.image22Icon1} alt="" src="/image-221@2x.png" />
      <TextField
        className={styles.email}
        color="info"
        label={`ID:
NAME:
AGE:
ADDRESS:
SEX:
CONTACT NUMBER:
EMAIL:
`}
        sx={{ width: 693 }}
        variant="filled"
      />
      <TextField
        className={styles.age}
        color="info"
        label={`ID:
NAME:
AGE:
ADDRESS:
SEX:
CONTACT NUMBER:
EMAIL:
`}
        sx={{ width: 693 }}
        variant="filled"
      />
      <TextField
        className={styles.background}
        color="info"
        label={`Background:
`}
        sx={{ width: 693 }}
        variant="filled"
        multiline
      />
      <TextField
        className={styles.contactNumber}
        color="info"
        label={`ID:
NAME:
AGE:
ADDRESS:
SEX:
CONTACT NUMBER:
EMAIL:
`}
        sx={{ width: 693 }}
        variant="filled"
      />
      <TextField
        className={styles.gender}
        color="info"
        label={`ID:
NAME:
AGE:
ADDRESS:
SEX:
CONTACT NUMBER:
EMAIL:
`}
        sx={{ width: 693 }}
        variant="filled"
      />
      <TextField
        className={styles.address}
        color="info"
        label={`ID:
NAME:
AGE:
ADDRESS:
SEX:
CONTACT NUMBER:
EMAIL:
`}
        sx={{ width: 693 }}
        variant="filled"
      />
      <TextField
        className={styles.name}
        color="info"
        label={`ID:
NAME:
AGE:
ADDRESS:
SEX:
CONTACT NUMBER:
EMAIL:
`}
        sx={{ width: 693 }}
        variant="filled"
      />
      <TextField
        className={styles.id}
        color="info"
        label={`ID:
NAME:
AGE:
ADDRESS:
SEX:
CONTACT NUMBER:
EMAIL:
`}
        sx={{ width: 693 }}
        variant="filled"
      />
      <Sidebar11
        propTop="16px"
        propHeight="100%"
        propBottom="0%"
        onGroupContainer2Click={onGroupContainer2Click}
        onGroupContainer3Click={onGroupContainer3Click}
        onGroupContainer5Click={onGroupContainer5Click}
      />
    </div>
  );
};

export default PersonalInformation1;

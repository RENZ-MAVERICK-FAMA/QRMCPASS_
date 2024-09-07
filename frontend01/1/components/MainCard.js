import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
} from "@mui/material";
import styles from "./MainCard.module.css";

const MainCard = () => {
  return (
    <main className={styles.lineParent}>
      <div className={styles.groupChild} />
      <div className={styles.groupItem} />
      <TextField
        className={styles.vinsBugaon}
        color="primary"
        label="Vins Bugaon"
        variant="outlined"
      />
      <TextField
        className={styles.one23fourgmailcom}
        color="primary"
        label="one23four@gmail.com"
        variant="outlined"
      />
      <Button
        className={styles.groupInner}
        sx={{ width: 132 }}
        color="info"
        variant="contained"
      >
        Edit
      </Button>
      <h2 className={styles.userManagement}>USER MANAGEMENT</h2>
      <div className={styles.lineDiv} />
      <Button
        className={styles.groupButton}
        sx={{ width: 132 }}
        color="error"
        variant="contained"
      >
        Delete
      </Button>
      <div className={styles.id}>ID</div>
      <div className={styles.name}>Name:</div>
      <div className={styles.groupChild1} />
      <div className={styles.groupChild2} />
      <div className={styles.email}>Email</div>
      <div className={styles.groupChild3} />
      <div className={styles.groupChild4} />
      <div className={styles.groupChild5} />
      <div className={styles.groupChild6} />
      <div className={styles.groupChild} />
      <div className={styles.groupChild} />
      <div className={styles.groupChild9} />
      <div className={styles.groupChild10} />
      <div className={styles.type}>Type</div>
      <div className={styles.groupChild11} />
      <TextField
        className={styles.parent}
        color="primary"
        label="Parent"
        variant="outlined"
      />
      <TextField
        className={styles.textfield}
        color="primary"
        label="22233"
        variant="outlined"
      />
    </main>
  );
};

export default MainCard;

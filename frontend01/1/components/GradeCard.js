import { useCallback } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  Icon,
  IconButton,
} from "@mui/material";
import styles from "./GradeCard.module.css";

const GradeCard = () => {
  const onFrameButtonClick = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  const onFrameButton1Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  const onFrameButton2Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  const onFrameButton3Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  const onFrameButton4Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  const onFrameButton5Click = useCallback(() => {
    // Please sync "messages" to the project
  }, []);

  return (
    <main className={styles.vectorParent}>
      <img className={styles.frameChild} alt="" src="/rectangle-63.svg" />
      <img className={styles.frameItem} alt="" src="/rectangle-64.svg" />
      <img className={styles.frameInner} alt="" src="/line-13.svg" />
      <img className={styles.lineIcon} alt="" src="/line-13.svg" />
      <img className={styles.frameChild1} alt="" src="/line-13.svg" />
      <img className={styles.frameChild2} alt="" src="/line-13.svg" />
      <img className={styles.frameChild3} alt="" src="/line-13.svg" />
      <img className={styles.frameChild4} alt="" src="/line-13.svg" />
      <div className={styles.lineDiv} />
      <div className={styles.frameChild5} />
      <div className={styles.frameChild6} />
      <div className={styles.frameChild7} />
      <div className={styles.frameChild8} />
      <Button
        className={styles.frameButton}
        sx={{ width: 108 }}
        color="primary"
        variant="contained"
        onClick={onFrameButtonClick}
      >
        MESSAGE
      </Button>
      <Button
        className={styles.frameChild9}
        sx={{ width: 108 }}
        color="primary"
        variant="contained"
        onClick={onFrameButton1Click}
      >
        MESSAGE
      </Button>
      <Button
        className={styles.frameChild10}
        sx={{ width: 108 }}
        color="primary"
        variant="contained"
        onClick={onFrameButton2Click}
      >
        MESSAGE
      </Button>
      <Button
        className={styles.frameChild11}
        sx={{ width: 108 }}
        color="primary"
        variant="contained"
        onClick={onFrameButton3Click}
      >
        MESSAGE
      </Button>
      <Button
        className={styles.frameChild12}
        sx={{ width: 108 }}
        color="primary"
        variant="contained"
        onClick={onFrameButton4Click}
      >
        MESSAGE
      </Button>
      <Button
        className={styles.frameChild13}
        sx={{ width: 108 }}
        color="primary"
        variant="contained"
        onClick={onFrameButton5Click}
      >
        MESSAGE
      </Button>
      <h3 className={styles.subject}>Subject</h3>
      <h3 className={styles.st}>{`1st `}</h3>
      <h3 className={styles.nd}>2nd</h3>
      <h3 className={styles.th}>{`4th `}</h3>
      <h3 className={styles.final}>Final</h3>
      <label className={styles.consultation}>Consultation</label>
      <div className={styles.rd}>3rd</div>
      <h3 className={styles.math}>Math</h3>
      <h3 className={styles.science}>Science</h3>
      <h3 className={styles.english}>English</h3>
      <h3 className={styles.filipino}>Filipino</h3>
      <h3 className={styles.gmrc}>GMRC</h3>
      <h3 className={styles.history}>History</h3>
      <TextField
        className={styles.textfield}
        color="primary"
        label="85%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield1}
        color="primary"
        label="90%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield2}
        color="primary"
        label="94%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield3}
        color="primary"
        label="86%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield4}
        color="primary"
        label="95%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield5}
        color="primary"
        label="74%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield6}
        color="primary"
        label="72%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield7}
        color="primary"
        label="97%"
        sx={{ width: 56 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield8}
        color="primary"
        label="84%"
        sx={{ width: 56 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield9}
        color="primary"
        label="95%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield10}
        color="primary"
        label="92%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield11}
        color="primary"
        label="86%"
        sx={{ width: 55 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield12}
        color="primary"
        label="85%"
        sx={{ width: 56 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield13}
        color="primary"
        label="95%"
        sx={{ width: 56 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield14}
        color="primary"
        label="96%"
        sx={{ width: 56 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield15}
        color="primary"
        label="86%"
        sx={{ width: 56 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield16}
        color="primary"
        label="92%"
        sx={{ width: 56 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield17}
        color="primary"
        label="76%"
        sx={{ width: 56 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield18}
        color="primary"
        label="89%"
        sx={{ width: 88 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield19}
        color="primary"
        label="90%"
        sx={{ width: 88 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield20}
        color="primary"
        label="85%"
        sx={{ width: 88 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield21}
        color="primary"
        label="95%"
        sx={{ width: 88 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield22}
        color="primary"
        label="75%"
        sx={{ width: 88 }}
        variant="outlined"
      />
      <TextField
        className={styles.textfield23}
        color="primary"
        label="95%"
        sx={{ width: 88 }}
        variant="outlined"
      />
    </main>
  );
};

export default GradeCard;

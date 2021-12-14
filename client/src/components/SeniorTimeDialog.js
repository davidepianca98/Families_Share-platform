import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import moment from "moment";
import axios from "axios";
import Log from "./Log";

let getDayName = (index, language) => {
  const days = Texts[language].availabilityWeekModal;
  switch (index) {
    case 0:
      return days.monday;
    case 1:
      return days.tuesday;
    case 2:
      return days.wednesday;
    case 3:
      return days.thursday;
    case 4:
      return days.friday;
    case 5:
      return days.saturday;
    case 6:
      return days.sunday;
    default:
      return "";
  }
};

const styles = () => ({
  paper: { height: "60vh" },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiListItemText: {
      primary: {
        fontSize: "1.4rem",
      },
    },
    MuiButton: {
      root: {
        fontSize: "1.4rem",
        color: "#009688",
      },
    },
    MuiDialog: {
      paperWidthSm: {
        width: "80vw",
        maxWidth: 400,
      },
      paperScrollPaper: {
        maxHeight: 800,
      },
    },
  },
});

class SeniorTimeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: props.day,
      language: props.language,
      senior: props.senior,
    };
  }

  componentDidMount() {
    // let startTime, endTime;
    let { day, language, senior } = this.state;
    let avail = senior.availabilities.find((row) => row.weekDay === day);
    if (!avail) avail = { weekDay: day };
    if (!avail.startTimeHour) avail.startTimeHour = 8;
    if (!avail.startTimeMinute) avail.startTimeMinute = 0;
    if (!avail.endTimeHour) avail.endTimeHour = 20;
    if (!avail.endTimeMinute) avail.endTimeMinute = 0;

    let str = `${avail.startTimeHour}:${avail.startTimeMinute}`;
    let startTime = moment(str, "H:mm");

    str = `${avail.endTimeHour}:${avail.endTimeMinute}`;
    let endTime = moment(str, "H:mm");

    this.setState({
      dayName: getDayName(day, language),
      startTime,
      endTime,
    });
  }

  handleSave = async () => {
    const { day, handleCloseTime, senior } = this.props;
    let { startTime, endTime } = this.state;

    let updated = {};
    updated.weekDay = day;
    updated.startTimeHour = startTime.hour();
    updated.startTimeMinute = startTime.minutes();
    updated.endTimeHour = endTime.hour();
    updated.endTimeMinute = endTime.minutes();

    let idx = senior.availabilities.findIndex((row) => {
      return row.weekDay === day;
    });

    if (idx >= 0) senior.availabilities[idx] = updated;
    else senior.availabilities.push(updated);

    senior.availabilities = JSON.stringify(senior.availabilities);
    await axios
      .put(`/api/seniors/${senior.senior_id}`, senior, {})
      .then((response) => {
        Log.info(response);
        handleCloseTime();
      })
      .catch((error) => {
        Log.error(error);
        handleCloseTime();
      });
    handleCloseTime();
  };

  handleCancel = () => {
    const { handleCloseTime } = this.props;
    handleCloseTime();
  };

  handleStartChange = (time) => {
    this.setState({ startTime: time });
  };

  handleEndChange = (time) => {
    this.setState({ endTime: time });
  };

  render() {
    const { language, isOpen, classes } = this.props;
    const { dayName, startTime, endTime } = this.state;
    const texts = Texts[language].availabilityTimeModal;

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          onClose={this.handleCancelTime}
          aria-labelledby="availability user dialog"
          open={isOpen}
          classes={{ paper: classes.paper }}
        >
          <DialogTitle>
            <div className="seniorAvailabilitySelect">{`${texts.header} ${dayName}`}</div>
          </DialogTitle>

          <DialogContent>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <TimePicker
                clearable
                ampm={false}
                label="Inizio"
                value={startTime}
                onChange={this.handleStartChange}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <TimePicker
                clearable
                ampm={false}
                label="Fine"
                value={endTime}
                onChange={this.handleEndChange}
              />
            </MuiPickersUtilsProvider>
          </DialogContent>

          <DialogActions>
            <Button fontSize={20} variant="text" onClick={this.handleCancel}>
              {texts.cancel}
            </Button>
            <Button onClick={this.handleSave}>{texts.save}</Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

SeniorTimeDialog.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSave: PropTypes.func,
  language: PropTypes.string,
};

export default withStyles(styles)(withLanguage(SeniorTimeDialog));

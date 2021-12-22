import React from "react";
import axios from "axios";
import Log from "./Log";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import LoadingSpinner from "./LoadingSpinner";

let mygetDayName = (index, language) => {
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

class SeniorWeekDialog extends React.Component {
  constructor(props) {
    super(props);

    const allDays = [];

    this.state = {
      fetchedSeniorData: false,
      allDays,
    };
  }

  componentDidMount() {
    const allDays = [];
    let { senior } = this.props;
    let originalAvailabilities = [...senior.availabilities];
    let localAvailabilities = [...senior.availabilities];
    let idx = 0;
    [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ].forEach((day) => {
      allDays.push({
        index: idx,
        dayName: day,
        available: false,
        startTimeHour: 0,
        startTimeMinute: 0,
        endTimeHour: 0,
        endTimeMinute: 0,
      });
      idx++;
    });

    localAvailabilities.forEach((availability) => {
      allDays.forEach((day) => {
        if (day.index === availability.weekDay) day.available = true;
      });
    });

    this.setState({
      senior: senior,
      fetchedSeniorData: true,
      allDays: allDays,
      localAvailabilities: localAvailabilities,
      originalAvailabilities: originalAvailabilities,
    });
  }

  handleSave = async () => {
    let { allDays, senior } = this.state;

    senior = await axios
      .get(`/api/seniors/${senior.senior_id}`)
      .then((response) => {
        let res = response.data;
        return res;
      })
      .catch((error) => {
        Log.error(error);
        return null;
      });

    let newAvailabilities = [];

    allDays.forEach((day) => {
      if (day.available) {
        let current = senior.availabilities.find(
          (row) => row.weekDay === day.index
        );
        if (!current) current = { weekDay: day.index };
        if (!current.startTimeHour) current.startTimeHour = 8;
        if (!current.startTimeMinute) current.startTimeMinute = 0;
        if (!current.endTimeHour) current.endTimeHour = 20;
        if (!current.endTimeMinute) current.endTimeMinute = 0;
        newAvailabilities.push(current);
      }
    });

    senior.availabilities = JSON.stringify(newAvailabilities);

    const { handleCloseWeek } = this.props;
    axios
      .put(`/api/seniors/${senior.senior_id}`, senior, {})
      .then((response) => {
        Log.info(response);
        handleCloseWeek();
      })
      .catch((error) => {
        Log.error(error);
        handleCloseWeek();
      });

    handleCloseWeek();
  };

  handleCancelWeek = () => {
    const { originalAvailabilities, senior } = this.state;
    senior.availabilities = originalAvailabilities;
    const { handleCloseWeek } = this.props;
    handleCloseWeek();
  };

  handleOpenTime = (day) => {
    const { language, handleOpenTime } = this.props;

    let dayName = mygetDayName(day.index, language);
    this.setState({ day: dayName });

    handleOpenTime(day);
  };

  render() {
    const { allDays, fetchedSeniorData } = this.state;

    if (fetchedSeniorData) {
      const { language, isOpen, classes } = this.props;
      const texts = Texts[language].availabilityWeekModal;

      const handleToggle = (dayIndex) => {
        const { localAvailabilities } = this.state;
        let found = -1;
        let idx = 0;
        localAvailabilities.forEach((item) => {
          if (item.weekDay === dayIndex) found = idx;
          idx++;
        });
        if (found === -1) {
          allDays[dayIndex].available = true;
          localAvailabilities.push({
            weekDay: dayIndex,
            startTimeHour: 8,
            startTimeMinute: 0,
            endTimeHour: 20,
            endTimeMinute: 0,
          });
        } else {
          allDays[dayIndex].available = false;
          localAvailabilities.splice(found, 1);
        }
        this.setState({ localAvailabilities: localAvailabilities });
      };

      return (
        <MuiThemeProvider theme={theme}>
          <Dialog
            onClose={this.handleCancelWeek}
            aria-labelledby="availability user dialog"
            open={isOpen}
            classes={{ paper: classes.paper }}
          >
            <DialogTitle>
              <div className="seniorAvailabilitySelect">{texts.header}</div>
            </DialogTitle>
            <DialogContent>
              <List>
                {allDays.map((day) => {
                  return (
                    <ListItem
                      key={day.index}
                      role={undefined}
                      dense
                      button
                      onClick={() => handleToggle(day.index)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={day.available}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": day.dayName }}
                        />
                      </ListItemIcon>

                      <ListItemText
                        id={day.dayName}
                        primary={`${texts[day.dayName]}`}
                      />

                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() =>
                            day.available
                              ? this.handleOpenTime(day.index)
                              : null
                          }
                        >
                          <AccessTimeIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                fontSize={20}
                variant="text"
                onClick={this.handleCancelWeek}
              >
                {texts.cancel}
              </Button>
              <Button onClick={this.handleSave}>{texts.save}</Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      );
    } else {
      return <LoadingSpinner />;
    }
  }
}

SeniorWeekDialog.propTypes = {
  isOpen: PropTypes.bool,
  handleCloseWeek: PropTypes.func,
  handleOpenTime: PropTypes.func,
  senior: PropTypes.object,
  language: PropTypes.string,
};

export default withStyles(styles)(withLanguage(SeniorWeekDialog));

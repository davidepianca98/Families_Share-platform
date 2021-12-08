import React from "react";
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
import { createMuiTheme, MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

const styles = () => ({
  paper: { height: "60vh" },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiListItemText: {
      primary: {
        fontSize: "1.4rem"
      }
    },
    MuiButton: {
      root: {
        fontSize: "1.4rem",
        color: "#009688"
      }
    },
    MuiDialog: {
      paperWidthSm: {
        width: "80vw",
        maxWidth: 400
      },
      paperScrollPaper: {
        maxHeight: 800
      }
    }
  }
});

class SeniorAvailabilityDialog extends React.Component {
  constructor(props) {
    super(props);
    const { availabilities } = this.props;

    const allDays = [];
    let idx = 0;
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      .forEach(day => {
        allDays.push(
          {index: idx, 
           dayName: day, 
           available: false, 
           startTimeHour: 0, 
           startTimeMinute: 0, 
           endTimeHour: 0, 
           endTimeMinute: 0
          });
        idx++;
      });

    availabilities.forEach(availability => {
      let found = allDays.filter(day => day.index === availability.weekDay);
      if (found) {
          found.available = true
      }
    })

    this.state = {
      availabilities,
      allDays
    };
  }

  componentDidMount() {
  }

  handleSave = () => {
  };

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const {
      allDays
    } = this.state;
    const { language, isOpen, classes } = this.props;
    const texts = Texts[language].availabilityModal;

    const handleToggle = dayIndex => {
      const { availabilities } = this.state;
      let found = -1;
      let idx = 0;
      availabilities.forEach(item => {
        if (item.weekDay === dayIndex)
          found = idx;
        idx++;
      })
      if (found === -1) {
        allDays[dayIndex].available = true
        availabilities.push({
          weekDay: dayIndex,
          startTimeHour: 0,
          startTimeMinute: 0,
          endTimeHour: 0,
          endTimeMinute: 0
        });
      } else {
        allDays[dayIndex].available = false
        availabilities.splice(found, 1);
      }
      this.setState({ availabilities });
    };
  
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          onClose={this.handleClose}
          aria-labelledby="availability user dialog"
          open={isOpen}
          classes={{ paper: classes.paper }}
        >
          <DialogTitle>
            <div className="seniorAvailabilityDialogTitle">{texts.header}</div>
          </DialogTitle>
          <DialogContent>
            <List>
              {allDays.map( (day) => {
                return (
                  <ListItem
                      key={day.index}
                      role={undefined}
                      dense
                      button
                      onClick={() => handleToggle(day.index)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={day.available}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': day.dayName }}
                      />
                    </ListItemIcon>

                    <ListItemText id={day.dayName}  primary={`${texts[day.dayName]}`}/>

                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments">
                        <AccessTimeIcon/>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
          <DialogActions>
            <Button fontSize={20} variant="text" onClick={this.handleClose}>
              {texts.cancel}
            </Button>
            <Button onClick={this.handleSave}>{texts.save}</Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

SeniorAvailabilityDialog.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSave: PropTypes.func,
  availabilities: PropTypes.array,
  language: PropTypes.string
};

export default withStyles(styles)(withLanguage(SeniorAvailabilityDialog));

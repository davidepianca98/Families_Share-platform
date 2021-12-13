import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

let getDayName = (index, language) => {
  const days = Texts[language].availabilityWeekModal;
  switch (index) {
    case 0:      return days.monday;
    case 1:      return days.tuesday;
    case 2:      return days.wednesday;
    case 3:      return days.thursday;
    case 4:      return days.friday;
    case 5:      return days.saturday;
    case 6:      return days.sunday;
    default:      return "";
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
      dayName: "xxx", 
    };

  }

  componentDidMount() {
    const {language, day} = this.props;
    this.setState({ dayName: getDayName(day, language) });
  }

  handleSave = () => {
    const { handleCloseTime } = this.props;
    handleCloseTime();
  };

  handleCancel = () => {
    const { handleCloseTime } = this.props;
    handleCloseTime();
  };

  render() {
    const { language, isOpen, classes, senior} = this.props;
    const { dayName } = this.state;
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

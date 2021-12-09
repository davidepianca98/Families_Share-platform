import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const materialTheme = createTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#00838f",
      },
    },
    MuiPickersDay: {
      day: {
        color: "#444444",
      },
      daySelected: {
        backgroundColor: "#00838f",
      },
      dayDisabled: {
        color: "#aaaaaa",
      },
      current: {
        color: "#00838f",
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: "#00838f",
      },
    },
  },
});

const styles = (theme) => ({
  resize: {
    fontSize: "1.5rem",
  },
  createButton: {
    backgroundColor: "#ff6f00",
    bottom: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "3.2rem",
    fontSize: "1.5rem",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ff6f00",
    },
  },
});

class MaterialBookingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
    };
  }

  isValidBooking = (booking) => {
    return booking.start <= booking.end;
  };

  handleStartChange = (date) => {
    this.setState({ startDate: date });
  };
  handleEndChange = (date) => {
    this.setState({ endDate: date });
  };

  handleCreation = () => {
    const { match, history } = this.props;
    const { materialId } = match.params;
    const { startDate, endDate } = this.state;
    const booking = {
      start: startDate,
      end: endDate,
    };
    if (this.isValidBooking(booking)) {
      this.setState({ fetchedData: false });
      axios
        .post(`/api/materials/offers/${materialId}/book`, booking)
        .then((response) => {
          Log.info(response); // TODO: do we need this line?
          history.goBack();
        })
        .catch((error) => {
          Log.error(error);
          history.goBack();
        });
    }
  };

  render() {
    const { startDate, endDate } = this.state;
    const { language, history, classes } = this.props;
    const texts = Texts[language].MaterialBookingScreen;
    const rowStyle = { minHeight: "5rem" };
    return (
      <React.Fragment>
        <div id="materialBookingContainer">
          <div className="row no-gutters" id="materialBookingHeaderContainer">
            <div className="col-2-10">
              <button
                className="transparentButton center"
                type="button"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-8-10">
              <h1 className="verticalCenter">{texts.backNavTitle}</h1>
            </div>
          </div>
          <div id="materialBookingMainContainer">
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-1-10">
                <i
                  className="far fa-calendar-alt materialBookingInfoIcon"
                  style={{ fontSize: "2.5rem" }}
                />
              </div>
              <div className="col-9-10">
                <div className="materialInfoHeader">{texts.date}</div>
              </div>
            </div>

            <div
              className="row no-gutters justify-content-center"
              style={rowStyle}
            >
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <ThemeProvider theme={materialTheme}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label={texts.startDateLabel}
                    format="L"
                    value={startDate}
                    onChange={this.handleStartChange}
                    minDate={new Date()}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    InputLabelProps={{
                      style: {
                        fontSize: "1.5rem",
                      },
                    }}
                    InputProps={{
                      classes: {
                        input: classes.resize,
                      },
                    }}
                  />
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label={texts.endDateLabel}
                    format="L"
                    value={endDate}
                    onChange={this.handleEndChange}
                    minDate={startDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    InputLabelProps={{
                      style: {
                        fontSize: "1.5rem",
                      },
                    }}
                    InputProps={{
                      classes: {
                        input: classes.resize,
                      },
                    }}
                  />
                </ThemeProvider>
              </MuiPickersUtilsProvider>
            </div>
            <div className={classes.actionsContainer}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleCreation}
                className={classes.createButton}
                size="large"
                disabled={
                  !this.isValidBooking({ start: startDate, end: endDate })
                }
              >
                {texts.create}
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withLanguage(MaterialBookingScreen));

MaterialBookingScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
};

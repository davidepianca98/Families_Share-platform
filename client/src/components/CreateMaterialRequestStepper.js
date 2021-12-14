import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import axios from "axios";
import withLanguage from "./LanguageContext";
import CreateMaterialRequestInformation from "./CreateMaterialRequestInformation";
import Texts from "../Constants/Texts";
import Log from "./Log";
import LoadingSpinner from "./LoadingSpinner";

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiStepper: {
      root: {
        padding: 18,
      },
    },
    MuiStepLabel: {
      label: {
        fontFamily: "Roboto",
        fontSize: "1.56rem",
      },
    },
    MuiButton: {
      root: {
        fontSize: "1.2rem",
        fontFamily: "Roboto",
        float: "left",
      },
    },
  },
});

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#00838F",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#00838F",
    },
    boxShadow: "0 6px 6px 0 rgba(0,0,0,0.24)",
    height: "4.2rem",
    width: "12rem",
  },
  createButton: {
    backgroundColor: "#ff6f00",
    position: "fixed",
    bottom: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "3.2rem",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ff6f00",
    },
  },
  stepLabel: {
    root: {
      color: "#ffffff",
      "&$active": {
        color: "white",
        fontWeight: 500,
      },
      "&$completed": {
        color: theme.palette.text.primary,
        fontWeight: 500,
      },
      "&$alternativeLabel": {
        textAlign: "center",
        marginTop: 16,
        fontSize: "5rem",
      },
      "&$error": {
        color: theme.palette.error.main,
      },
    },
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    marginTop: theme.spacing.unit,
    color: "grey",
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ffffff",
    },
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

class CreateMaterialRequestStepper extends React.Component {
  constructor(props) {
    super(props);
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#795548",
      "#607d8b",
    ];
    this.state = {
      activeStep: 0,
      information: {
        name: "",
        color: colors[Math.floor(Math.random() * colors.length)],
        description: "",
        location: "",
      },
      stepWasValidated: false,
      creating: false,
    };
  }

  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = (event) => {
    const data = JSON.parse(event.data);
    const { history } = this.props;
    const { activeStep } = this.state;
    if (data.action === "stepperGoBack") {
      if (activeStep - 1 >= 0) {
        this.setState({ activeStep: activeStep - 1 });
      } else {
        history.goBack();
      }
    }
  };

  createMaterialRequest = () => {
    const { match, history, enqueueSnackbar, language } = this.props;
    const texts = Texts[language].createMaterialRequestStepper;
    const { groupId } = match.params;
    const { information } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const materialRequest = this.formatDataToMaterialRequest(
      information,
      groupId,
      userId
    );
    this.setState({ creating: true });
    axios
      .post(`/api/groups/${groupId}/materialRequests`, materialRequest)
      .then((response) => {
        enqueueSnackbar("Richiesta creata con successo", {
          // TODO
          variant: "info",
        });
        Log.info(response);
        history.goBack();
      })
      .catch((error) => {
        Log.error(error);
        history.goBack();
      });
  };

  formatDataToMaterialRequest = (information, groupId, userId) => {
    return {
      group_id: groupId,
      creator_id: userId,
      material_name: information.name,
      color: information.color,
      description: information.description,
      location: information.location,
    };
  };

  handleInformationSubmit = (information, wasValidated) => {
    this.setState({ information, stepWasValidated: wasValidated });
  };

  getStepContent = () => {
    const { information } = this.state;
    return (
      <CreateMaterialRequestInformation
        {...information}
        handleSubmit={this.handleInformationSubmit}
      />
    );
  };

  getStepLabel = (label, index) => {
    const { activeStep } = this.state;
    const iconStyle = { fontSize: "2rem" };
    let icon = "";
    switch (index) {
      case 0:
        icon = "fas fa-info-circle";
        break;
      default:
        icon = "fas fa-exclamation";
    }
    if (activeStep >= index) {
      iconStyle.color = "#00838F";
    } else {
      iconStyle.color = "rgba(0,0,0,0.5)";
    }
    return (
      <div id="stepLabelIconContainer">
        <i className={icon} style={iconStyle} />
      </div>
    );
  };

  render() {
    const { language, classes } = this.props;
    const texts = Texts[language].createMaterialRequestStepper;
    const steps = texts.stepLabels;
    const { activeStep, stepWasValidated, creating } = this.state;
    return (
      <div className={classes.root}>
        {creating && <LoadingSpinner />}
        <MuiThemeProvider theme={muiTheme}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel
                    icon={this.getStepLabel(label, index)}
                    className={classes.stepLabel}
                  >
                    {label}
                  </StepLabel>
                  <StepContent>
                    {this.getStepContent()}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={!stepWasValidated}
                          variant="contained"
                          color="primary"
                          onClick={this.createMaterialRequest}
                          className={
                            activeStep === steps.length - 1
                              ? classes.createButton
                              : classes.continueButton
                          }
                        >
                          {activeStep === steps.length - 1
                            ? texts.finish
                            : texts.continue}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </MuiThemeProvider>
      </div>
    );
  }
}

CreateMaterialRequestStepper.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  enqueueSnackbar: PropTypes.func,
};
export default withSnackbar(
  withRouter(withLanguage(withStyles(styles)(CreateMaterialRequestStepper)))
);

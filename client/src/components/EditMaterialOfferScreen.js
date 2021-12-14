import React from "react";
import autosize from "autosize";
import axios from "axios";
import { CirclePicker } from "react-color";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import LoadingSpinner from "./LoadingSpinner";
import withLanguage from "./LanguageContext";
import Log from "./Log";
import { Switch, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  modifyButton: {
    backgroundColor: "#ff6f00",

    bottom: "5%",
    borderRadius: "3.2rem",
    fontSize: "1.5rem",
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ff6f00",
    },
  },
  deleteButton: {
    backgroundColor: "#ff0000",

    bottom: "5%",
    borderRadius: "3.2rem",
    fontSize: "1.5rem",
    marginTop: theme.spacing.unit,
    /*marginRight: theme.spacing.unit,*/
    "&:hover": {
      backgroundColor: "#ff0000",
    },
  },
});

class EditMaterialOfferScreen extends React.Component {
  state = {
    fetchedData: false,
  };

  componentDidMount() {
    const { match } = this.props;
    const { materialId } = match.params;
    axios
      .get(`/api/materials/offers/${materialId}`)
      .then((response) => {
        const { material_name, description, color, location, borrowed } =
          response.data;
        this.setState({
          fetchedData: true,
          material_name,
          color,
          description,
          location,
          borrowed,
          validated: true,
        });
      })
      .catch((error) => {
        Log.error(error);
        this.setState({
          fetchedData: true,
          material_name: "",
          color: "",
          description: "",
          location: "",
          borrowed: true,
          validated: false,
        });
      });
  }

  handleChange = (event) => {
    const state = Object.assign({}, this.state);
    const { name } = event.target;
    const { value } = event.target;
    state[name] = value;
    state.validated = false;
    if (state.color && state.material_name) {
      state.validated = true;
    }
    this.setState(state);
  };

  handleSwitch = (value) => {
    const { match } = this.props;
    const { materialId } = match.params;
    const state = Object.assign({}, this.state);
    state.borrowed = !value;
    this.setState(state);
    axios
      .post(`/api/materials/offers/${materialId}/booked`, {
        borrowed: state.borrowed,
      })
      .catch((error) => {
        Log.error(error);
      });
  };

  handleColorChange = (color) => {
    const state = Object.assign({}, this.state);
    state.color = color.hex;
    this.setState(state);
  };

  handleSave = () => {
    const { match, history } = this.props;
    const { materialId } = match.params;
    const { validated, material_name, color, location, description } =
      this.state;
    if (validated) {
      this.setState({ fetchedData: false });
      const patch = {
        material_name,
        color,
        location: location.trim(),
        description: description.trim(),
      };
      axios
        .put(`/api/materials/offers/${materialId}`, patch)
        .then((response) => {
          Log.info(response);
          history.goBack();
        })
        .catch((error) => {
          Log.error(error);
          history.goBack();
        });
    }
  };

  handleDelete = () => {
    const { match, history } = this.props;
    const { materialId, groupId } = match.params;
    axios
      .delete(`/api/materials/offers/${materialId}`)
      .then((response) => {
        Log.info(response);
        history.push(`/groups/${groupId}/materials/offers`);
      })
      .catch((error) => {
        Log.error(error);
        history.goBack();
      });
  };

  render() {
    const {
      fetchedData,
      validated,
      material_name,
      description,
      location,
      borrowed,
      color,
    } = this.state;
    const { language, history, classes } = this.props;
    const texts = Texts[language].editMaterialOfferScreen;
    return fetchedData ? (
      <React.Fragment>
        <div className="row no-gutters" id="editMaterialOfferHeaderContainer">
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
        <div id="editMaterialOfferMainContainer">
          <div className="row no-gutters">
            <div className="col-2-10">
              <i className="fas fa-clipboard-check center" />
            </div>
            <div className="col-8-10">
              <input
                type="text"
                name="material_name"
                placeholder={texts.name}
                value={material_name}
                className="verticalCenter"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <i className="fas fa-map-marker-alt center" />
            </div>
            <div className="col-8-10">
              <input
                type="text"
                name="location"
                placeholder={texts.location}
                value={location}
                className="verticalCenter"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div
            className="row no-gutters"
            style={{ height: "auto", minHeight: "6rem" }}
          >
            <div className="col-2-10">
              <i className="fas fa-align-left center" />
            </div>
            <div className="col-8-10">
              <textarea
                rows="1"
                name="description"
                className="verticalCenter"
                placeholder={texts.description}
                value={description}
                onChange={(event) => {
                  this.handleChange(event);
                  autosize(document.querySelectorAll("textarea"));
                }}
              />
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <i class="far fa-calendar-check center" />
            </div>
            <div className="col-6-10" style={{ paddingLeft: "10px" }}>
              <h1 className="verticalCenter" style={{ fontSize: "1.5rem" }}>
                {texts.borrowed}
              </h1>
            </div>
            <div
              className="col-2-10"
              style={{
                margin: "auto",
              }}
            >
              <Switch
                checked={!borrowed}
                onClick={() => {
                  this.handleSwitch(borrowed);
                }}
                color="primary"
                name="borrowed"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <i
                className="fas fa-palette center"
                style={{ color }}
                alt="palette icon"
              />
            </div>
            <div className="col-8-10">
              <h1 className="verticalCenter" style={{ color }}>
                {texts.color}
              </h1>
            </div>
          </div>
          <div className="row no-gutters" style={{ marginBottom: "4rem" }}>
            <div className="col-2-10" />
            <div className="col-8-10">
              <CirclePicker
                width="100%"
                color={color}
                onChange={this.handleColorChange}
              />
            </div>
          </div>
          <div
            className={classes.actionsContainer + " row no-gutters"}
            style={{ marginTop: "10rem" }}
          >
            <div className="col-1-2 d-flex justify-content-center">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSave}
                className={classes.modifyButton}
                size="large"
                disabled={!validated}
              >
                {texts.modify}
              </Button>
            </div>
            <div className="col-1-2 d-flex justify-content-center">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleDelete}
                className={classes.deleteButton}
                size="large"
              >
                {texts.delete}
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withStyles(styles)(withLanguage(EditMaterialOfferScreen));

EditMaterialOfferScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
};

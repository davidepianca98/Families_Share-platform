import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";
import Images from "../Constants/Images";
import Log from "./Log";
import moment from "moment";
import { Button } from "@material-ui/core";
import MaterialOfferScreenNavbar from "./MaterialOfferScreenNavbar";
import { Switch, Route, withRouter } from "react-router-dom";

const styles = (theme) => ({
  add: {
    position: "fixed",
    bottom: "3rem",
    right: "5%",
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
  avatar: {
    width: "3rem!important",
    height: "3rem!important",
  },

  bookButton: {
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
});

const getMaterialOffer = (materialOfferId) => {
  return axios
    .get(`/api/materials/offers/${materialOfferId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {
        material_name: "",
        description: "",
        borrowed: true,
        color: "#00838f",
        location: "",
      };
    });
};

const getGroupMembers = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/members`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

class MaterialOfferScreen extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    const { groupId, materialId } = match.params;
    this.state = {
      fetchedMaterialOfferData: false,
      pendingRequest: false,
      materialOffer: {},
      userCanEdit: false,
      action: "",
      groupId,
      materialId,
    };
  }

  async componentDidMount() {
    const { groupId, materialId } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const materialOffer = await getMaterialOffer(materialId, groupId);
    const groupMembers = await getGroupMembers(groupId);
    const userIsAdmin = groupMembers.filter(
      (member) =>
        member.user_id === userId &&
        member.group_accepted &&
        member.user_accepted
    )[0].admin;
    const userIsCreator = userId === materialOffer.created_by;
    const userCanEdit = userIsAdmin || userIsCreator;
    this.setState({
      materialOffer,
      fetchedMaterialOfferData: true,
      userCanEdit,
    });
  }

  handleEdit = () => {
    const { history } = this.props;
    let { pathname } = history.location;
    pathname = `${pathname}/edit`;
    history.push(pathname);
  };

  handleBook = () => {
    const { history } = this.props;
    let { pathname } = history.location;
    pathname = `${pathname}/book`;
    history.push(pathname);
  };

  getDatesString = (date) => {
    return moment(date).format("ll");
  };

  render() {
    const { history, language, classes } = this.props;
    const {
      materialOffer,
      fetchedMaterialOfferData,
      userCanEdit,
      pendingRequest,
      materialId,
      groupId,
    } = this.state;
    const materialOfferPath = `/groups/${groupId}/materials/offers/${materialId}`;
    const texts = Texts[language].materialOfferScreen;
    const rowStyle = { minHeight: "5rem" };
    return fetchedMaterialOfferData ? (
      <React.Fragment>
        {pendingRequest && <LoadingSpinner />}
        <div id="materialContainer">
          <div
            id="materialHeaderContainer"
            className="row no-gutters"
            style={{ backgroundColor: materialOffer.color }}
          >
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-6-10">
              <h1 className="center">{materialOffer.material_name}</h1>
            </div>
            <div className="col-2-10">
              {userCanEdit ? (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleEdit}
                >
                  <i className="fas fa-pencil-alt" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
          <MaterialOfferScreenNavbar color={materialOffer.color} />

          <Switch>
            <Route
              path={`${materialOfferPath}/info`}
              render={() => (
                <div id="materialMainContainer">
                  <div className="row no-gutters" style={rowStyle}>
                    <div className="materialInfoHeader">{texts.infoHeader}</div>
                  </div>
                  {materialOffer.description && (
                    <div className="row no-gutters" style={rowStyle}>
                      <div className="col-1-10">
                        <i className="far fa-file-alt materialInfoIcon" />
                      </div>
                      <div className="col-9-10">
                        <div className="materialInfoDescription">
                          {materialOffer.description}
                        </div>
                      </div>
                    </div>
                  )}
                  {materialOffer.location && (
                    <div className="row no-gutters" style={rowStyle}>
                      <div className="col-1-10">
                        <img
                          src={Images.mapMarkerAltRegular}
                          alt="map marker icon"
                          className="materialInfoImage"
                        />
                      </div>
                      <div className="col-9-10">
                        <div className="materialInfoDescription">
                          {materialOffer.location}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="row no-gutters" style={rowStyle}>
                    <div className="materialInfoHeader">
                      {texts.creationDate}
                    </div>
                  </div>
                  <div className="row no-gutters" style={rowStyle}>
                    <div className="col-1-10">
                      <i className="far fa-calendar materialInfoIcon" />
                    </div>
                    <div className="col-9-10">
                      <div className="materialInfoDescription">
                        {this.getDatesString(materialOffer.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="row no-gutters" style={rowStyle}>
                    <div className="materialInfoHeader">
                      {texts.disponibilityStatus}
                    </div>
                  </div>
                  <div className="row no-gutters" style={rowStyle}>
                    <div className="col-1-10">
                      <i
                        className={
                          materialOffer.borrowed
                            ? "fas fa-times materialInfoIcon"
                            : "fas fa-check materialInfoIcon"
                        }
                      />
                    </div>
                    <div className="col-9-10">
                      <div className="materialInfoDescription">
                        {materialOffer.borrowed
                          ? texts.notDisponibile
                          : texts.disponible}
                      </div>
                    </div>
                  </div>
                  {/* TODO: add owner name */}
                  <div className={classes.actionsContainer}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleBook}
                      className={classes.bookButton}
                      size="large"
                    >
                      {texts.book}
                    </Button>
                  </div>
                </div>
              )}
            />
            <Route
              path={`${materialOfferPath}/books`}
              render={() => (
                <div id="materialMainContainer">
                  <h1>TODO</h1>
                </div>
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withSnackbar(
  withRouter(withStyles(styles)(withLanguage(MaterialOfferScreen)))
);

MaterialOfferScreen.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
  classes: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

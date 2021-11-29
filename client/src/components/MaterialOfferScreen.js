import React from "react";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import * as path from "lodash.get";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import TimeslotsList from "./TimeslotsList";
import ConfirmDialog from "./ConfirmDialog";
import OptionsModal from "./OptionsModal";
import LoadingSpinner from "./LoadingSpinner";
import Images from "../Constants/Images";
import Log from "./Log";
import Avatar from "./Avatar";

const styles = {
  boo: {
    position: "fixed",
  },
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
};

const getActivity = (activityId, groupId) => {
  return axios
    .get(`/api/groups/${groupId}/activities/${activityId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {
        name: "",
        description: "",
        color: "#ffffff",
        group_name: "",
        location: "",
        dates: [],
        repetition_type: "",
      };
    });
};

const getActivityParents = (ids) => {
  return axios
    .get("/api/profiles", {
      params: {
        ids,
        searchBy: "ids",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

class MaterialOfferInfo extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    const { groupId, materialId } = match.params;
    this.state = {
      fetchedMaterialOfferData: false,
      pendingRequest: false,
      material: {},
      confirmDialogIsOpen: false,
      userCanEdit: false,
      action: "",
      groupId,
      materialId,
      count: 0,
    };
  }

  async componentDidMount() {
    const { groupId, materialId, material } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    // TODO get material const activity = await getActivity(activityId, groupId);

    const userIsCreator = userId === material.creator_id;
    const userCanEdit = userIsCreator;
    //this.setState({ activity, fetchedMaterialOfferData: true, userCanEdit });
  }

  handleRedirect = (suspended, child_id) => {
    const { history } = this.props;
    if (!suspended) {
      history.push(`/profiles/groupmember/children/${child_id}`);
    }
  };

  addActivity = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/timeslots/add`);
  };

  handleEdit = () => {
    const { history } = this.props;
    let { pathname } = history.location;
    pathname = `${pathname}/edit`;
    history.push(pathname);
  };

  handleDelete = () => {
    const { match, history } = this.props;
    const { groupId, activityId } = match.params;
    this.setState({ pendingRequest: true });
    axios
      .delete(`/api/groups/${groupId}/activities/${activityId}`)
      .then((response) => {
        Log.info(response);
        history.goBack();
      })
      .catch((error) => {
        Log.error(error);
        history.goBack();
      });
  };

  render() {
    const { history, language, classes } = this.props;
    const {
      material,
      fetchedMaterialOfferData,
      userCanEdit,
      action,
      pendingRequest,
    } = this.state;
    const texts = Texts[language].materialOfferScreen;
    const rowStyle = { minHeight: "5rem" };
    return fetchedMaterialOfferData ? (
      <React.Fragment>
        {pendingRequest && <LoadingSpinner />}
        <div id="activityContainer">
          <div id="activityHeaderContainer" className="row no-gutters">
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
              <h1 className="center">{material.name}</h1>
            </div>
            <div className="col-1-10">
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
            <div className="col-1-10">
              {userCanEdit ? (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleOptions}
                >
                  <i className="fas fa-ellipsis-v" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
          <div id="activityMainContainer">
            <div className="row no-gutters" style={rowStyle}>
              <div className="activityInfoHeader">{texts.infoHeader}</div>
            </div>
            {material.description && (
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-1-10">
                  <i className="far fa-file-alt activityInfoIcon" />
                </div>
                <div className="col-9-10">
                  <div className="activityInfoDescription">
                    {material.description}
                  </div>
                </div>
              </div>
            )}
            {material.location && (
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-1-10">
                  <img
                    src={Images.mapMarkerAltRegular}
                    alt="map marker icon"
                    className="activityInfoImage"
                  />
                </div>
                <div className="col-9-10">
                  <div className="activityInfoDescription">
                    {material.location}
                  </div>
                </div>
              </div>
            )}
            <div className="row no-gutters" style={rowStyle}>
              <div className="col-1-10">
                <i className="far fa-calendar activityInfoIcon" />
              </div>
              <div className="col-9-10">
                <div className="activityInfoDescription">
                  {this.getDatesString()}
                </div>
              </div>
            </div>
            {this.renderParticipants("volunteers")}
            {this.renderParticipants("children")}
          </div>
        </div>
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.add}
          onClick={this.addActivity}
        >
          <i className="fas fa-plus" />
        </Fab>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

export default withSnackbar(
  withStyles(styles)(withLanguage(MaterialOfferInfo))
);

MaterialOfferInfo.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  match: PropTypes.object,
  classes: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

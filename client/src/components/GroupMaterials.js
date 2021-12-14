import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import { TextField } from "@material-ui/core";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";
import Log from "./Log";
import withLanguage from "./LanguageContext";
import GroupMaterialsNavbar from "./GroupMaterialsNavbar";
import DisplayText from "./GroupMaterialNotFound";
import GroupMaterialOffersList from "./GroupMaterialOffersList";
import MaterialRequestListItem from "./MaterialRequestListItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

const styles = {
  add: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
  resize: {
    fontSize: "1.5rem",
  },
};

const getGroup = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {
        name: "",
        group_id: "",
      };
    });
};

const fetchMaterialOffers = (groupId, filter) => {
  const apiPath = `/api/groups/${groupId}/materialOffers`;
  const filteredApiPath = filter ? apiPath + `?filter=${filter}` : apiPath;
  return axios
    .get(filteredApiPath)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

const fetchMaterialRequests = (groupId, filter) => {
  const apiPath = `/api/groups/${groupId}/materialRequests`;
  const filteredApiPath = filter ? apiPath + `?filter=${filter}` : apiPath;
  return axios
    .get(filteredApiPath)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

class GroupMaterials extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    const { groupId } = match.params;

    this.state = {
      groupId,
      showAddOptions: false,
      fetchedData: false,
    };
  }

  async componentDidMount() {
    const { groupId } = this.state;
    const group = await getGroup(groupId);
    const materialOffers = await fetchMaterialOffers(groupId);
    const materialRequests = await fetchMaterialRequests(groupId);
    this.setState({
      group,
      fetchedData: true,
      materialOffers: materialOffers,
      materialRequests: materialRequests,
    });
  }

  handleOffersSearch = async (event) => {
    const { groupId } = this.state;
    const filteredOffers = await fetchMaterialOffers(
      groupId,
      event.target.value
    );
    this.setState({
      materialOffers: filteredOffers,
    });
  };

  handleRequestSearch = async (event) => {
    const { groupId } = this.state;
    const filteredRequests = await fetchMaterialRequests(
      groupId,
      event.target.value
    );
    this.setState({
      materialRequests: filteredRequests,
    });
  };

  add = () => {
    const { history } = this.props;
    const currentPath = history.location.pathname;
    const {
      group: { group_id: groupId },
    } = this.state;
    const parentPath = `/groups/${groupId}`;
    const path =
      currentPath === `${parentPath}/materials/offers`
        ? `${parentPath}/materials/offers/create`
        : `${parentPath}/materials/requests/create`;
    history.push(path);
  };

  render() {
    const { materialOffers, materialRequests, fetchedData, groupId } =
      this.state;
    const { language, history, classes } = this.props;
    const texts = Texts[language].groupMaterials;
    const materialsPath = `/groups/${this.state.groupId}/materials`;
    return fetchedData ? (
      <React.Fragment>
        <GroupMaterialsNavbar />
        <div
          className="row no-gutters"
          style={{
            bottom: "4rem",
            right: "7%",
            zIndex: 100,
            position: "fixed",
          }}
        >
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.add}
            onClick={this.add}
          >
            <i className="fas fa-plus" />
          </Fab>
        </div>
        <div id="groupMaterialsContainer">
          <div className="row no-gutters" id="groupMembersHeaderContainer">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-7-10 ">
              <h1 className="verticalCenter">{texts.header}</h1>
            </div>
          </div>
          <Switch>
            <Route
              path={`${materialsPath}/requests`}
              render={(props) => (
                <div
                  style={{ top: "11rem" }}
                  id="groupMaterialsRequestContainer"
                  className="horizontalCenter"
                >
                  <TextField
                    id="standard-full-width"
                    style={{ margin: 8 }}
                    placeholder={texts.findRequests}
                    fullWidth
                    margin="normal"
                    onChange={this.handleRequestSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon style={{ fontSize: "2.3rem" }} />
                        </InputAdornment>
                      ),
                      classes: {
                        input: classes.resize,
                      },
                    }}
                  />
                  {materialRequests.length === 0 ? (
                    <DisplayText text={texts.noRequests} {...props} />
                  ) : (
                    <div>
                      <ul>
                        {materialRequests.map((material) => (
                          <li key={material.material_request_id}>
                            <MaterialRequestListItem
                              materialRequest={material}
                              groupId={groupId}
                              history={history}
                              language={language}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            />
            <Route
              path={`${materialsPath}/offers`}
              render={(props) => (
                <React.Fragment>
                  <div
                    style={{ top: "11rem" }}
                    id="groupMaterialsOfferContainer"
                    className="horizontalCenter"
                  >
                    <TextField
                      id="standard-full-width"
                      style={{ margin: 8 }}
                      placeholder={texts.findOffers}
                      fullWidth
                      margin="normal"
                      onChange={this.handleOffersSearch}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon style={{ fontSize: "2.3rem" }} />
                          </InputAdornment>
                        ),
                        classes: {
                          input: classes.resize,
                        },
                      }}
                    />
                    {materialOffers.length === 0 ? (
                      <DisplayText text={texts.noOffers} {...props} />
                    ) : (
                      <div>
                        <GroupMaterialOffersList
                          materials={materialOffers}
                          group={groupId}
                        />
                      </div>
                    )}
                  </div>
                </React.Fragment>
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

GroupMaterials.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  classes: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(withLanguage(withStyles(styles)(GroupMaterials)));

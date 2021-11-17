import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";
import Log from "./Log";
import withLanguage from "./LanguageContext";
import MembersOptionsModal from "./OptionsModal";
import GroupMaterialsNavbar from "./GroupMaterialsNavbar";
import GroupMembersList from "./GroupMembersList";
import DisplayText from "./GroupMaterialNotFound";

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
  addPlan: {
    right: "0.5rem",
    height: "4rem",
    width: "4rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
  addActivity: {
    right: "0.5rem",
    height: "4rem",
    width: "4rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
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

const fetchMaterialOffers = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/materialOffers`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

const fetchMaterialRequests = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/materialRequests`)
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
      optionsModalIsOpen: false,
    };
  }

  async componentDidMount() {
    const { groupId } = this.state;
    const group = await getGroup(groupId);
    const materialOffers = await fetchMaterialOffers(groupId);
    const materialRequests = await fetchMaterialRequests(groupId);
    this.setState({
      group,
      confirmDialogIsOpen: false,
      fetchedData: true,
      materialOffers: materialOffers,
      materialRequests: materialRequests,
    });
  }

  handleModalOpen = () => {
    this.setState({ optionsModalIsOpen: true });
  };

  handleModalClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  handleExport = () => {
    const { group } = this.state;
    const { group_id: groupId } = group;
    this.setState({ optionsModalIsOpen: false });
    axios
      .post(`/api/groups/${groupId}/agenda/export`)
      .then((response) => {
        Log.info(response);
      })
      .catch((error) => {
        Log.error(error);
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
    const {
      userIsAdmin,
      materialOffers,
      materialRequests,
      optionsModalIsOpen,
      fetchedData,
    } = this.state;
    const { language, history, classes } = this.props;
    console.log(classes);
    const texts = Texts[language].groupMembers;
    const options = [
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: this.handleExport,
      },
    ];
    const materialsPath = `/groups/${this.state.groupId}/materials`;
    return fetchedData ? (
      <React.Fragment>
        <MembersOptionsModal
          isOpen={optionsModalIsOpen}
          options={options}
          handleClose={this.handleModalClose}
        />
        <GroupMaterialsNavbar />
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
              {/*sposta il testo in texts metti group.name?*/}
              <h1 className="verticalCenter">Offerta e richiesta materiali</h1>
            </div>
            <div className="col-1-10 ">
              {userIsAdmin && (
                <button
                  type="button"
                  className="transparentButton center"
                  onClick={this.handleModalOpen}
                >
                  <i className="fas fa-ellipsis-v" />
                </button>
              )}
            </div>
          </div>
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
              //style={styles.add}
              onClick={() => this.add()}
            >
              <i className="fas fa-plus" />
            </Fab>
          </div>
          <Switch>
            <Route
              path={`${materialsPath}/requests`}
              render={(props) => (
                <React.Fragment>
                  {materialRequests.length === 0 ? (
                    <DisplayText
                      text="Non ci sono richieste da mostrare"
                      {...props}
                    />
                  ) : (
                    <Componente />
                  )}
                </React.Fragment>
              )}
            />
            <Route
              path={`${materialsPath}/offers`}
              render={(props) => (
                <React.Fragment>
                  {materialOffers.length === 0 ? (
                    <DisplayText
                      text="Non ci sono offerte da mostrare"
                      {...props}
                    />
                  ) : (
                    <Componente />
                  )}
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

const Componente = () => {
  return <div>testo</div>;
};

GroupMaterials.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  classes: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(withLanguage(withStyles(styles)(GroupMaterials)));

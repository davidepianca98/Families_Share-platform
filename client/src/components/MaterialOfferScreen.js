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
import BookerDisplay from "./BookerDisplay";

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
    width: "3rem",
    height: "3rem",
    borderRadius: "3.2rem",
  },

  bookButton: {
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
  bookDeleteButton: {
    backgroundColor: "#ff0000",
    bottom: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "3.2rem",
    fontSize: "1.5rem",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ff0000",
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

const getMaterialBookings = (materialOfferId) => {
  return axios
    .get(`/api/materials/offers/${materialOfferId}/bookings`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {};
    });
};

const getUserProfile = (userId) => {
  return axios
    .get(`/api/users/${userId}/profile`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {
        given_name: "",
        family_name: "",
        image: { path: "/images/profiles/user_default_photo.png" },
        address: { street: "", number: "" },
        email: "",
        phone: "",
        phone_type: "",
        visible: false,
        user_id: "",
      };
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
    const { materialId } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const materialOffer = await getMaterialOffer(materialId);
    const materialCreator = await getUserProfile(materialOffer.created_by);
    const materialBookings = await getMaterialBookings(materialId);
    const userIsCreator = userId === materialOffer.created_by;
    const userCanEdit = userIsCreator;
    this.setState({
      materialOffer,
      fetchedMaterialOfferData: true,
      userCanEdit,
      materialCreator,
      materialBookings,
      userId,
    });
  }

  handleEdit = () => {
    const { history } = this.props;
    let { pathname } = history.location;
    pathname = pathname.slice(0, pathname.lastIndexOf("/") + 1) + "edit";
    history.push(pathname);
  };

  handleBook = () => {
    const { history } = this.props;
    let { pathname } = history.location;
    pathname = pathname.slice(0, pathname.lastIndexOf("/") + 1) + "book";
    history.push(pathname);
  };

  handleBookDelete = (id) => {
    let { materialBookings } = this.state;
    materialBookings = materialBookings.filter(
      (elem) => elem.material_booking_id !== id
    );
    axios
      .delete(`/api/materials/bookings/${id}`)
      .then((response) => {
        Log.info(response);
        this.setState({ materialBookings });
      })
      .catch((error) => {
        Log.error(error);
      });
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
      userId,
      materialCreator,
      materialBookings,
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
                      <div
                        className="materialInfoDescription"
                        style={{ fontWeight: "bold" }}
                      >
                        {materialOffer.borrowed ? (
                          <div style={{ color: "red" }}>
                            {texts.notDisponible}
                          </div>
                        ) : (
                          <div style={{ color: "green" }}>
                            {texts.disponible}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {userCanEdit ? (
                    <div></div>
                  ) : (
                    <React.Fragment>
                      <div className="row no-gutters" style={rowStyle}>
                        <div className="materialInfoHeader">
                          {texts.creator}
                        </div>
                      </div>
                      <div className="row no-gutters" style={rowStyle}>
                        <div className="col-1-10">
                          <img
                            className={classes.avatar}
                            src={materialCreator.image.path}
                            alt="avatar"
                          />
                        </div>
                        <div className="col-9-10">
                          <div
                            className="materialInfoDescription"
                            style={{ paddingLeft: "1rem" }}
                          >
                            {materialCreator.given_name}{" "}
                            {materialCreator.family_name}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}

                  {userCanEdit ? (
                    <div />
                  ) : (
                    <div className={classes.actionsContainer}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleBook}
                        className={classes.bookButton}
                        size="large"
                        disabled={materialOffer.borrowed}
                      >
                        {texts.book}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            />
            <Route
              path={`${materialOfferPath}/books`}
              render={() => (
                <div id="materialMainContainer">
                  {userCanEdit ? (
                    <React.Fragment>
                      {Object.keys(materialBookings).length > 0 ? (
                        <React.Fragment>
                          <div className="row no-gutters" style={rowStyle}>
                            <div className="materialInfoDescription">
                              {texts.offerOwnerBookingDisplay}
                            </div>
                          </div>
                          {materialBookings.map((book) => {
                            return (
                              <div key={book._id}>
                                <BookerDisplay bookerId={book.user} />
                                <div
                                  className="row no-gutters"
                                  style={rowStyle}
                                >
                                  <div className="col-1-10">
                                    <i
                                      className="far fa-calendar-alt materialInfoIcon"
                                      style={{ fontSize: "2.5rem" }}
                                    />
                                  </div>
                                  <div className="col-9-10">
                                    <div className="row no-gutters materialInfoDescription">
                                      {texts.from}{" "}
                                      {moment(book.start).format("L")}
                                    </div>
                                    <div className="row no-gutters materialInfoDescription">
                                      {texts.to} {moment(book.end).format("L")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ) : (
                        <div className="row no-gutters" style={rowStyle}>
                          <div className="materialInfoDescription">
                            {texts.offerOwnerBookingNotDisplay}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    <div className="row no-gutters" style={rowStyle}>
                      {Object.keys(materialBookings).length > 0 ? (
                        <div
                          style={{ marginTop: "1.5rem" }}
                          className="materialInfoDescription"
                        >
                          {texts.bookerDisplay}
                          {materialBookings.map((booking) => {
                            if (userId === booking.user) {
                              return (
                                <div key={booking._id}>
                                  <div
                                    className="row no-gutters"
                                    style={rowStyle}
                                  >
                                    <div className="col-1-10">
                                      <i
                                        className="far fa-calendar-alt materialInfoIcon"
                                        style={{ fontSize: "2.5rem" }}
                                      />
                                    </div>
                                    <div className="col-9-10">
                                      <div className="row no-gutters materialInfoDescription">
                                        {texts.from}{" "}
                                        {moment(booking.start).format("L")}
                                      </div>
                                      <div className="row no-gutters materialInfoDescription">
                                        {texts.to}{" "}
                                        {moment(booking.end).format("L")}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row no-gutters justify-content-center">
                                    <div className={classes.actionsContainer}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          this.handleBookDelete(
                                            booking.material_booking_id
                                          )
                                        }
                                        className={classes.bookDeleteButton}
                                        size="large"
                                      >
                                        {texts.delete}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return <div></div>;
                          })}
                        </div>
                      ) : (
                        <div className="row no-gutters" style={rowStyle}>
                          <div className="materialInfoDescription">
                            {texts.bookerNotDisplay}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

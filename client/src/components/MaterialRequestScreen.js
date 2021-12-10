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
import Button from "@material-ui/core/Button";


const styles = {
    avatar: {
        width: "3rem!important",
        height: "3rem!important",
    },
    createButton: {
        backgroundColor: "#ff6f00",
        position: "fixed",
        bottom: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "3.2rem",
        fontSize: "1.5rem",
        "&:hover": {
            backgroundColor: "#ff6f00"
        }
    }
};

const getMaterialRequest = (materialRequestId) => {
    return axios
        .get(`/api/materials/requests/${materialRequestId}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            Log.error(error);
            return {
                material_name: "",
                description: "",
                color: "#ffffff",
                group_name: "",
                location: ""
            };
        });
};


const getMyProfile = (userId) => {
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

class MaterialRequestScreen extends React.Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        const { groupId, materialId } = match.params;
        this.state = {
            fetchedMaterialRequestData: false,
            pendingRequest: false,
            materialRequest: {},
            userCanEdit: false,
            userCreator: {},
            groupId,
            materialId
        };
    }

    async componentDidMount() {
        const { groupId, materialId } = this.state;
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const materialRequest = await getMaterialRequest(materialId, groupId);
        const userCreator = await getMyProfile(userId);
        const userIsCreator = userId === materialRequest.created_by;
        const userCanEdit = userIsCreator;
        this.setState({ materialRequest, fetchedMaterialRequestData: true, userCanEdit, userCreator});
    };

    handleEdit = () => {
        const { history } = this.props;
        let { pathname } = history.location;
        pathname = `${pathname}/edit`;
        history.push(pathname);
    };

    handleOffer = () => {
        //TODO metodo per gestire l'offerta del materiale da parte di un utente
    };

    getDatesString = (date) => {
        return moment(date).format("ll");
    };


    render() {
        const { history, language, classes } = this.props;
        const {
            materialRequest,
            fetchedMaterialRequestData,
            userCanEdit,
            pendingRequest,
            userCreator
        } = this.state;
        const texts = Texts[language].activityScreen;
        const name = userCreator.given_name + " " + userCreator.family_name;
        const rowStyle = { minHeight: "5rem" };
        return fetchedMaterialRequestData ? (
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
                        <div className="col-8-10">
                            <h1 className="center">{materialRequest.material_name}</h1>
                        </div>
                    </div>
                    <div id="activityMainContainer">
                        <div className="row no-gutters" style={rowStyle}>
                            <div className="activityInfoHeader">{texts.infoHeader}</div>
                        </div>
                        {materialRequest.description && (
                            <div className="row no-gutters" style={rowStyle}>
                                <div className="col-1-10">
                                    <i className="far fa-file-alt activityInfoIcon" />
                                </div>
                                <div className="col-9-10">
                                    <div className="activityInfoDescription">
                                        {materialRequest.description}
                                    </div>
                                </div>
                            </div>
                        )}
                        {materialRequest.location && (
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
                                        {materialRequest.location}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="row no-gutters" style={rowStyle}>
                            <div className="activityInfoHeader">{"Data Creazione" /*TODO text.blablabla*/}</div>
                        </div>
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
                        {!userCanEdit && (
                        <div>
                            <div className="row no-gutters" style={rowStyle}>
                                <div className="activityInfoHeader">Utente {/*TODO text.blablabla*/}</div>
                            </div>
                            <div className="row no-gutters" style={rowStyle}>
                                <div className="col-1-10">
                                    <i className="far fa-user-circle activityInfoIcon" />
                                </div>
                                <div className="col-9-10">
                                    <div className="activityInfoDescription">
                                        {name}
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={userCanEdit ? this.handleEdit : this.handleOffer}
                    className={classes.createButton}
                >
                    {userCanEdit ? "MODIFICA" : "OFFRI"}
                </Button>
            </React.Fragment>
        ) : (
            <LoadingSpinner />
        );
    }
}

export default withSnackbar(withStyles(styles)(withLanguage(MaterialRequestScreen)));

MaterialRequestScreen.propTypes = {
    history: PropTypes.object,
    language: PropTypes.string,
    match: PropTypes.object,
    classes: PropTypes.object,
    enqueueSnackbar: PropTypes.func,
};
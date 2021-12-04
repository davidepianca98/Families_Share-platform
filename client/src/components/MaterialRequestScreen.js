import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import ConfirmDialog from "./ConfirmDialog";
import OptionsModal from "./OptionsModal";
import LoadingSpinner from "./LoadingSpinner";
import Images from "../Constants/Images";
import Log from "./Log";
import moment from "moment";
import Button from "@material-ui/core/Button";


const styles = {
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
    createButton: {
        backgroundColor: "#ff6f00",
        position: "fixed",
        bottom: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "3.2rem",
        fontSize: "1.5rem",
        /*marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,*/
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

/*const getGroupMembers = (groupId) => {
    return axios
        .get(`/api/groups/${groupId}/members`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            Log.error(error);
            return [];
        });
};*/

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
            confirmDialogIsOpen: false,
            userCanEdit: false,
            optionsModalIsOpen: false,
            action: "",
            userCreator: {},
            groupId,
            materialId
        };
    }

    async componentDidMount() {
        const { groupId, materialId } = this.state;
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const materialRequest = await getMaterialRequest(materialId, groupId);
        /*const groupMembers = await getGroupMembers(groupId);*/
        const userCreator = await getMyProfile(userId);
        /*const userIsAdmin = groupMembers.filter(
            (member) =>
                member.user_id === userId &&
                member.group_accepted &&
                member.user_accepted
        )[0].admin;*/
        const userIsCreator = userId === materialRequest.created_by;
        const userCanEdit = /*userIsAdmin ||*/ userIsCreator;
        this.setState({ materialRequest, fetchedMaterialRequestData: true, userCanEdit, userCreator});
    };

    handleEdit = () => {
        const { history } = this.props;
        let { pathname } = history.location;
        pathname = `${pathname}/edit`;
        history.push(pathname);
    };

    handleConfirmDialogOpen = (action) => {
        this.setState({
            confirmDialogIsOpen: true,
            optionsModalIsOpen: false,
            action,
        });
    };

    handleConfirmDialogClose = (choice) => {
        const { action } = this.state;
        if (choice === "agree") {
            switch (action) {
                case "delete":
                    this.handleDelete();
                    break;
                case "exportPdf":
                    this.handleExport("pdf");
                    break;
                case "exportExcel":
                    this.handleExport("excel");
                    break;
                default:
            }
        }
        this.setState({ confirmDialogIsOpen: false });
    };

    handleOptions = () => {
        const { optionsModalIsOpen } = this.state;
        this.setState({ optionsModalIsOpen: !optionsModalIsOpen });
    };

    handleOptionsClose = () => {
        this.setState({ optionsModalIsOpen: false });
    };

    handleDelete = () => {
        const { match, history } = this.props;
        const { groupId, materialId } = match.params;
        this.setState({ pendingRequest: true });
        axios
            .delete(`/api/groups/${groupId}/activities/${materialId}`)//todo
            .then((response) => {
                Log.info(response);
                history.goBack();
            })
            .catch((error) => {
                Log.error(error);
                history.goBack();
            });
    };

    handleOffer = () => {

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
            action,
            confirmDialogIsOpen,
            optionsModalIsOpen,
            pendingRequest,
            userCreator
        } = this.state;
        const texts = Texts[language].activityScreen;
        const name = userCreator.given_name + " " + userCreator.family_name;
        const options = [
            {
                label: texts.delete,
                style: "optionsModalButton",
                handle: () => {
                    this.handleConfirmDialogOpen("delete");
                },
            }/*,
            {
                label: texts.exportPdf,
                style: "optionsModalButton",
                handle: () => {
                    this.handleConfirmDialogOpen("exportPdf");
                },
            },
            {
                label: texts.exportExcel,
                style: "optionsModalButton",
                handle: () => {
                    this.handleConfirmDialogOpen("exportExcel");
                },
            },*/
        ];
        const confirmDialogTitle =
            action === "delete" ? texts.deleteDialogTitle : texts.exportDialogTitle;
        const rowStyle = { minHeight: "5rem" };
        return fetchedMaterialRequestData ? (
            <React.Fragment>
                {pendingRequest && <LoadingSpinner />}
                <div id="activityContainer">
                    <ConfirmDialog
                        title={confirmDialogTitle}
                        isOpen={confirmDialogIsOpen}
                        handleClose={this.handleConfirmDialogClose}
                    />
                    <OptionsModal
                        isOpen={optionsModalIsOpen}
                        handleClose={this.handleOptionsClose}
                        options={options}
                    />
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
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
                /*description: "",
                color: "#ffffff",
                group_name: "",
                location: "",*/
            };
        });
};

class MaterialRequestScreen extends React.Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        console.log("material request:" + Object.keys(match.params));
        const { groupId, materialId } = match.params;
        this.state = {
            fetchedMaterialRequestData: false,
            pendingRequest: false,
            materialRequest: {},
            confirmDialogIsOpen: false,
            userCanEdit: false,
            optionsModalIsOpen: false,
            action: "",
            groupId,
            materialId
        };
    }

    async componentDidMount() {
        const { groupId, materialId } = this.state;
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const materialRequest = await getMaterialRequest(materialId, groupId);
        console.log("---------" + Object.keys(materialRequest));
        const temp = [];
        /*const groupMembers = await getGroupMembers(groupId);
        const userIsAdmin = groupMembers.filter(
            (member) =>
                member.user_id === userId &&
                member.group_accepted &&
                member.user_accepted
        )[0].admin;*/
        const userIsCreator = userId === materialRequest.creator_id;
        const userCanEdit = /*userIsAdmin ||*/ userIsCreator;
        this.setState({ materialRequest, fetchedMaterialRequestData: true, userCanEdit });
    }

    handleRedirect = (suspended, child_id) => {
        const { history } = this.props;
        if (!suspended) {
            history.push(`/profiles/groupmember/children/${child_id}`);
        }
    };

    renderList = (list, type) => {
        const { classes } = this.props;
        return list.map((profile, index) => (
            <li key={index} style={{ display: "block" }}>
                <div className="row" style={{ margin: "1rem 0" }}>
                    <Avatar
                        route={
                            type === "parents"
                                ? `/profiles/groupmember/children/${profile.child_id}`
                                : `/profiles/${profile.user_id}/info`
                        }
                        className={classes.avatar}
                        thumbnail={path(profile, ["image", "path"])}
                        disabled={profile.suspended}
                    />
                    <div
                        role="button"
                        tabIndex={-42}
                        className="participantsText"
                        onClick={() =>
                            this.handleRedirect(profile.suspended, profile.child_id)
                        }
                    >
                        {`${profile.given_name} ${profile.family_name}`}
                    </div>
                </div>
            </li>
        ));
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
            .delete(`/api/groups/${groupId}/activities/${materialId}`)
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
        console.log(classes);
        const {
            materialRequest,
            fetchedMaterialRequestData,
            userCanEdit,
            action,
            confirmDialogIsOpen,
            optionsModalIsOpen,
            pendingRequest,
        } = this.state;
        const texts = Texts[language].activityScreen;
        const options = [
            {
                label: texts.delete,
                style: "optionsModalButton",
                handle: () => {
                    this.handleConfirmDialogOpen("delete");
                },
            },
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
            },
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
                        <div className="col-6-10">
                            <h1 className="center">{materialRequest.material_name}</h1>
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
                            <div className="col-1-10">
                                <i className="far fa-calendar activityInfoIcon" />
                            </div>
                            <div className="col-9-10">
                                <div className="activityInfoDescription">
                                    {/*this.getDatesString()*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<TimeslotsList dates={materialRequest.dates} timeslots={materialRequest.timeslots} />*/}
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
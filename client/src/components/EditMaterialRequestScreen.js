import React from "react";
import autosize from "autosize";
import axios from "axios";
import { CirclePicker } from "react-color";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import LoadingSpinner from "./LoadingSpinner";
import withLanguage from "./LanguageContext";
import Log from "./Log";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";

const styles = {
    modifyButton: {
        backgroundColor: "#ff6f00",
        position: "fixed",
        bottom: "5%",
        transform: "translateX(-50%)",
        borderRadius: "3.2rem",
        fontSize: "1.5rem",
        "&:hover": {
            backgroundColor: "#ff6f00"
        }
    },
    deleteButton: {
        backgroundColor: "#ff0000",
        position: "fixed",
        bottom: "5%",
        left: "60%",
        transform: "translateX(-50%)",
        borderRadius: "3.2rem",
        fontSize: "1.5rem",
        "&:hover": {
            backgroundColor: "#ff0000"
        }
    }
};

class EditMaterialRequestScreen extends React.Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        const { groupId, materialId } = match.params;
        this.state = {
            fetchedMaterial: false,
            groupId,
            materialId
        };
    }

    componentDidMount() {
        const { materialId} = this.state;
        axios
            .get(`/api/materials/requests/${materialId}`)
            .then(response => {
                const { material_name, description, color, location } = response.data;
                this.setState({
                    fetchedMaterial: true,
                    material_name,
                    color,
                    description,
                    location,
                    validated: true
                });
            })
            .catch(error => {
                Log.error(error);
                this.setState({
                    fetchedMaterial: true,
                    material_name: "",
                    color: "",
                    description: "",
                    validated: false
                });
            });
    }

    handleChange = event => {
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

    handleColorChange = color => {
        const state = Object.assign({}, this.state);
        state.color = color.hex;
        this.setState(state);
    };

    handleSave = () => {
        const { match, history } = this.props;
        const { materialId} = match.params;
        const { validated, material_name, color, location, description } = this.state;
        if (validated) {
            this.setState({ fetchedMaterial: false });
            const patch = {
                material_name,
                color,
                location: location.trim(),
                description: description.trim()
            };
            axios
                .put(`/api/materials/requests/${materialId}`, patch)
                .then(response => {
                    Log.info(response);
                    history.goBack();
                })
                .catch(error => {
                    Log.error(error);
                    history.goBack();
                });
        }
    };

    render() {
        const {
            fetchedMaterial,
            validated,
            material_name,
            description,
            location,
            color
        } = this.state;
        const { language, history, classes} = this.props;
        console.log(this.props);
        const texts = Texts[language].editActivityScreen;
        return fetchedMaterial ? (
            <React.Fragment>
                <div className="row no-gutters" id="editActivityHeaderContainer">
                    <div className="col-2-10">
                        <button
                            className="transparentButton center"
                            type="button"
                            onClick={() => history.goBack()}
                        >
                            <i className="fas fa-arrow-left" />
                        </button>
                    </div>
                    <div className="col-6-10">
                        <h1 className="verticalCenter">{texts.backNavTitle}</h1>
                    </div>
                    <div className="col-2-10">
                        <button
                            type="button"
                            className="transparentButton center"
                            style={validated ? {} : { opacity: 0.5 }}
                            onClick={this.handleSave}
                        >
                            <i className="fas fa-check" />
                        </button>
                    </div>
                </div>
                <div id="editActivityMainContainer">
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
                              onClick={() =>{
                                  autosize(document.querySelectorAll("textarea"));
                              }}
                              onChange={event => {
                                  this.handleChange(event);
                                  autosize(document.querySelectorAll("textarea"));
                              }}
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
                </div>
                {/*<Button
                    variant="contained"
                    color="primary"
                    className={classes.modifyButton}
                >
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.deleteButton}
                >
                </Button>*/}
            </React.Fragment>
        ) : (
            <LoadingSpinner />
        );
    }
}

export default withStyles(styles)(withLanguage(EditMaterialRequestScreen));

EditMaterialRequestScreen.propTypes = {
    history: PropTypes.object,
    language: PropTypes.string,
    match: PropTypes.object,
    classes: PropTypes.object
};

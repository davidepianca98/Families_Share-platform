import React from "react";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import SeniorListItem from "./SeniorListItem";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

const styles = () => ({
  add: {
    position: "fixed",
    bottom: "5%",
    right: "5%",
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem"
  }
});

class ProfileSeniors extends React.Component {
  constructor(props) {
    super(props);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { profileId, usersSeniors } = this.props;
    const myProfile = userId === profileId;
    this.state = {
      myProfile,
      seniors: usersSeniors,
      profileId
    };
  }

  addSenior = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/create`);
  };

  render() {
    const { classes, language } = this.props;
    const { seniors, profileId, myProfile } = this.state;
    const texts = Texts[language].profileSeniors;
    return (
      <React.Fragment>
        {seniors.length > 0 ? (
          <ul>
            {seniors.map((senior, index) => (
              <li key={index}>
                <SeniorListItem seniorId={senior.senior_id} userId={profileId} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="addSeniorPrompt">{texts.addSeniorPrompt}</div>
        )}
        {myProfile && (
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.add}
            onClick={this.addSenior}
          >
            <i className="fas fa-blind" />
          </Fab>
        )}
      </React.Fragment>
    );
  }
}

ProfileSeniors.propTypes = {
  usersSeniors: PropTypes.array,
  profileId: PropTypes.string,
  history: PropTypes.object,
  classes: PropTypes.object,
  language: PropTypes.string
};

export default withStyles(styles)(withLanguage(ProfileSeniors));

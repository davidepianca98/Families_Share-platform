import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import InviteDialog from "./InviteDialog";
import Images from "../Constants/Images";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";

class SeniorProfileInfo extends React.Component {
  state = { modalIsOpen: false, confirmDialogIsOpen: false, deleteIndex: "" };

  handleConfirmDialogOpen = index => {
    this.setState({ confirmDialogIsOpen: true, deleteIndex: index });
  };

  handleConfirmDialogClose = choice => {
    this.setState({ confirmDialogIsOpen: false, deleteIndex: "" });
  };

  handleClose = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const {
      language,
      specialNeeds,
      otherInfo,
      allergies,
      gender,
      birthdate,
      showAdditional
    } = this.props;
    const { confirmDialogIsOpen, modalIsOpen } = this.state;
    const texts = Texts[language].seniorProfileInfo;
    return (
      <React.Fragment>
        <ConfirmDialog
          isOpen={confirmDialogIsOpen}
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
        />
        <InviteDialog
          isOpen={modalIsOpen}
          handleClose={this.handleClose}
          handleInvite={this.handleAdd}
          inviteType="parent"
        />
        <div className="seniorProfileInfoSection">
          <div className="row no-gutters">
            <div className="col-2-10">
              <i className="fas fa-birthday-cake" />
            </div>
            <div className="col-8-10">
              <div>
                <h1>{moment(birthdate).format("MMMM Do YYYY")}</h1>
                <h2>{`${moment().diff(birthdate, "years")} ${texts.age}`}</h2>
              </div>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <img src={Images.gender} alt="birthday icon" />
            </div>
            <div className="col-8-10">
              <h1>{texts[gender]}</h1>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="col-2-10">
              <img src={Images.couple} alt="birthday icon" />
            </div>
          </div>
        </div>
        {showAdditional && (
          <div className="seniorAdditionalInfoSection">
            <h3>{texts.additional}</h3>
            {allergies && (
              <div className="row no-gutters">
                <div className="col-3-10">
                  <h4>{`${texts.allergies}:`}</h4>
                </div>
                <div className="col-7-10">
                  <p>{allergies}</p>
                </div>
              </div>
            )}
            {specialNeeds && (
              <div className="row no-gutters">
                <div className="col-3-10">
                  <h4>{`${texts.specialNeeds}:`}</h4>
                </div>
                <div className="col-7-10">
                  <p>{specialNeeds}</p>
                </div>
              </div>
            )}
            {otherInfo && (
              <div className="row no-gutters">
                <div className="col-3-10">
                  <h4>{`${texts.otherInfo}:`}</h4>
                </div>
                <div className="col-7-10">
                  <p>{otherInfo}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

SeniorProfileInfo.propTypes = {
  history: PropTypes.object,
  birthdate: PropTypes.string,
  gender: PropTypes.string,
  specialNeeds: PropTypes.string,
  otherInfo: PropTypes.string,
  allergies: PropTypes.string,
  showAdditional: PropTypes.bool,
  language: PropTypes.string,
  match: PropTypes.object
};

export default withRouter(withLanguage(SeniorProfileInfo));

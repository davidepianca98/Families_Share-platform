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
    const { deleteIndex } = this.state;
    if (choice === "agree") {
      this.deleteParent(deleteIndex);
    }
    this.setState({ confirmDialogIsOpen: false, deleteIndex: "" });
  };

  handleClose = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    const {
      match,
      language,
      specialNeeds,
      otherInfo,
      allergies,
      gender,
      birthdate,
      showAdditional,
      parents
    } = this.props;
    const { profileId } = match.params;
    const { confirmDialogIsOpen, modalIsOpen } = this.state;
    const isParent = JSON.parse(localStorage.getItem("user")).id === profileId;
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
            <div className="col-3-10">
              {parents[0] ? (
                <div>
                  <h1 onClick={() => this.handleRedirectToParent(parents[0])}>
                    {`${parents[0].given_name} ${parents[0].family_name}`}
                  </h1>
                </div>
              ) : (
                isParent && (
                  <button
                    type="button"
                    className="addParent"
                    onClick={this.addParent}
                  >
                    {texts.addParent}
                  </button>
                )
              )}
            </div>
            <div className="col-1-10">
              {parents[0] && isParent && parents.length > 1 && (
                <button
                  type="button"
                  className="deleteParent"
                  onClick={() => this.handleConfirmDialogOpen(0)}
                >
                  <i className="fas fa-times" />
                </button>
              )}
            </div>
            <div className="col-3-10">
              {parents[1] ? (
                <div>
                  <h1 onClick={() => this.handleRedirectToParent(parents[1])}>
                    {`${parents[1].given_name} ${parents[1].family_name}`}
                  </h1>
                </div>
              ) : (
                isParent && (
                  <button
                    type="button"
                    className="addParent"
                    onClick={this.addParent}
                  >
                    {texts.addParent}
                  </button>
                )
              )}
            </div>
            <div className="col-1-10">
              {parents[1] && isParent && parents.length > 1 ? (
                <button
                  type="button"
                  className="deleteParent"
                  onClick={() => this.handleConfirmDialogOpen(1)}
                >
                  <i className="fas fa-times" />
                </button>
              ) : null}
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
  parents: PropTypes.array,
  birthdate: PropTypes.string,
  gender: PropTypes.string,
  specialNeeds: PropTypes.string,
  otherInfo: PropTypes.string,
  allergies: PropTypes.string,
  showAdditional: PropTypes.bool,
  language: PropTypes.string,
  match: PropTypes.object,
  handleAddParent: PropTypes.func,
  handleDeleteParent: PropTypes.func
};

export default withRouter(withLanguage(SeniorProfileInfo));

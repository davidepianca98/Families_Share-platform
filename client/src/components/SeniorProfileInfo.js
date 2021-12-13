import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import SeniorWeekDialog from "./SeniorWeekDialog";
import SeniorTimeDialog from "./SeniorTimeDialog";
import Images from "../Constants/Images";
import Texts from "../Constants/Texts";
import ConfirmDialog from "./ConfirmDialog";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from "@material-ui/core";

let getDayName = (index, language) => {
  const days = Texts[language].availabilityWeekModal;
  switch (index) {
    case 0:      return days.monday;
    case 1:      return days.tuesday;
    case 2:      return days.wednesday;
    case 3:      return days.thursday;
    case 4:      return days.friday;
    case 5:      return days.saturday;
    case 6:      return days.sunday;
    default:      return "";
  }
};

class SeniorProfileInfo extends React.Component {
  state = {
    weekModalIsOpen: false,
    time0ModalIsOpen: false,
    time1ModalIsOpen: false,
    time2ModalIsOpen: false,
    time3ModalIsOpen: false,
    time4ModalIsOpen: false,
    time5ModalIsOpen: false,
    time6ModalIsOpen: false,
    confirmDialogIsOpen: false,
    deleteIndex: "",
  };

  handleConfirmDialogOpen = (index) => {
    this.setState({ confirmDialogIsOpen: true, deleteIndex: index });
  };

  handleConfirmDialogClose = (choice) => {
    this.setState({ confirmDialogIsOpen: false, deleteIndex: "" });
  };

  handleOpenWeek = () => {
    this.setState({ weekModalIsOpen: true });
  };

  handleCloseWeek = () => {
    this.setState({ weekModalIsOpen: false });
  };

  handleOpenTime = (day) => {
    switch (day) {
      case 0: this.setState({ day: day, time0ModalIsOpen: true }); break;
      case 1: this.setState({ day: day, time1ModalIsOpen: true }); break;
      case 2: this.setState({ day: day, time2ModalIsOpen: true }); break;
      case 3: this.setState({ day: day, time3ModalIsOpen: true }); break;
      case 4: this.setState({ day: day, time4ModalIsOpen: true }); break;
      case 5: this.setState({ day: day, time5ModalIsOpen: true }); break;
      case 6: this.setState({ day: day, time6ModalIsOpen: true }); break;
    }
  };

  handleCloseTime = () => {
    this.setState({
      time0ModalIsOpen: false,
      time1ModalIsOpen: false,
      time2ModalIsOpen: false,
      time3ModalIsOpen: false,
      time4ModalIsOpen: false,
      time5ModalIsOpen: false,
      time6ModalIsOpen: false,
     });
  };

  render() {
    let { senior, language, otherInfo, gender, birthdate, showAdditional } =
      this.props;

    const {
       confirmDialogIsOpen,
       weekModalIsOpen,
       time0ModalIsOpen,
       time1ModalIsOpen,
       time2ModalIsOpen,
       time3ModalIsOpen,
       time4ModalIsOpen,
       time5ModalIsOpen,
       time6ModalIsOpen,
      } = this.state;
    const texts = Texts[language].seniorProfileInfo;
    return (
      <React.Fragment>
        <ConfirmDialog
          isOpen={confirmDialogIsOpen}
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
        />
        <SeniorWeekDialog
          isOpen={weekModalIsOpen}
          handleCloseWeek={this.handleCloseWeek}
          handleOpenTime={this.handleOpenTime}
          senior={senior}
        />
        <SeniorTimeDialog
          isOpen={time0ModalIsOpen}
          handleCloseTime={this.handleCloseTime}
          senior={senior}
          day={0}
        />
        <SeniorTimeDialog
          isOpen={time1ModalIsOpen}
          handleCloseTime={this.handleCloseTime}
          senior={senior}
          day={1}
        />
        <SeniorTimeDialog
          isOpen={time2ModalIsOpen}
          handleCloseTime={this.handleCloseTime}
          senior={senior}
          day={2}
        />
        <SeniorTimeDialog
          isOpen={time3ModalIsOpen}
          handleCloseTime={this.handleCloseTime}
          senior={senior}
          day={3}
        />
        <SeniorTimeDialog
          isOpen={time4ModalIsOpen}
          handleCloseTime={this.handleCloseTime}
          senior={senior}
          day={4}
        />
        <SeniorTimeDialog
          isOpen={time5ModalIsOpen}
          handleCloseTime={this.handleCloseTime}
          senior={senior}
          day={5}
        />
        <SeniorTimeDialog
          isOpen={time6ModalIsOpen}
          handleCloseTime={this.handleCloseTime}
          senior={senior}
          day={6}
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
            <div className="col-3-10">
              <button
                type="button"
                className="setAvailabilities"
                onClick={this.handleOpenWeek}
              >
                {texts.setAvailabilities}
              </button>
            </div>
          </div>
        </div>
        {showAdditional && (
          <div className="seniorAdditionalInfoSection">
            <h3>{texts.additional}</h3>
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

        <div className="row" style={{ marginLeft: "10%", marginRight: "10%" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Giorno</TableCell>
                  <TableCell align="center">Orario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {senior?.availabilities?.map((row) => (
                  <TableRow
                    key={row.weekDay}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {getDayName(row.weekDay, language)}
                    </TableCell>
                    <TableCell align="center">
                      dalle {row.startTimeHour} : {row.startTimeMinute}
                      <br />
                      alle {row.endTimeHour} : {row.endTimeMinute}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </React.Fragment>
    );
  }
}

SeniorProfileInfo.propTypes = {
  availabilities: PropTypes.array,
  birthdate: PropTypes.instanceOf(Date),
  gender: PropTypes.string,
  senior: PropTypes.object,
  otherInfo: PropTypes.string,
  showAdditional: PropTypes.bool,
  language: PropTypes.string
};

export default withRouter(withLanguage(SeniorProfileInfo));

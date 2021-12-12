import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import SeniorWeekDialog from "./SeniorWeekDialog";
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

let toDayName = (index, language) => {
  const days = Texts[language].availabilityWeekModal;
  switch (index) {
    case 0:
      return days.monday;
    case 1:
      return days.tuesday;
    case 2:
      return days.wednesday;
    case 3:
      return days.thursday;
    case 4:
      return days.friday;
    case 5:
      return days.saturday;
    case 6:
      return days.sunday;
    default:
      return "";
  }
};

class SeniorProfileInfo extends React.Component {
  state = {
    weekModalIsOpen: false,
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

  render() {
    const { senior, language, otherInfo, gender, birthdate, showAdditional } =
      this.props;

    // FIXME: fix temporaneo - il problema è che i metodi funzionali non vanno su oggetti vuoti
    const availabilities = senior.availabilities
      ? senior.availabilities
      : [
          {
            weekDay: 0,
            startTimeHour: 10,
            startTimeMinute: 10,
            endTimeHour: 12,
            endTimeMinute: 50,
          },
        ];

    const { confirmDialogIsOpen, weekModalIsOpen } = this.state;
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
          availabilities={availabilities}
          senior={senior}
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
                {availabilities.map((row) => (
                  <TableRow
                    key={row.weekDay}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {toDayName(row.weekDay, language)}
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
  history: PropTypes.object,
  availabilities: PropTypes.array,
  birthdate: PropTypes.instanceOf(Date),
  gender: PropTypes.string,
  otherInfo: PropTypes.string,
  showAdditional: PropTypes.bool,
  language: PropTypes.string,
  match: PropTypes.object,
};

export default withRouter(withLanguage(SeniorProfileInfo));

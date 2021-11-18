import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import withLanguage from "./LanguageContext";
import MaterialTimeslotsContainer from "./MaterialTimeslotsContainer";
import Texts from "../Constants/Texts";

class CreateMaterialOfferTimeslots extends React.Component {
  constructor(props) {
    super(props);
    const { materialTimeslots, dates, differentTimeslots } = this.props;
    for (let i = 0; i < dates.length; i += 1) {
      if (materialTimeslots[i] === undefined) materialTimeslots.push([]);
    }
    this.state = {
      dates,
      numberOfDays: dates.length,
      differentTimeslots,
      materialTimeslots
    };
  }

  renderDays = () => {
    const {
      dates,
      numberOfDays,
      differentTimeslots,
      materialTimeslots
    } = this.state;
    const {
      materialName,
      materialLocation,
      language,
    } = this.props;
    const texts = Texts[language].createActivityTimeslots;
    let header = "";
    if (numberOfDays > 1) {
      if (differentTimeslots) {
        return (
          <ul>
            {dates.map((date, index) => {
              header = moment(date).format("D MMMM YYYY");
              return (
                <li key={index}>
                  <MaterialTimeslotsContainer
                    activityName={materialName}
                    timeslots={materialTimeslots[index]}
                    activityLocation={materialLocation}
                    dateIndex={index}
                    header={header}
                    handleTimeslots={this.handleTimeslots}
                  />
                </li>
              );
            })}
          </ul>
        );
      }
      header = `${dates.length} ${texts.selected}`;
      return (
        <MaterialTimeslotsContainer
          activityName={materialName}
          timeslots={materialTimeslots[0]}
          activityLocation={materialLocation}
          dateIndex={0}
          header={header}
          handleTimeslots={this.handleTimeslots}
        />
      );
    }
    header = moment(dates[0]).format("D MMMM YYYY");
    return (
      <MaterialTimeslotsContainer
        activityName={materialName}
        activityLocation={materialLocation}
        timeslots={materialTimeslots[0]}
        dateIndex={0}
        header={header}
        handleTimeslots={this.handleTimeslots}
      />
    );
  };

  handleTimeslots = (timeslots, dateIndex) => {
    const { numberOfDays, differentTimeslots, materialTimeslots } = this.state;
    const { handleSubmit } = this.props;
    if (numberOfDays > 1 && !differentTimeslots) {
      for (let i = 0; i < numberOfDays; i += 1) {
        materialTimeslots[i] = timeslots.slice(0);
      }
    } else {
      materialTimeslots[dateIndex] = timeslots.slice(0);
    }
    this.setState({ materialTimeslots });
    let validated = true;
    for (let i = 0; i < numberOfDays; i += 1) {
      if (materialTimeslots[i].length === 0) validated = false;
    }
    handleSubmit(
      {
        materialTimeslots,
        differentTimeslots
      },
      validated
    );
  };

  handleDifferentTimeslots = () => {
    const { differentTimeslots } = this.state;
    this.setState({ differentTimeslots: !differentTimeslots });
  };

  renderDifferentTimeslots = () => {
    const { language } = this.props;
    const { numberOfDays, differentTimeslots } = this.state;
    const texts = Texts[language].createActivityTimeslots;
    if (numberOfDays > 1) {
      if (differentTimeslots) {
        return (
          <div id="differentTimeslotsContainer" className="row no-gutters">
            <button
              type="button"
              className="horizontalCenter"
              onClick={this.handleDifferentTimeslots}
            >
              {texts.sameTimeslots}
            </button>
          </div>
        );
      }
      return (
        <div id="differentTimeslotsContainer" className="row no-gutters">
          <button
            type="button"
            className="horizontalCenter"
            onClick={this.handleDifferentTimeslots}
          >
            {texts.differentTimeslots}
          </button>
        </div>
      );
    }
    return null;
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].createActivityTimeslots;
    return (
      <div id="createActivityTimeslotsContainer">
        <div id="createActivityTimeslotsHeader" className="row no-gutters">
          <h1>{texts.header}</h1>
        </div>
        {this.renderDays()}
        {this.renderDifferentTimeslots()}
      </div>
    );
  }
}

export default withLanguage(CreateMaterialOfferTimeslots);

CreateMaterialOfferTimeslots.propTypes = {
  materialName: PropTypes.string,
  materialLocation: PropTypes.string,
  dates: PropTypes.array,
  handleSubmit: PropTypes.func,
  materialTimeslots: PropTypes.array,
  differentTimeslots: PropTypes.bool,
  language: PropTypes.string,
};

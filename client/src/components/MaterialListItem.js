import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class MaterialListItem extends React.Component {
  constructor(props) {
    super(props);
    const { material } = this.props;
    this.state = { material };
  }

  async componentDidMount() {
    const { material } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { groupId } = this.props;
    const materialId = material.material_Id;
    dates = dates.sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    const uniqueDates = [];
    const temp = [];
    dates.forEach(date => {
      const t = moment(date).format("DD-MM-YYYY");
      if (!temp.includes(t)) {
        temp.push(t);
        uniqueDates.push(date);
      }
    });
    activity.subscribed = false;
    this.setState({ fetchedTimeslots: true, material });
  }

  handleMaterialClick = event => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/${event.currentTarget.id}`);
  };

  getDatesString = () => {
    const { language } = this.props;
    const { activity } = this.state;
    const selectedDates = activity.dates;
    const texts = Texts[language].activityListItem;
    let datesString = "";
    if (activity.repetition_type === "monthly") {
      datesString = `${texts.every} ${moment(selectedDates[0]).format("Do")}`;
    } else {
      const eachMonthsDates = {};
      selectedDates.forEach(selectedDate => {
        const key = moment(selectedDate).format("MMMM YYYY");
        if (eachMonthsDates[key] === undefined) {
          eachMonthsDates[key] = [selectedDate];
        } else {
          eachMonthsDates[key].push(selectedDate);
        }
      });
      const months = Object.keys(eachMonthsDates);
      const dates = Object.values(eachMonthsDates);
      for (let i = 0; i < months.length; i += 1) {
        let monthString = "";
        dates[i].forEach(date => {
          monthString += ` ${moment(date).format("DD")},`;
        });
        monthString = monthString.substr(0, monthString.length - 1);
        monthString += ` ${months[i]}`;
        datesString += ` ${monthString}, `;
      }
      datesString = datesString.substr(0, datesString.length - 2);
    }
    return datesString;
  };

  render() {
    const { material, fetchedTimeslots } = this.state;
    return fetchedTimeslots ? (
      <React.Fragment>
        <div
          role="button"
          tabIndex="0"
          onKeyPress={this.handleMaterialClick}
          className="row no-gutters"
          style={{ minHheight: "7rem", cursor: "pointer" }}
          id={material.material_id}
          onClick={this.handleMaterialClick}
        >
          {/*{material.subscribed && (
            <div className="activityListItemIcon">
              <i className="fas fa-user-check" />
            </div>
          )}*/}
          <div className="col-2-10">
            <i
              style={{
                fontSize: "3rem",
                color: "red"
              }}
              className="fas fa-book center"
            />
          </div>
          <div
            className="col-6-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <div className="verticalCenter">
              <div className="row no-gutters">
                <h1>{material.material_name}</h1>
              </div>
              <div className="row no-gutters">
                <i
                  className="far fa-calendar-alt"
                  style={{ marginRight: "1rem" }}
                />
                <h2>{this.getDatesString()}</h2>
              </div>
            </div>
          </div>
          <div
            className="col-2-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <i
              style={{ fontSize: "2rem" }}
              className="fas fa-chevron-right center"
            />
          </div>
        </div>
      </React.Fragment>
    ) : (
      <Skeleton avatar active paragraph={{ rows: 1 }} />
    );
  }
}

export default withRouter(withLanguage(MaterialListItem));

MaterialListItem.propTypes = {
  material: PropTypes.object,
  groupId: PropTypes.string,
  history: PropTypes.object,
  language: PropTypes.string
};

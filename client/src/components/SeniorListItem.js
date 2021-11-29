import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import moment from "moment";
import { withRouter } from "react-router-dom";
import * as path from "lodash.get";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import Log from "./Log";

class SeniorListItem extends React.Component {
  state = { fetchedSenior: false, senior: {} };

  componentDidMount() {
    const { userId, seniorId } = this.props;
    axios
      .get(`/api/users/${userId}/seniors/${seniorId}`)
      .then(response => {
        const senior = response.data;
        this.setState({ fetchedSenior: true, senior });
      })
      .catch(error => {
        Log.error(error);
        this.setState({
          fetchedSenior: true,
          senior: {
            image: { path: "" },
            birthdate: new Date(),
            gender: "unspecified",
            given_name: "",
            family_name: "",
            senior_id: ""
          }
        });
      });
  }

  render() {
    const { language, history, seniorId } = this.props;
    const { pathname } = history.location;
    const { senior, fetchedSenior } = this.state;
    const texts = Texts[language].seniorListItem;
    const route = `${pathname}/${seniorId}`;
    return (
      <div
        id="seniorContainer"
        className="row no-gutters"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.1" }}
      >
        {fetchedSenior ? (
          <React.Fragment>
            <div className="col-3-10">
              <Avatar
                thumbnail={path(senior, ["image", "path"])}
                route={route}
                className="center"
              />
            </div>
            <div className="col-7-10">
              <div
                role="button"
                tabIndex={-42}
                onClick={() => history.push(route)}
                id="seniorInfoContainer"
                className="verticalCenter"
              >
                <h1>{`${senior.given_name} ${senior.family_name}`}</h1>
                <h1>
                  {`${moment().diff(senior.birthdate, "years")} ${texts.age}`}
                </h1>
                <h2>{texts[senior.gender]}</h2>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <Skeleton avatar active paragraph={{ rows: 1 }} />
        )}
      </div>
    );
  }
}

export default withRouter(withLanguage(SeniorListItem));

SeniorListItem.propTypes = {
  seniorId: PropTypes.string,
  userId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object
};

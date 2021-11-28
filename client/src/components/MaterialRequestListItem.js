import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import moment from "moment";
import withLanguage from "./LanguageContext";

class MaterialRequestListItem extends React.Component {
  constructor(props) {
    super(props);
    const { materialRequest } = this.props;
    this.state = { materialRequest };
  }

  async componentDidMount() {
    const { materialRequest } = this.state;
    materialRequest.subscribed = false;
    this.setState({ materialRequest });
  }

  handleMaterialRequestClick = (event) => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/${event.currentTarget.id}`);
  };

  getDatesString = (date) => {
    return moment(date).format("ll");
  };

  render() {
    const { materialRequest } = this.state;
    return (
      <React.Fragment>
        <div
          role="button"
          tabIndex="0"
          onKeyPress={this.handleMaterialRequestClick}
          className="row no-gutters"
          style={{ minHeight: "7rem", cursor: "pointer" }}
          id={materialRequest.material_request_id}
          onClick={this.handleMaterialRequestClick}
        >
          <div className="col-2-10">
            <i
              style={{
                fontSize: "4rem",
                color: materialRequest.color,
              }}
              className="fas fa-image center"
            />
          </div>
          <div
            className="col-6-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <div className="verticalCenter">
              <div className="row no-gutters">
                <h1>{materialRequest.material_name}</h1>
              </div>
              {
                <div className="row no-gutters">
                  <i
                    className="far fa-calendar-alt"
                    style={{ marginRight: "1rem" }}
                  />
                  <h2>{this.getDatesString(materialRequest.createdAt)}</h2>
                </div>
              }
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
    );
  }
}

export default withRouter(withLanguage(MaterialRequestListItem));

MaterialRequestListItem.propTypes = {
  materialRequest: PropTypes.object,
  groupId: PropTypes.string,
  history: PropTypes.object,
  language: PropTypes.string,
};

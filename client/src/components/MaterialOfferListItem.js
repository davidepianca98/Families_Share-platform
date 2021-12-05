import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import moment from "moment";
import withLanguage from "./LanguageContext";
import Images from "../Constants/Images";

class MaterialOfferListItem extends React.Component {
  constructor(props) {
    super(props);
    const { material } = this.props;
    this.state = { fetchedTimeslots: false, material };
  }

  async componentDidMount() {
    const { material } = this.state;
    this.setState({ material });
  }

  handleMaterialClick = (event) => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/${event.currentTarget.id}/info`);
  };

  getDatesString = (date) => {
    return moment(date).format("ll");
  };

  render() {
    const { material } = this.state;
    return (
      <React.Fragment>
        <div
          role="button"
          tabIndex="0"
          onKeyPress={this.handleMaterialClick}
          className="row no-gutters"
          style={{ minHheight: "7rem", cursor: "pointer" }}
          id={material.material_offer_id}
          onClick={this.handleMaterialClick}
        >
          <div className="col-2-10">
            <i
              style={{
                fontSize: "4rem",
                color: material.color,
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
                <h1>{material.material_name}</h1>
              </div>
              <div className="row no-gutters">
                <h2>
                  {material.description
                    ? material.description.length > 25
                      ? material.description.slice(0, 25) + "..."
                      : material.description
                    : "Nessuna descrizione"}
                </h2>
              </div>
              <div className="row no-gutters">
                <img
                  src={Images.mapMarkerAltRegular}
                  alt="map marker icon"
                  style={{
                    width: "1.1rem",
                    height: "1.4rem",
                    marginRight: "5px",
                    opacity: 0.87,
                  }}
                />
                <h2>
                  {material.location
                    ? material.location
                    : "Luogo non disponibile"}
                </h2>
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
    );
  }
}

export default withRouter(withLanguage(MaterialOfferListItem));

MaterialOfferListItem.propTypes = {
  material: PropTypes.object,
  groupId: PropTypes.string,
  history: PropTypes.object,
  language: PropTypes.string,
};

import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";

class MaterialOfferListItem extends React.Component {
  constructor(props) {
    super(props);
    const { material } = this.props;
    this.state = { fetchedTimeslots: false, material };
  }

  async componentDidMount() {
    const { material } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const { groupId } = this.props;
    const materialId = material.material_offer_id;
    this.setState({ fetchedTimeslots: true, material });
  }

  handleMaterialClick = (event) => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}/${event.currentTarget.id}`);
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
                    ? material.description
                    : "Nessuna descrizione"}
                </h2>
              </div>
              <div className="row no-gutters">
                <i
                  className="far fa-map-marker-alt"
                  style={{ marginRight: "1rem" }}
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
    ) : (
      <Skeleton avatar active paragraph={{ rows: 1 }} />
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

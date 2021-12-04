import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import * as path from "lodash.get";
import SeniorProfileHeader from "./SeniorProfileHeader";
import SeniorProfileInfo from "./SeniorProfileInfo";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

const getSenior = (userId, seniorId) => {
  return axios
    .get(`/api/users/${userId}/seniors/${seniorId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        senior_id: seniorId,
        image: { path: "" },
        background: "",
        given_name: "",
        family_name: "",
        birthdate: new Date(),
        gender: "unspecified"
      };
    });
};

class SeniorProfileScreen extends React.Component {
  state = { fetchedSeniorData: false, senior: {} };

  async componentDidMount() {
    const { match } = this.props;
    const { profileId, seniorId } = match.params;
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const senior = await getSenior(profileId, seniorId);
    senior.showAdditional = userId === profileId;
    this.setState({ senior, fetchedSeniorData: true });
  }

  render() {
    const { senior, fetchedSeniorData } = this.state;
    return fetchedSeniorData ? (
      <React.Fragment>
        <SeniorProfileHeader
          background={senior.background}
          photo={path(senior, ["image", "path"])}
          name={`${senior.given_name} ${senior.family_name}`}
        />
        <SeniorProfileInfo
          birthdate={senior.birthdate}
          parents={senior.parents}
          showAdditional={senior.showAdditional}
          specialNeeds={senior.special_needs}
          otherInfo={senior.other_info}
          allergies={senior.allergies}
          gender={senior.gender}
          handleAddParent={this.handleAddParent}
          handleDeleteParent={this.handleDeleteParent}
        />
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

SeniorProfileScreen.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};

export default SeniorProfileScreen;

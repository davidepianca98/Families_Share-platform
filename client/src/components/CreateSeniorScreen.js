import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { HuePicker } from "react-color";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";
import { withSnackbar } from "notistack";

const styles = {
  checkbox: {
    "&$checked": {
      color: "#00838F",
    },
  },
  checked: {},
};

const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");

  const mime = arr[0].match(/:(.*?);/)[1];

  const bstr = atob(arr[1]);

  let n = bstr.length;

  const u8arr = new Uint8Array(n);
  while (n) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

class CreateSeniorScreen extends React.Component {
  constructor(props) {
    super(props);
    const { history } = this.props;
    const { state } = history.location;
    if (state !== undefined) {
      this.state = {
        ...state,
      };
    } else {
      this.state = {
        name: "",
        surname: "",
        gender: "unspecified",
        availabilities: [],
        date: moment().date(),
        month: moment().month() + 1,
        year: moment().year(),
        acceptTerms: false,
        background: "#00838F",
        image: "/images/profiles/senior_default_photo.jpg",
      };
    }
  }

  componentDidMount() {
    const { language } = this.props;
    const { acceptTerms } = this.state;
    document.addEventListener("message", this.handleMessage, false);
    if (!acceptTerms) {
      document
        .getElementById("acceptTermsCheckbox")
        .setCustomValidity(Texts[language].createSeniorScreen.acceptTermsErr);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  handleMessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.action === "fileUpload") {
      const image = `data:image/png;base64, ${data.value}`;
      this.setState({
        image,
        file: dataURLtoFile(image, "photo.png"),
      });
    }
  };

  handleCancel = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleChange = (event) => {
    const { name } = event.target;
    const { value } = event.target;
    this.setState({ [name]: value });
  };

  validate = () => {
    const { language } = this.props;
    const texts = Texts[language].createSeniorScreen;
    const formLength = this.formEl.length;
    if (this.formEl.checkValidity() === false) {
      for (let i = 0; i < formLength; i += 1) {
        const elem = this.formEl[i];
        const errorLabel = document.getElementById(`${elem.name}Err`);
        if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
          if (!elem.validity.valid) {
            if (elem.validity.customError) {
              errorLabel.textContent = texts.acceptTermsErr;
            } else if (elem.validity.valueMissing) {
              errorLabel.textContent = texts.requiredErr;
            }
          } else {
            errorLabel.textContent = "";
          }
        }
      }
      return false;
    }
    for (let i = 0; i < formLength; i += 1) {
      const elem = this.formEl[i];
      const errorLabel = document.getElementById(`${elem.name}Err`);
      if (errorLabel && elem.nodeName.toLowerCase() !== "button") {
        errorLabel.textContent = "";
      }
    }
    return true;
  };

  submitChanges = () => {
    const { match, history, enqueueSnackbar, language } = this.props;
    const { profileId: userId } = match.params;

    const texts = Texts[language].createSeniorScreen;

    const {
      name: given_name,
      surname: family_name,
      year,
      month,
      date,
      gender,
      availabilities,
      background,
      image,
      file,
    } = this.state;

    const bodyFormData = new FormData();
    if (file !== undefined) {
      bodyFormData.append("photo", file);
    } else {
      bodyFormData.append("image", image);
    }
    const birthdate = moment().set({
      year,
      month: month - 1,
      date,
    });

    bodyFormData.append("given_name", given_name);
    bodyFormData.append("family_name", family_name);
    bodyFormData.append("gender", gender);
    bodyFormData.append("background", background);
    bodyFormData.append("availabilities", JSON.stringify(availabilities));
    bodyFormData.append("birthdate", birthdate);
    axios
      .post(`/api/users/${userId}/seniors`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        enqueueSnackbar(texts.snackbarMessage, {
          variant: "info",
        });
        Log.info(response);
        history.push(`/profiles/${userId}/seniors/${response.data.senior_id}`);
      })
      .catch((error) => {
        Log.error(error);
        history.goBack();
      });
  };
  /*
    let senior = {
      given_name: given_name,
      family_name: family_name,
      gender: gender,
      background: background,
      birthdate: moment().set({
        year,
        month: month - 1,
        date,
      }),
      availabilities: availabilities,
    };
    if (file !== undefined) {
      senior.photo = file;
    } else {
      senior.image = image;
    }
    axios
      .post(`/api/users/${userId}/seniors`, senior)
      .then((response) => {
        Log.info(response);
        history.goBack();
      })
      .catch((error) => {
        Log.error(error);
        history.goBack();
      });
  };
*/
  handleSave = (event) => {
    event.preventDefault();
    if (this.validate()) {
      this.submitChanges();
    }
    this.setState({ formIsValidated: true });
  };

  handleAvailability = () => {
    const { history } = this.props;
    const { pathname } = history.location;
    history.push({
      pathname: `${pathname}/additional`,
      state: {
        ...this.state,
      },
    });
    return false;
  };

  handleAcceptTerms = () => {
    const { acceptTerms } = this.state;
    const { language } = this.props;
    const elem = document.getElementById("acceptTermsCheckbox");
    elem.checked = !acceptTerms;
    if (!acceptTerms) {
      elem.setCustomValidity("");
    } else {
      elem.setCustomValidity(Texts[language].createSeniorScreen.acceptTermsErr);
    }
    this.setState({ acceptTerms: !acceptTerms });
  };

  handleColorChange = (color) => {
    this.setState({ background: color.hex });
  };

  handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.onload = (e) => {
        this.setState({ image: e.target.result, file });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  handleNativeImageChange = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ action: "fileUpload" })
    );
  };

  render() {
    const { classes, language, history } = this.props;
    const texts = Texts[language].createSeniorScreen;
    const {
      formIsValidated,
      month,
      year,
      name,
      surname,
      gender,
      date,
      acceptTerms,
      background,
      image,
    } = this.state;

    const formClass = [];
    const dates = [
      ...Array(
        moment()
          .month(month - 1)
          .year(year)
          .daysInMonth()
      ).keys(),
    ].map((x) => x + 1);
    const months = [...Array(12).keys()].map((x) => x + 1);
    const years = [...Array(100).keys()].map((x) => x + (moment().year() - 99));
    if (formIsValidated) {
      formClass.push("was-validated");
    }
    const bottomBorder = { borderBottom: "1px solid rgba(0,0,0,0.1)" };
    return (
      <React.Fragment>
        <div
          id="editSeniorProfileHeaderContainer"
          style={{ backgroundColor: background }}
        >
          <div className="row no-gutters" id="profileHeaderOptions">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="col-6-10">
              <h1 className="verticalCenter">{texts.backNavTitle}</h1>
            </div>
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleSave}
              >
                <i className="fas fa-check" />
              </button>
            </div>
          </div>
          <img
            src={image}
            alt="senior profile logo"
            className="horizontalCenter profilePhoto"
          />
        </div>
        <div id="createSeniorProfileInfoContainer">
          <form
            ref={(form) => {
              this.formEl = form;
            }}
            onSubmit={this.handleSubmit}
            className={formClass}
            noValidate
          >
            <div className="row no-gutters" style={bottomBorder}>
              <div className="col-5-10">
                <input
                  type="text"
                  name="name"
                  className="createSeniorProfileInputField form-control"
                  placeholder={texts.name}
                  onChange={this.handleChange}
                  required
                  value={name}
                />
                <span className="invalid-feedback" id="nameErr" />
              </div>
              <div className="col-5-10">
                <input
                  type="text"
                  name="surname"
                  className="createSeniorProfileInputField form-control"
                  placeholder={texts.surname}
                  onChange={this.handleChange}
                  required
                  value={surname}
                />
                <span className="invalid-feedback" id="surnameErr" />
              </div>
            </div>
            <div className="row no-gutters" style={bottomBorder}>
              <div className="col-1-3">
                <div className="fullInput editSeniorProfileInputField">
                  <label htmlFor="date">{texts.date}</label>
                  <select value={date} onChange={this.handleChange} name="date">
                    {dates.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-1-3">
                <div className="fullInput editSeniorProfileInputField">
                  <label htmlFor="month">{texts.month}</label>
                  <select
                    value={month}
                    onChange={this.handleChange}
                    name="month"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-1-3">
                <div className="fullInput editSeniorProfileInputField">
                  <label htmlFor="year">{texts.year}</label>
                  <select value={year} onChange={this.handleChange} name="year">
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row no-gutters" style={bottomBorder}>
              <div className="col-10-10">
                <div className="fullInput editSeniorProfileInputField">
                  <label htmlFor="gender">{texts.gender}</label>
                  <select
                    value={gender}
                    onChange={this.handleChange}
                    name="gender"
                  >
                    <option value="man">{texts.man}</option>
                    <option value="woman">{texts.woman}</option>
                    <option value="unspecified">{texts.unspecified}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10">
                <i className="fas fa-camera center" />
              </div>
              <div className="col-3-10">
                <div id="uploadGroupLogoContainer">
                  <label
                    className="horizontalCenter "
                    htmlFor="uploadLogoInput"
                  >
                    {texts.file}
                  </label>
                  {window.isNative ? (
                    <input
                      id="uploadLogoInput"
                      className="editSeniorProfileInput"
                      type="button"
                      accept="image/*"
                      name="logo"
                      onClick={this.handleNativeImageChange}
                    />
                  ) : (
                    <input
                      id="uploadLogoInput"
                      className="editSeniorProfileInput"
                      type="file"
                      accept="image/*"
                      name="logo"
                      onChange={this.handleImageChange}
                    />
                  )}
                </div>
              </div>
              <div className="col-2-10">
                <i className="fas fa-fill-drip center" />
              </div>
              <div className="col-3-10">
                <HuePicker
                  width="90%"
                  className="verticalCenter"
                  color={background}
                  onChange={this.handleColorChange}
                />
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-2-10">
                <Checkbox
                  classes={{ root: classes.checkbox, checked: classes.checked }}
                  className="center"
                  checked={acceptTerms}
                  onClick={this.handleAcceptTerms}
                />
              </div>
              <div className="col-8-10">
                <h1 className="verticalCenter">{texts.acceptTerms}</h1>
              </div>
            </div>
            <div style={{ paddingLeft: "3%" }} className="row no-gutters">
              <input
                type="checkbox"
                style={{ display: "none" }}
                id="acceptTermsCheckbox"
                name="acceptTerms"
                className="form-control"
                required
                defaultChecked={acceptTerms}
              />
              <span className="invalid-feedback" id="acceptTermsErr" />
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default withSnackbar(
  withLanguage(withStyles(styles)(CreateSeniorScreen))
);

CreateSeniorScreen.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  language: PropTypes.string,
  classes: PropTypes.object,
};

import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Skeleton } from "antd";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Log from "./Log";


/*const getTimeslots = (groupId, materialId) => {
    return axios
        .get(`/api/groups/${groupId}/materials/${materialId}/timeslots`)//riga 1401 group-routes.js è la funzione per activities che era precedentemente chiamata
        .then(response => {
            return response.data;
        })
        .catch(error => {
            Log.error(error);
            return [];
        });
};*/

class MaterialRequestListItem extends React.Component {
    constructor(props) {
        super(props);
        const { materialRequest } = this.props;
        this.state = { fetchedTimeslots: false, materialRequest };
    }

    async componentDidMount() {
        const { materialRequest } = this.state;
        /*const userId = JSON.parse(localStorage.getItem("user")).id;
        const { groupId } = this.props;
        const materialId = materialRequest.material_request_id;
        const usersChildren = await getUsersChildren(userId);
        const timeslots = await getTimeslots(groupId, materialId);
        let dates = timeslots.map(timeslot => timeslot.start.dateTime);
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
        });*/
        materialRequest.subscribed = false;
        /*for (let i = 0; i < timeslots.length; i += 1) {
            const parents = JSON.parse(
                timeslots[i].extendedProperties.shared.parents
            );
            const children = JSON.parse(
                timeslots[i].extendedProperties.shared.children
            );
            const userSubscribed = parents.includes(userId);
            let childrenSubscribed = false;
            for (let j = 0; j < usersChildren.length; j += 1) {
                if (children.includes(usersChildren[j])) {
                    childrenSubscribed = true;
                    break;
                }
            }
            if (userSubscribed || childrenSubscribed) {
                materialRequest.subscribed = true;
                break;
            }
        }
        materialRequest.dates = uniqueDates;*/
        this.setState({ fetchedTimeslots: true /*false*/, materialRequest }); //dovrebbe essere false il fetched timeslots ma per il momento lo tengo a true
    }

    handleMaterialRequestClick = event => {
        const { history } = this.props;
        const { pathname } = history.location;
        history.push(`${pathname}/${event.currentTarget.id}`);
    };

    getDatesString = () => {
        const { language } = this.props;
        const { materialRequest } = this.state;
        const selectedDates = materialRequest.dates;
        console.log("material request list item: " + selectedDates)
        //const texts = Texts[language].activityListItem;
        let datesString = "";
        /*if (materialRequest.repetition_type === "monthly") {
            datesString = `${texts.every} ${moment(selectedDates[0]).format("Do")}`;
        } else {*/
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
        /*}*/
        return datesString;
    };

    render() {
        const { materialRequest, fetchedTimeslots } = this.state;
        return fetchedTimeslots ? (
            <React.Fragment>
                <div
                    role="button"
                    tabIndex="0"
                    onKeyPress={this.handleMaterialRequestClick}
                    className="row no-gutters"
                    style={{ minHheight: "7rem", cursor: "pointer" }}
                    id={materialRequest.material_request_id}
                    onClick={this.handleMaterialRequestClick}
                >
                    <div className="col-2-10">
                        <i
                            style={{
                                fontSize: "4rem",
                                color: materialRequest.color
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
                            {<div className="row no-gutters">
                                <i
                                    className="far fa-calendar-alt"
                                    style={{ marginRight: "1rem" }}
                                />
                                <h2>{materialRequest.createdAt}</h2>
                            </div>}
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

export default withRouter(withLanguage(MaterialRequestListItem));

MaterialRequestListItem.propTypes = {
    materialRequest: PropTypes.object,
    groupId: PropTypes.string,
    history: PropTypes.object,
    language: PropTypes.string
};

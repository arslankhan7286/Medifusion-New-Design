import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";

import EncounterCPTTable from "./EncounterCPTTable";
import EncounterICDTable from "./EncounterICDTable";

class Encounter extends Component {
  constructor(props) {
    super(props);

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.url = process.env.REACT_APP_URL + "/PatientAppointment/";

    this.encounterData = {
      practiceName: "",
      practiceAddress: "",
      dob: "",
      dos: "",
      provider: "",
      location: "",
      primaryPlanName: "",
      patient: "",
    };

    this.state = {
      typesCPT: [],
      typesICD: [],
      encounterData: this.encounterData,
      encounterCPTTable: [],
      encounterICDTable: [],
      patientPayment: [],
    };
  }

  componentWillMount() {
    if (this.props.selectedEvent) {
      axios
        .get(
          this.url +
            "PatientAppointmentEncounter/" +
            this.props.args.appointment.id,
          this.config
        )
        .then((response) => {
          console.log("ENCOUNTER RESPONSE", response.data);
          let types1 = [];
          let uniqueCPTs = [];
          response.data.cpt.map((row) => {
            types1.push(row.type);
          });
          uniqueCPTs = types1.filter((row, i) => types1.indexOf(row) === i);

          let types2 = [];
          let uniqueICDs = [];
          response.data.icd.map((row) => {
            types2.push(row.type);
          });
          uniqueICDs = types2.filter((row, i) => types2.indexOf(row) === i);

          console.log("uniqueCPTs", uniqueCPTs);
          this.setState({
            typesCPT: uniqueCPTs,
            typesICD: uniqueICDs,
            encounterData: response.data.appointment,
            encounterCPTTable: response.data.cpt,
            encounterICDTable: response.data.icd,
            patientPayment: response.data.patientPayment,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <div>
        <div className="mainTable">
          <div className="col-lg-12 mt-3">
            <div
              className="col-lg-12"
              style={{
                textAlign: "center",
                backgroundColor: "#BED6DF",
                padding: "5px",
              }}
            >
              <h5>{this.state.encounterData.practiceName}</h5>
              <h6>{this.state.encounterData.practiceAddress}</h6>
            </div>
          </div>
          <div style={{ marginTop: "20px" }} className="col-lg-12">
            <div className="mf-4">
              <label className="w-25">
                <strong>Patient: </strong>
              </label>
              <input
                style={{
                  width: "70%",
                  border: "1px solid #000",
                  borderRadius: "unset",
                }}
                value={this.state.encounterData.patient}
                readOnly
                type="text"
                className="Schedularselect readonly"
              />
            </div>
            <div className="mf-4">
              <label className="w-25">
                <strong>DOB: </strong>
              </label>
              <input
                style={{
                  width: "70%",
                  border: "1px solid #000",
                  borderRadius: "unset",
                }}
                value={this.state.encounterData.dob}
                readOnly
                type="text"
                className="Schedularselect readonly"
              />
            </div>
            <div className="mf-4">
              <label className="w-25">
                <strong>DOS: </strong>
              </label>
              <input
                style={{
                  border: "1px solid #000",
                  borderRadius: "unset",
                }}
                value={this.state.encounterData.dos}
                readOnly
                type="text"
                className="Schedularselect readonly w-75"
              />
            </div>
          </div>
          <div className="col-lg-12 mt-2">
            <div className="mf-4">
              <label className="w-25">
                <strong>Insurance: </strong>
              </label>
              <input
                style={{
                  textOverflow: "ellipsis",
                  width: "70%",
                  border: "1px solid #000",
                  borderRadius: "unset",
                }}
                value={this.state.encounterData.primaryPlanName}
                readOnly
                type="text"
                className="Schedularselect readonly"
              />
            </div>
            <div className="mf-4">
              <label className="w-25">
                <strong>Provider: </strong>
              </label>
              <input
                style={{
                  width: "70%",
                  border: "1px solid #000",
                  borderRadius: "unset",
                }}
                value={this.state.encounterData.provider}
                readOnly
                type="text"
                className="Schedularselect readonly"
              />
            </div>
            <div className="mf-4">
              <label className="w-25">
                <strong>Location: </strong>
              </label>
              <input
                style={{ border: "1px solid #000", borderRadius: "unset" }}
                value={this.state.encounterData.location}
                readOnly
                type="text"
                className="Schedularselect readonly w-75"
              />
            </div>
          </div>
          {this.props.selectedEvent ? (
            <div className="col-lg-12 p-0">
              <div className="row">
                <div
                  className="col-lg-12 mt-3"
                  style={{
                    padding: "0px 30px",
                  }}
                >
                  <h5
                    style={{
                      textAlign: "center",
                      backgroundColor: "#BED6DF",
                      padding: "5px",
                    }}
                  >
                    CPTs
                  </h5>
                </div>

                <div className="col-lg-12">
                  <div className="col-lg-6" style={{ float: "left" }}>
                    <EncounterCPTTable
                      data={this.state.encounterCPTTable}
                      types={this.state.typesCPT}
                      even={true}
                    />
                  </div>
                  <div className="col-lg-6" style={{ float: "left" }}>
                    <EncounterCPTTable
                      data={this.state.encounterCPTTable}
                      types={this.state.typesCPT}
                      even={false}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div
                  className="col-lg-12 mt-3"
                  style={{
                    padding: "0px 30px",
                  }}
                >
                  <h5
                    style={{
                      textAlign: "center",
                      backgroundColor: "#BED6DF",
                      padding: "5px",
                    }}
                  >
                    ICDs
                  </h5>
                </div>
                <div className="col-lg-12">
                  <div className="col-lg-6" style={{ float: "left" }}>
                    <EncounterICDTable
                      data={this.state.encounterICDTable}
                      types={this.state.typesICD}
                      even={true}
                    />
                  </div>
                  <div className="col-lg-6" style={{ float: "left" }}>
                    <EncounterICDTable
                      data={this.state.encounterICDTable}
                      types={this.state.typesICD}
                      even={false}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-lg-12 mt-3"
                  style={{
                    padding: "0px 30px",
                  }}
                >
                  <h5
                    style={{
                      textAlign: "center",
                      backgroundColor: "#BED6DF",
                      padding: "5px",
                    }}
                  >
                    Patient Payments
                  </h5>
                </div>
                <div className="col-lg-12">
                  {this.state.patientPayment.map((row) => (
                    <div style={{ float: "left" }} className="col-lg-2">
                      <label
                        style={{
                          width: "100%",
                          padding: "10px",
                          textAlign: "center",
                          backgroundColor: "#989DA9",
                        }}
                      >
                        {row.description} | ${row.paymentAmount}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("state from Header Page", state);
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // selectTabPageAction: selectTabPageAction,
      // loginAction: loginAction,
      // selectTabAction: selectTabAction
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Encounter);

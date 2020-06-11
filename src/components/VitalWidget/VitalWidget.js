import React, { Component } from "react";
import TopForm from "../TopForm/TopForm";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";

import axios from "axios";
import CNotes from "../ClinicalNotes/ClinicalNotes";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import { eo } from "date-fns/locale";

class Collapse extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PatientNotes/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.state = {
      vitals: [],
      allergies: [],
    };
  }
  componentDidMount() {
    axios
      .get(
        this.url + `PatientVitals?patientId=${this.props.newID}`,
        this.config
      )
      .then((response) => {
        console.log("Vitals Summary", response.data);
        this.setState({ vitals: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        this.url + `GetPatientAllergy?patientId=${this.props.newID}`,
        this.config
      )
      .then((response) => {
        console.log("Allergies Summary", response.data);
        this.setState({ allergies: response.data });
      });
  }

  render() {
    console.log("Allergies Summary State", this.state.allergies);
    return (
      <div>
        <div class="container">
          <div className="mb-3">
            <CNotes newID={this.props.newID} />
          </div>
          <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-6 pl-0 mb-3 mb-lg-0 pr-0 pr-lg-3 pr-md-3 ">
              <div
                className="widget-border bg-white p-2"
                style={{ height: "278px", msOverflowY: "scroll" }}
              >
                <div className="row">
                  <div className="col-6 mb-3">
                    <div className="widget-heading">Vitals</div>
                  </div>
                  <div className="col-6 mb-3 text-right">
                    <div className="widget-Icon">
                      <i class="fas fa-sync-alt"></i>
                    </div>
                  </div>
                </div>
                {this.state.vitals.map((vital, i) => (
                  <div
                    class="panel-group"
                    id="accordion"
                    role="tablist"
                    aria-multiselectable="true"
                  >
                    {console.log("index", "#" + i)}
                    <div class="panel panel-default">
                      <div class="panel-heading" role="tab" id="headingTwo">
                        <h4 class="panel-title">
                          <a
                            class="collapsed"
                            data-toggle="collapse"
                            data-parent="#accordion"
                            href={"#collapse" + i}
                            aria-expanded="false"
                            aria-controls={"collapse" + i}
                          ></a>
                          {vital.dos}{" "}
                          <span>
                            <strong>BP-</strong>
                            {vital.bpSystolic}/{vital.bpDiastolic},
                          </span>
                          <span>
                            <strong>T-</strong>
                            {vital.temperature},
                          </span>
                          <span>
                            <strong>BMI-</strong>
                            {vital.bmi},
                          </span>
                          <span>
                            <strong>T-</strong>
                            {vital.temperature},
                          </span>
                          <span>
                            <strong>P-</strong>
                            {vital.bpSystolic}/{vital.bpDiastolic}
                          </span>
                        </h4>
                      </div>
                      <div
                        id={"collapse" + i}
                        class="panel-collapse collapse"
                        role="tabpanel"
                        aria-labelledby="headingTwo"
                      >
                        <div class="panel-body">
                          <div className="info" id={i}>
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label>Height</label>
                                  </div>
                                  <div className="col-lg-6">
                                    {vital.height_inch}
                                  </div>
                                  <div className="col-lg-6">
                                    <label>Weight</label>
                                  </div>
                                  <div className="col-lg-6">
                                    {vital.weight_lbs}
                                  </div>
                                  <div className="col-lg-6">
                                    <label>BMI(kg/m2)</label>
                                  </div>
                                  <div className="col-lg-6">{vital.bmi}</div>
                                  <div className="col-lg-6">
                                    <label>Pain</label>
                                  </div>
                                  <div className="col-lg-6">{vital.pain}</div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="row">
                                  <div className="col-lg-7 pr-lg-0 pl-lg-0">
                                    <label>Temperature (f)</label>
                                  </div>
                                  <div className="col-lg-5">
                                    {vital.temperature}
                                  </div>
                                  <div className="col-lg-7 pr-lg-0 pl-lg-0">
                                    <label>Pulse (bpm)</label>
                                  </div>
                                  <div className="col-lg-5 ">{vital.pulse}</div>
                                  <div className="col-lg-7 pr-lg-0 pl-lg-0">
                                    <label>Respiratory Rate</label>
                                  </div>
                                  <div className="col-lg-5">
                                    {vital.respiratory_rate}
                                  </div>
                                  <div className="col-lg-7 pr-lg-0 pl-lg-0">
                                    <label>B.P (mmHg)</label>
                                  </div>
                                  <div className="col-lg-5">
                                    {vital.bpSystolic}/{vital.bpDiastolic}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 pl-0 pr-0 pr-lg-3 pr-md-3">
              <div
                className="widget-border bg-white p-2"
                style={{ height: "278px", msOverflowY: "scroll" }}
              >
                <div className="row">
                  <div className="col-6 mb-3 ">
                    <div className="widget-heading">Allergies</div>
                  </div>
                  <div className="col-6 mb-3 text-right">
                    <div className="widget-Icon">
                      <i class="fas fa-sync-alt"></i>
                    </div>
                  </div>
                </div>
                {this.state.allergies.map((item) => (
                  <li className="mb-2">
                    <span style={{ fontSize: "13px" }}>{item.dos} </span>
                    <span>
                      <strong>Reaction: </strong>
                      {item.reaction}
                    </span>
                    ,{" "}
                    <span>
                      <strong>Status: </strong>
                      {item.status}
                    </span>
                  </li>
                ))}
              </div>
            </div>
            <div className="col-lg-5 pr-0 pl-0">
              <div className="row">
                <div className="col-lg-12 col-md-6 col-sm-6 mb-3 mb-lg-0 mb-md-0">
                  <div
                    className="widget-border px-1"
                    style={{ height: "216px" }}
                  >
                    <div className="row">
                      <div className="col-6 mb-3 ">
                        <div className="widget-heading">Social History</div>
                      </div>
                      <div className="col-6 mb-3 text-right">
                        <div className="widget-Icon">
                          <i class="fas fa-sync-alt"></i>
                        </div>
                      </div>
                    </div>
                    <ul className="list-unstyled m-0 p-0 history">
                      <li>
                        <strong>Tobbaco use</strong>
                        No tobacco use recorded
                      </li>
                      <li>
                        <strong>Social history</strong>
                        No Social history Recorded
                      </li>
                      <li>
                        <strong>Gender identity </strong>
                        No gender identity recorded
                      </li>
                      <li>
                        <strong>Sexual orientation </strong>
                        81 MG Oral Tablet Delayed Release
                      </li>
                      <li>
                        <strong>Nutrition history </strong>
                        No sexual orientation recorded
                      </li>
                      <li>
                        <strong>Dexlansoprazole (Dexilant) </strong>
                        No nutrition history recorded
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-12 col-md-6 col-sm-6 pr-lg-3 pl-lg-3 pl-md-0 mt-lg-3 ">
                  <div className="widget-border px-1">
                    <div className="row">
                      <div className="col-6 mb-3 ">
                        <div className="widget-heading">
                          Family healith history
                        </div>
                      </div>
                      <div className="col-6 mb-3 text-right">
                        <div className="widget-Icon">
                          <i class="fas fa-sync-alt"></i>
                        </div>
                      </div>
                    </div>
                    <ul className="list-unstyled m-0 p-0 history">
                      <li>
                        <span className="mr-2">
                          - No family health history recorded
                        </span>
                        <span>- No family health history recorded</span>
                      </li>
                      <li>
                        <span className="mr-2">
                          - No family health history recorded
                        </span>
                        <span>- No family health history recorded</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginAction: loginAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Collapse);

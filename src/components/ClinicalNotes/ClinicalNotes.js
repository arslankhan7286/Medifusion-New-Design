import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import ClinicalForms from "./ClinicalNotesForm";

import "./SearchPatient.css";
import axios from "axios";
import DetailedNotes from "../DetailedNotes/ClinicalNotesDetail";
import GifLoader from "react-gif-loader";
import Eclips from "../../images/loading_spinner.gif";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import { setDate } from "../../actions/setDate";

import { eo } from "date-fns/locale";

class SearchPatient extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PatientNotes/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer" + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.state = {
      form: [],
      CNotes: [],
      modal: false,
      editID: null,
      loading: true,
      showClinicalForm: false,
    };
  }
  toggle = (ID) => {
    this.setState({ modal: !this.state.modal });
  };

  componentWillMount() {
    axios({
      url: this.url + "Notes/" + this.props.newID,
      method: "get",
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    })
      .then((response) => {
        console.log("Notes", response.data);
        this.setState({
          loading: response.data ? false : true,
          CNotes: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setDates(dos, otherDates) {
    let updateDate = [];
    updateDate = otherDates.filter((row) => row.dos !== dos);
    this.props.setDate(dos, updateDate);
  }

  render() {
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    let popup = "";
    if (this.state.showClinicalForm) {
      popup = <ClinicalForms />;
    }

    return (
      <div className="clinical-notes">
        {spiner}
        <div className="row">
          <div
            className="col-sm-12 col-md-6 col-lg-6 col-sm-12 pl-0 pr-lg-3 pr-0 mb-3 mb-lg-0 mb-md-0"
            id="notes"
          >
            <div className="widget-border p-1 mt-0" style={{ height: "214px" }}>
              <div className="row">
                <div className="col-6">
                  <h3 className="widget-heading">Clinical Notes</h3>
                </div>
                <div className="col-6 text-right">
                  <div className="widget-Icon">
                    <i class="fas fa-sync"></i>
                  </div>
                </div>
              </div>
              {/* <div id="accor" className="accordion">
                <ul className="list-unstyled m-0 p-0 px-1">
                  {this.state.CNotes.map((notes, i) => {
                    return (
                      <li>
                        <span
                          className="header collapsed"
                          data-toggle="collapse"
                          href={"#data" + i}
                        ></span>
                        <p className="link d-block mb-1">
                          <Link
                            onClick={() =>
                              this.setDates(notes.dos, this.state.CNotes)
                            }
                            to={{
                              pathname: `/detailednotes/${notes.patientNotesID}`,
                              query: {
                                date: notes,
                                patientID: this.props.newID,
                              },
                            }}
                            style={{ color: "#03658c", marginRight: "5px" }}
                          >
                            {notes.dos},
                          </Link>
                          <span
                            style={{ color: "#134760", marginRight: "5px" }}
                          >
                            {" "}
                            {notes.provider},{" "}
                          </span>
                          <span
                            style={{ color: "#134760", marginRight: "5px" }}
                          >
                            {notes.location},
                          </span>
                          <span style={{ color: "#358EAA" }}>USA,</span>
                          <span className="font-weight-bold">VR :</span>
                          <span style={{ color: "#134760" }}>
                            {notes.visitReason}
                          </span>
                          {notes.signed ? (
                            <span
                              style={{ position: "relative" }}
                              className="lock"
                            >
                              <i class="fas fa-lock ml-3"></i>
                              <label
                                style={{
                                  background: "#4f8094",
                                  color: "#fff",
                                  padding: "0px 5px",
                                  paddingBottom: "1px",
                                  position: "absolute",
                                  bottom: "5px",
                                  left: "22px",
                                  borderRadius: "5px",
                                }}
                              >
                                Signed
                              </label>
                            </span>
                          ) : null}
                        </p>
                        <a
                          id={"data" + i}
                          className="collapse w-100 ml-3"
                          data-parent="#accor"
                          href="fifth"
                          style={{ color: "#3C89AA" }}
                        >
                          Data Use Aggrement (default)
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div> */}
              {/* //My Code */}
              {this.state.CNotes.map((notes, i) => (
                <div
                  class="panel-group"
                  id="accordion1"
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
                          data-parent="#accordion1"
                          href={"#collapse1" + i}
                          aria-expanded="false"
                          aria-controls={"collapse" + i}
                        ></a>
                        <Link
                          className="note-icon"
                          onClick={() =>
                            this.setDates(notes.dos, this.state.CNotes)
                          }
                          to={{
                            pathname: `/detailednotes/${notes.patientNotesID}`,
                            query: {
                              date: notes,
                              patientID: this.props.newID,
                            },
                          }}
                          style={{ color: "#03658c", marginRight: "5px" }}
                        >
                          {notes.dos}{" "}
                        </Link>
                        <span>
                          <strong>Provider:</strong>
                          {notes.provider},
                        </span>
                        <span>
                          <strong>VR:</strong>
                          {notes.visitReason},
                        </span>
                        {notes.signed ? (
                          <span
                            style={{ position: "relative" }}
                            className="lock"
                          >
                            <i class="fas fa-lock ml-3"></i>
                            <label
                              style={{
                                background: "#4f8094",
                                color: "#fff",
                                padding: "0px 5px",
                                paddingBottom: "1px",
                                position: "absolute",
                                bottom: "5px",
                                left: "22px",
                                borderRadius: "5px",
                              }}
                            >
                              Signed
                            </label>
                          </span>
                        ) : null}
                      </h4>
                    </div>
                    <div
                      id={"collapse1" + i}
                      class="panel-collapse collapse"
                      role="tabpanel"
                      aria-labelledby="headingTwo"
                    >
                      <div class="panel-body">
                        <div className="info" id={i}>
                          {notes.form.map((row) => (
                            <div style={{ display: "-webkit-box" }}>
                              <Link
                                // onClick={this.showClinicalForm}
                                to={{
                                  pathname: `/ClinicalNotesForm/${row.id}`,
                                  query: {
                                    formData: row,
                                    patientNotesID: notes.patientNotesID,
                                    comingFrom: "ClinicalNotes",
                                  },
                                }}
                                // style={{ color: "#03658c", marginRight: "5px" }}
                              >
                                <a
                                  id={"collapse1" + i}
                                  className="collapse w-100 ml-3"
                                  data-parent="#accor"
                                  href="#"
                                  style={{ color: "#3C89AA" }}

                                  // data-toggle="collapse"
                                  // data-parent={"collapse1" + i}
                                  // href={"#collapse1" + i}
                                  // aria-expanded="false"
                                  // aria-controls={"collapse" + i}
                                >
                                  {row.name}
                                </a>
                              </Link>
                              {row.signed ? (
                                <span
                                  id={"collapse1" + i}
                                  data-parent="#accor"
                                  style={{ position: "relative" }}
                                  className="lock collapse"
                                >
                                  <i class="fas fa-lock ml-3"></i>
                                  <label
                                    style={{
                                      background: "#4f8094",
                                      color: "#fff",
                                      padding: "0px 5px",
                                      paddingBottom: "1px",
                                      position: "absolute",
                                      bottom: "5px",
                                      left: "22px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    Signed
                                  </label>
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* //My Code */}
            </div>
          </div>
          <div
            className=" col-sm-12 col-md-6 col-lg-6 col-sm-12 pr-lg-0 pl-0 pr-0 pr-md-3"
            id="medication"
          >
            <div className="widget-border p-1">
              <div className="row">
                <div className="col-6">
                  <h3 className="widget-heading">Medication</h3>
                </div>
                <div className="col-6 text-right">
                  <div className="widget-Icon">
                    <i class="fas fa-sync"></i>
                  </div>
                </div>
              </div>
              <ul
                className="fa-ul medication"
                style={{ listStyleType: "circle", marginTop: "10px" }}
              >
                <li>
                  <span className="fa-li"></span>
                  <strong>Aspirin</strong>
                  81 mg Tablet Delayed Release 12/15/08
                </li>
                <li>
                  <span className="fa-li"></span>
                  <strong>azithromyzine (Zimthromax)</strong>
                  250 mg oral tablet Start 12/15/08
                </li>
                <li>
                  <span className="fa-li"></span>
                  <strong>Dexlansoperazole (Dexilant)</strong>
                  250 mg oral tablet Start 12/15/08
                </li>
                <li>
                  <span className="fa-li"></span>
                  <strong>Aspirin</strong>
                  81 mg Tablet Delayed Release 12/15/08
                </li>
                <li>
                  <span className="fa-li"></span>
                  <strong>azithromyzine (Zimthromax)</strong>
                  250 mg oral tablet Start 12/15/08
                </li>
                <li>
                  <span className="fa-li"></span>
                  <strong>Dexlansoperazole (Dexilant)</strong>
                  250 mg oral tablet Start 12/15/08
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader>Modal title</ModalHeader>
          <ModalBody>
            <b>Look at the top right of the page/viewport!</b>
            <br />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
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
      setDate: setDate,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(SearchPatient);

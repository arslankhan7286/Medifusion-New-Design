import React, { Component } from "react";
import MedicationDetail from "./MedicationDetails";
import VitalsDetail from "./VitalsDetail";
import AllergiesDetail from "./AllergiesDetail";
import SocialDetail from "./SocialDetail";
import FamilyDetail from "./FamilyDetail";
import Editor from "../Editor/Editor";
import DetailHeader from "../DetailedNotes/DetailHeader";
import axios from "axios";
import Swal from "sweetalert2";
import GifLoader from "react-gif-loader";
import Eclips from "../../images/loading_spinner.gif";
import ReactToPrint from "react-to-print";
import TopFrom from "../TopForm/TopForm";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import { eo } from "date-fns/locale";

class DetailedNotes extends Component {
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
      patientData: null,
      header: [],
      status: this.props.location.query.date.signed,
      loading: false,
    };
  }
  sign = () => {
    this.setState({ loading: true });
    let id = this.props.match.params.id;
    axios
      .post(
        this.url + `SignPatientNotes?patientNotesId=${id}&sign=true`,
        "",
        this.config
      )
      .then((response) => {
        console.log("sign response", response);
        this.props.history.push("/clinicalnotes");
        this.setState({ loading: false });
      })
      .catch((error) => {
        Swal.fire("Something Went Wrong", "", "error");
        this.setState({ loading: false });
      });
  };
  UnSign = () => {
    this.setState({ loading: true });
    let id = this.props.match.params.id;
    axios
      .post(
        this.url + `SignPatientNotes?patientNotesId=${id}&sign=false`,
        "",
        this.config
      )
      .then((response) => {
        console.log("sign response", response);
        Swal.fire({
          title: "Do you want to allow Editing ?",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "UnSign",
        }).then((result) => {
          if (result.value) {
            this.props.history.push("/clinicalnotes");
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
            response.data.signed = "true";
          }
        });
        // this.props.history.push("/clinicalnotes");
        // this.setState({ loading: false });
      })
      .catch((error) => {
        Swal.fire("Something Went Wrong", "", "error");
        this.setState({ loading: false });
      });
  };
  componentDidMount() {
    this.setState({ loading: true });
    console.log("clinicalNotesDetail Props", this.props);
    console.log("clinicalNotesDetail Status", this.state.status);
    let id = this.props.match.params.id;
    axios
      .get(this.url + `PatientVitals/${id}`, this.config)
      .then((response) => {
        this.setState({ vitals: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(this.url + `PatientMedicalNotes/${id}`, this.config)
      .then((response) => this.setState({ patientData: response.data }))
      .catch((error) => error);

    axios
      .get(this.url + `PatientlNotesHeader/${id}`, this.config)
      .then((response) =>
        this.setState({ header: response.data, loading: false })
      )
      .catch((error) => error);
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
    console.log(
      "this.props.location.query.date.form",
      this.props.location.query.date.form
    );
    console.log("this.props.location.state", this.props.location.state);
    return (
      <div className="clinicalDetails">
        <TopFrom patientID={this.props.location.query.patientID} />
        {spiner}
        {this.state.status ? (
          <div>
            <Link to="/clinicalnotes" className="font-weight-bold w-auto">
              <button
                style={{
                  cursor: "pointer",
                }}
                className="btn-blue"
              >
                Back
              </button>
            </Link>

            <button
              style={{
                cursor: "pointer",
              }}
              className="btn-blue"
              onClick={this.UnSign}
            >
              Un Sign
            </button>
            <ReactToPrint
              trigger={() => (
                <a>
                  <input type="button" className="print-btn" />
                </a>
              )}
              content={() => this.componentRef}
            />
          </div>
        ) : this.state.status === false ? (
          <div>
            <Link to="/clinicalnotes" className="font-weight-bold w-auto">
              <button
                style={{
                  cursor: "pointer",
                }}
                className="btn-blue"
              >
                Back
              </button>
            </Link>
            <button
              style={{
                cursor: "pointer",
              }}
              className="btn-blue"
              onClick={this.sign}
            >
              Sign
            </button>
            <ReactToPrint
              trigger={() => (
                <a>
                  <input type="button" className="print-btn" />
                </a>
              )}
              content={() => this.componentRef}
            />
          </div>
        ) : (
          <div>
            <Link to="/clinicalnotes" className="font-weight-bold w-auto">
              <button
                style={{
                  cursor: "pointer",
                }}
                className="btn-blue"
              >
                Back
              </button>
            </Link>
            <button
              style={{
                cursor: "pointer",
              }}
              className="btn-blue"
              onClick={this.sign}
            >
              Sign
            </button>
            <button
              style={{
                cursor: "pointer",
              }}
              className="btn-blue"
              onClick={this.UnSign}
            >
              Un Sign
            </button>
            <ReactToPrint
              trigger={() => (
                <a>
                  <input type="button" className="print-btn" />
                </a>
              )}
              content={() => this.componentRef}
            />
          </div>
        )}
        <div ref={(el) => (this.componentRef = el)}>
          <DetailHeader
            headerInfo={this.state.header}
            status={this.state.status}
          />
          <div className="row">
            <div class="col-lg-12 col-md-12 col-sm-12 mb-3 mb-lg-0 pr-lg-3 pr-md-3 mb-3">
              <div
                className="widget-border border-0 p-2 ClinicalFormsDetails"
                style={{ overflowY: "hidden" }}
              >
                <div className="row">
                  <div className="col-12 ">
                    <div>
                      <label
                        className="widget-heading"
                        style={{
                          width: "100%",
                        }}
                      >
                        Forms
                      </label>
                    </div>
                  </div>
                </div>
                <div className="info">
                  {this.props.location.query.date.form ? this.props.location.query.date.form.map((row) => (
                    <div style={{ display: "-webkit-box" }}>
                      <Link
                        // onClick={this.showClinicalForm}
                        to={{
                          pathname: `/ClinicalNotesForm/${row.id}`,
                          query: {
                            formData: row,
                            patientNotesID: this.props.location.query.date
                              .patientNotesID,
                            date: this.props.location.query.date,
                            patientID: this.props.location.query.patientID,
                            comingFrom: "ClinicalNotesDetails",
                          },
                        }}
                        // style={{ color: "#03658c", marginRight: "5px" }}
                      >
                        <a
                          // id={"data" + i}
                          className="w-100 ml-3"
                          data-parent="#accor"
                          href="#"
                          style={{ color: "#3C89AA" }}
                        >
                          {row.name}
                        </a>
                      </Link>
                    </div>
                  )) : "No Forms Found !"}
                </div>
              </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 mb-3 mb-lg-0 pr-lg-3 pr-md-3 mb-3">
              <div
                className="widget-border  border-0 p-2"
                style={{ overflowY: "hidden" }}
              >
                <VitalsDetail
                  patientNotesID={this.props.match.params.id}
                  patientID={this.props.location.query.patientID}
                  status={this.state.status}
                />
              </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 mb-3 mb-lg-0 pr-lg-3 pr-md-3 mb-3">
              <div
                className="widget-border  border-0 pl-1"
                style={{ overflowY: "hidden" }}
              >
                <Editor
                  patientData={this.state.patientData || []}
                  patientNotesID={this.props.match.params.id}
                  status={this.state.status}
                />
              </div>
            </div>
            <div
              className="  col-sm-12 col-md-12 col-lg-12 col-sm-12 pr-md-3 "
              id="medication"
            >
              <div
                className="widget-border border-0 p-1"
                style={{ overflowY: "hidden" }}
              >
                <MedicationDetail />
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 pr-lg-3 pr-md-3 mt-3 mb-3">
              <div
                className="widget-border border-0 p-2"
                style={{ overflowY: "hidden" }}
              >
                <AllergiesDetail
                  status={this.state.status}
                  testCheck=""
                  patientNotesID={this.props.match.params.id}
                  patientID={this.props.location.query.patientID}
                />
              </div>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 mb-lg-0 mb-md-0">
                  <div
                    className="widget-border border-0 px-1"
                    style={{ overflowY: "hidden" }}
                  >
                    <SocialDetail />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 pr-lg-3 pl-lg-3 pl-md-0 mt-lg-3 ">
                  <div
                    className="widget-border border-0 px-1"
                    style={{ overflowY: "hidden" }}
                  >
                    <FamilyDetail />
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

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(DetailedNotes)
);

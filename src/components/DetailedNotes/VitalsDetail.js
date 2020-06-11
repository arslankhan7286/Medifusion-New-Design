import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import { eo } from "date-fns/locale";

class VitalsDetail extends Component {
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
      readOnly: false,
      disabled: false,
      status: this.props.status,
    };
  }
  saveData = () => {
    let Model = this.state.vitals;
    axios
      .post(this.url + `SavePatientVitals`, Model, this.config)
      .then((response) => {
        if (
          response.data == null ||
          response.data == "" ||
          response.data.id <= 0 ||
          response.data == []
        ) {
          this.setState({ readOnly: true, disabled: true });
        } else {
          this.setState({ vitals: response.data, readOnly: false });
          Swal.fire("Record Saved Successfully", "", "success");
        }
      })
      .catch((error) => error);
  };
  changeHandler = (e) => {
    let array = this.state.vitals;
    array[e.target.name] = e.target.value;
    this.setState({
      vitals: array,
    });
  };
  editHandler = () => {
    if (this.state.status) {
      this.setState({ readOnly: false });
    } else {
      this.setState({ readOnly: true });
    }
  };
  cancelHandler = () => {
    if (this.state.status) {
      this.setState({ readOnly: true });
    } else {
      this.setState({ readOnly: false });
    }
  };
  async componentDidMount() {
    let Model;
    await axios
      .get(
        this.url +
          `PatientVitals?patientId=${this.props.patientID}&patientNotesId=${this.props.patientNotesID}`,
        this.config
      )
      .then((response) => {
        Model = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("detail Model", Model);
    if (Model == null || Model == "" || Model.id <= 0 || Model == []) {
      Model = {
        ID: 0,
        patientId: this.props.patientID,
        PatientNotesId: this.props.patientNotesID,
        height_foot: "",
        height_inch: "",
        weight_lbs: "",
        weight_pounds: "",
        bmi: "",
        bpSystolic: "",
        bpDiastolic: "",
        temperature: "",
        pulse: "",
        respiratory_rate: "",
        oxygenSaturation: "",
        pain: "",
        headCircumference: "",
        practiceID: 0,
        inactive: false,
        addedBy: "",
        addedDate: "",
        updatedBy: "",
        updatedDate: "",
      };
    }
    this.setState({ vitals: Model });
  }
  render() {
    return (
      <div className="vitals-detail">
        <div className="row">
          <div className="col-12 ">
            <div>
              <label
                className="widget-heading"
                style={{
                  cursor: "pointer",
                  width: "100%",
                }}
                onClick={this.editHandler}
              >
                Vitals
                <i
                  class="fas fa-edit text-white ml-3"
                  onClick={this.editHandler}
                ></i>
              </label>
            </div>
          </div>
        </div>
        <div className="info">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Height (cm)</label>
                <input
                  type="number"
                  name=" height_cm"
                  onChange={this.changeHandler}
                  value={this.state.vitals.height_cm}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                  autofocus="true"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Height (ft)</label>
                <input
                  type="number"
                  name="height_foot"
                  onChange={this.changeHandler}
                  value={this.state.vitals.height_cm / 30.48}
                  size="4"
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                  autofocus="true"
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">BMI(kg/m2)</label>
                <input
                  type="number"
                  name="bmi"
                  onChange={this.changeHandler}
                  value={this.state.vitals.bmi}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Pain</label>
                <input
                  type="number"
                  name="pain"
                  onChange={this.changeHandler}
                  value={this.state.vitals.pain}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Weight (oz)</label>
                <input
                  type="number"
                  name="weight_pounds"
                  onChange={this.changeHandler}
                  value={this.state.vitals.weight_pounds}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Weight (lbs)</label>
                <input
                  type="number"
                  name="weight_lbs"
                  onChange={this.changeHandler}
                  value={this.state.vitals.weight_pounds / 16}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Temperature (f)</label>
                <input
                  type="number"
                  name="temperature"
                  onChange={this.changeHandler}
                  value={this.state.vitals.temperature}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Pulse (bpm)</label>
                <input
                  type="number"
                  name="pulse"
                  onChange={this.changeHandler}
                  value={this.state.vitals.pulse}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Respiratory Rate</label>
                <input
                  type="number"
                  name="respiratory_rate"
                  onChange={this.changeHandler}
                  value={this.state.vitals.respiratory_rate}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Oxygen Saturation</label>
                <input
                  type="number"
                  name="oxygenSaturation"
                  onChange={this.changeHandler}
                  value={this.state.vitals.oxygenSaturation}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3 ">B.P (mmHg)</label>
                <input
                  type="number"
                  name="bpSystolic"
                  onChange={this.changeHandler}
                  value={this.state.vitals.bpSystolic}
                  className="systolic"
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                    width: "17%",
                    marginRight: "5px",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
                /
                <input
                  type="number"
                  name="bpDiastolic"
                  onChange={this.changeHandler}
                  value={this.state.vitals.bpDiastolic}
                  className="dystolic"
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                    width: "17%",
                    marginLeft: "5px",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-3 mb-2">
                <label className="mr-3">Head Circumference</label>
                <input
                  type="number"
                  name="headCircumference"
                  onChange={this.changeHandler}
                  value={this.state.vitals.headCircumference}
                  style={{
                    background: this.state.readOnly ? "" : "#f1f1f1",
                    border: "0px",
                    outline: "none",
                  }}
                  readOnly={this.state.readOnly ? false : true}
                />
              </div>
              <div className="col-lg-12 text-center">
                {this.state.readOnly ? (
                  <div>
                    <input
                      type="button"
                      className="btn-blue"
                      value="Save"
                      onClick={this.saveData}
                      disabled={this.state.disabled ? true : false}
                    />
                    <input
                      type="button"
                      className="btn-grey"
                      value="Cancel"
                      onClick={this.cancelHandler}
                    />
                  </div>
                ) : null}
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

export default connect(mapStateToProps, matchDispatchToProps)(VitalsDetail);

import React, { Component } from "react";
import "./ScheduleVital.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import GifLoader from "react-gif-loader";
import Eclips from "../../../images/loading_spinner.gif";
import Swal from "sweetalert2";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../../actions/LoginAction";
import { eo } from "date-fns/locale";

class Schedulevital extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PatientNotes/";
    this.counter = 0;
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.state = {
      unit: "cm",
      value: null,
      weightUnit: "lbs",
      weightValue: null,
      show: false,
      modal: false,
      vitalsData: [],
      loading: true,
      Model: [],
      selectModel: null,
    };
  }
  modalToggle = () => this.setState({ modal: !this.state.modal });

  toggle = (id) => {
    if (id === this.props.vitalProps.id) {
      this.setState({
        unit: this.state.unit === "ft" ? "cm" : "ft",
      });
    }
  };
  weightToggle = (id) => {
    console.log("weight id", id);
    if (id === this.props.vitalProps.id) {
      this.setState({
        weightUnit: this.state.weightUnit === "lbs" ? "oz" : "lbs",
      });
    }
  };
  change = (e) => {
    this.setState({ value: e.target.value });
  };
  weightHandler = (e) => {
    this.setState({ weightValue: e.target.value });
  };
  display = () => {
    this.setState({ show: true });
  };
  viewToggle = () => {
    this.setState({ viewModal: !this.state.viewModal });
  };
  saveVitals = () => {
    // if(this.counter == 1) return;
    this.counter = 1;
    let Model = this.state.selectModel;
    console.log("save response before", Model);
    axios
      .post(this.url + `SavePatientVitals`, Model, this.config)
      .then((response) => {
        if (response.data.id > 0) {
          this.counter = 0;
          Swal.fire("Record Saved Successfully", "", "success");
          console.log("save response after", response.data);
        } else {
          Swal.fire("Something Went Wrong", "", "error");
        }
      })
      .catch((error) => error, this.setState({ disabled: false }));
  };
  changeHandler = (e) => {
    let array = this.state.selectModel;
    array[e.target.name] = e.target.value;
    this.setState({
      selectModel: array,
    });
  };
  async componentDidMount() {
    await this.setState({ loading: true });
    console.log("props", this.props);
    let Model = [];
    await axios
      .get(
        this.url + `PatientVitals?patientId=${this.props.vitalProps.patientID}`,
        this.config
      )
      .then((response) => (Model = response.data))
      .catch((error) => error);

    console.log("responseseeeeeeeeee", Model);
    let vitalsEditable = false;
    if (Model !== null && Model.length > 0) {
      Model.map((item) => {
        if (item.appointmentID === this.props.vitalProps.id) {
          console.log("matched");
          this.setState({ selectModel: item });
          vitalsEditable = true;
        }
      });
      console.log("Not matched");
      this.setState({ vitalsData: Model, loading: false });
    }
    if (!vitalsEditable) {
      console.log("enterrrr");
      let Model1 = {
        ID: 0,
        patientId: this.props.vitalProps.patientID,
        appointmentID: this.props.vitalProps.id,
        dos: this.props.vitalProps.appointmentDate,
        LocationID: this.props.vitalProps.locationID,
        ProviderID: this.props.vitalProps.providerID,
        PatientID: this.props.vitalProps.patientID,
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
      Model.push(Model1);
      this.setState({
        selectModel: Model1,
        vitalsData: Model,
        loading: false,
      });
    }

    console.log("responseseeeeeeeeee2222222", this.state.selectModel);
  }
  render() {
    var tempDate = new Date();
    var date =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    const currDate = date;
    const closeBtn = (
      <button className="close" onClick={this.viewToggle}>
        &times;
      </button>
    );
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }
    return (
      <div className="ScheduleVital">
        {spiner}
        <div className="row">
          {/* <div className="col-lg-12 text-right">
            <button className="view">View Previous Dates</button>
          </div> */}
          <div className="col-lg-2">
            <ul className="list-unstyled ScheduleLeft-list">
              <li id="first1" name="Height (cm)">
                <a href="#">Height (cm)</a>
              </li>
              <li>
                <a href="#">Weight (lbs)</a>
              </li>
              <li>
                <a href="#">Weight (pounds)</a>
              </li>
              <li>
                <a href="#">BMI (kg/m2)</a>
              </li>
              <li>
                <a href="#">Temperature (f)</a>
              </li>
              <li>
                <a href="#">Pulse (bpm)</a>
              </li>
              <li>
                <a href="#">Respiratory Rate (rpm)</a>
              </li>
              <li>
                <a href="#">Oxygen Saturation (%)</a>
              </li>
              <li>
                <a href="#">Pain (1-10)</a>
              </li>
              <li>
                <a href="#">Head Circumference</a>
              </li>
            </ul>
          </div>
          {this.state.vitalsData.map((item) => (
            <div className="col-lg-2">
              <label className=" ScheduleVital-heading">{item.dos}</label>
              <div className="position-relative">
                <input
                  type="text"
                  // name="height_cm"
                  onChange={this.changeHandler}
                  name="height_cm"
                  value={
                    item.appointmentID === this.props.vitalProps.id &&
                    this.state.unit === "cm"
                      ? item.height_cm
                      : item.appointmentID === this.props.vitalProps.id &&
                        this.state.unit === "ft"
                      ? (item.height_cm / 30.48).toFixed(2)
                      : item.appointmentID !== this.props.vitalProps.id
                      ? item.height_cm
                      : null
                  }
                  disabled={
                    item.appointmentID === this.props.vitalProps.id
                      ? false
                      : true
                  }
                />
                <span
                  className="text-dark text-right"
                  style={{
                    position: "absolute",
                    background: "#dbd7d8",
                    top: "1px",
                    right: "1px",
                    width: "40px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.appointmentID === this.props.vitalProps.id
                    ? this.state.unit
                    : "cm"}
                  <i
                    class="fas fa-sort ml-1"
                    onClick={() => this.toggle(item.appointmentID)}
                    style={{ color: "#d7526d" }}
                  ></i>
                </span>
              </div>
              <div className="position-relative">
                <input
                  type="number"
                  name="weight_lbs"
                  onChange={this.changeHandler}
                  value={
                    item.appointmentID === this.props.vitalProps.id &&
                    this.state.weightUnit === "oz"
                      ? (item.weight_lbs / 16).toFixed(2)
                      : item.weight_lbs
                  }
                  disabled={
                    item.appointmentID === this.props.vitalProps.id
                      ? false
                      : true
                  }
                />
                <span
                  className="text-dark text-right"
                  style={{
                    position: "absolute",
                    background: "#dbd7d8",
                    top: "1px",
                    right: "1px",
                    width: "40px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.appointmentID === this.props.vitalProps.id
                    ? this.state.weightUnit
                    : "lbs"}
                  <i
                    class="fas fa-sort ml-1 "
                    onClick={() => this.weightToggle(item.appointmentID)}
                    style={{ color: "#d7526d" }}
                  ></i>
                </span>
              </div>
              <input
                type="number"
                name="weight_pounds"
                onChange={this.changeHandler}
                value={item.weight_pounds}
                disabled={
                  item.appointmentID === this.props.vitalProps.id ? false : true
                }
              />
              <input
                type="number"
                name="bmi"
                onChange={this.changeHandler}
                value={item.bmi}
                disabled={
                  item.appointmentID === this.props.vitalProps.id ? false : true
                }
              />
              <input
                type="number"
                onChange={this.changeHandler}
                name="temperature"
                value={item.temperature}
                disabled={
                  item.appointmentID === this.props.vitalProps.id ? false : true
                }
              />
              <input
                type="number"
                onChange={this.changeHandler}
                name="pulse"
                value={item.pulse}
                disabled={
                  item.appointmentID === this.props.vitalProps.id ? false : true
                }
              />
              <input
                type="number"
                onChange={this.changeHandler}
                name="respiratory_rate"
                value={item.respiratory_rate}
                disabled={
                  item.appointmentID === this.props.vitalProps.id ? false : true
                }
              />
              <input
                type="number"
                onChange={this.changeHandler}
                name="oxygenSaturation"
                value={item.oxygenSaturation}
                disabled={
                  item.appointmentID === this.props.vitalProps.id ? false : true
                }
              />
              <input
                type="number"
                onChange={this.changeHandler}
                name="pain"
                value={item.pain}
                disabled={
                  item.appointmentID === this.props.vitalProps.id ? false : true
                }
              />
              <input
                type="number"
                onChange={this.changeHandler}
                name="headCircumference"
                value={item.headCircumference}
                disabled={
                  item.appointmentID === this.props.vitalProps.id ? false : true
                }
              />
              <i
                class="fas fa-bars toggle"
                onClick={this.modalToggle}
                style={{
                  position: "absolute",
                  bottom: "8px",
                  border: "1px solid #4f8094",
                  borderRadius: "100%",
                  fontSize: "12px",
                  padding: "3px 4px",
                }}
              ></i>
                <Modal
                  isOpen={this.state.modal}
                  fade={false}
                  toggle={this.modalToggle}
                  // className={this.className}
                >
                  <ModalBody>
                    <div>
                      <span className=" pop-up right-content text-white px-3 py-1">
                        Systolic Diastolic
                      </span>
                      <div className="pop-up p-1 mt-2">
                        <div className="right-content p-2 mb-2">
                          <div className="bg-white p-3">
                            {this.state.vitalsData.map((item) => {
                              return (
                                <div className="mb-2">
                                  <label className="mr-2">BP 1 mmHg:</label>
                                  <input
                                    type="text"
                                    onChange={this.changeHandler}
                                    name="bpSystolic"
                                    className="mr-1"
                                    value={item.bpSystolic}
                                    disabled={
                                      item.appointmentID ===
                                      this.props.vitalProps.id
                                        ? false
                                        : true
                                    }
                                  />
                                  /
                                  <input
                                    type="text"
                                    name="bpDiastolic"
                                    onChange={this.changeHandler}
                                    className="ml-1"
                                    value={item.bpDiastolic}
                                    disabled={
                                      item.appointmentID ===
                                      this.props.vitalProps.id
                                        ? false
                                        : true
                                    }
                                  />
                                  <button className="mx-lg-2 mx-md-2 mx-sm-2 ml-0 mr-2 sitting">
                                    Sitting
                                  </button>
                                  <button className="mr-2 standing">
                                    Standing
                                  </button>
                                  <button className=" supine">Supine</button>
                                  <select
                                    className="ml-lg-2 ml-md-2 ml-sm-2 ml-0 mt-2"
                                    disabled={
                                      item.appointmentID ===
                                      this.props.vitalProps.id
                                        ? false
                                        : true
                                    }
                                  >
                                    <option>Arm</option>
                                    <option>Arm</option>
                                    <option>Arm</option>
                                    <option>Arm</option>
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <div className="row-btn w-100">
                      <input
                        className="btn-grey mr-1"
                        onClick={this.modalToggle}
                        value="Cancel"
                        type="button"
                      />
                      <input
                        className="btn-blue ml-2"
                        onClick={this.saveVitals}
                        value="Save"
                        type="button"
                      />
                    </div>
                  </ModalFooter>
                </Modal>
              </div>
          ))}
          <div className="text-center float-left w-100">
            <input
              className="btn-blue mt-2"
              onClick={this.saveVitals}
              type="button"
              value="Save"
              disabled={this.counter == 1 ? true : false}
            />
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

export default connect(mapStateToProps, matchDispatchToProps)(Schedulevital);

import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";
import { eo } from "date-fns/locale";
import Swal from "sweetalert2";

class Allergies extends Component {
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
      readOnly: true,
      status: this.props.status,
      testing: true,
      // testing: this.props.testCheck,
      allergies: [],
    };
  }

  editorHandler = () => {
    if (this.state.status) {
      this.setState({ readOnly: true });
    } else {
      this.setState({ readOnly: false });
    }
    this.setState({testing: true})
  };
  cancelHandler = () => {
    if (this.state.status) {
      this.setState({ readOnly: false });
    } else {
      this.setState({ readOnly: true });
    }
  };
  changeHandler = (e) => {
    let array = this.state.allergies;
    array[e.target.name] = e.target.value;
    this.setState({
      allergies: array,
    });
  };
  saveData = (e) => {
    e.preventDefault();
    let Model = this.state.allergies;
    console.log("Save Model", Model);
    axios
      .post(this.url + `SavePatientAllergy`, Model, this.config)
      .then((response) => {
        console.log("Save Allergy response", response.data);
        if (
          response.data == null ||
          response.data == "" ||
          response.data.id <= 0 ||
          response.data == []
        ) {
          this.setState({ readOnly: true, disabled: true });
        } else {
          this.setState({ allergies: response.data, readOnly: false });
          Swal.fire("Record Saved Successfully", "", "success");
        }
      })
      .catch((error) => error);
  };
  async componentDidMount() {
    console.log("Allergies props", this.props);
    let Model;
    await axios
      .get(
        this.url +
          `GetPatientAllergy?patientId=${this.props.patientID}&patientNotesId=${this.props.patientNotesID}`,
        this.config
      )
      .then((response) => {
        console.log("Get Allergies Response", response);
        Model = response.data;
        
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("Allergies detail Model before", Model);
    if (
      Model == null ||
      Model == "" ||
      Model.id <= 0 ||
      Model == [] ||
      Model == "undefined"
    ) {
      Model = {
        ID: 0,
        patientId: this.props.patientID,
        PatientNotesId: this.props.patientNotesID,
        allergyType: "",
        specificDrugAllergy: "",
        reaction: "",
        severity: "",
        status: "",
        notes: "",
        practiceID: 2.0,
        inactive: false,
        addedBy: "",
        addedDate: "",
        updatedBy: "",
        updatedDate: null,
      };
      this.setState({ testing: false });
    }
    console.log("Allergies detail Model after", Model);
    this.setState({ allergies: Model, testing: true });
  }
  render() {
    console.log("Allergies State", this.state.allergies);
    return (
      <div className="allergies">
        <div className="row">
          <div className="col-12 mb-3 ">
            <span href="#" className="widget-heading">
              Allergies
              <i
                class="fas fa-edit text-white ml-3"
                onClick={this.editorHandler}
              ></i>
            </span>
          </div>
        </div>
        {this.state.testing ? (
          <form>
            <div className="row">
              <div className="col-lg-4 mb-2">
                <label>Allergy Type:</label>
                <select
                  placeholder="Specific Drug Allergy"
                  disabled={this.state.readOnly ? true : false}
                  style={{ background: this.state.readOnly ? "" : "#fff" }}
                  name="allergyType"
                  onChange={this.changeHandler}
                  value={this.state.allergies.allergyType}
                >
                  <option>bellMedex 1</option>
                  <option>bellMedex 2</option>
                </select>
              </div>
              <div className="col-lg-4 mb-2">
                <label>Specific Drug Allergy:</label>
                <input
                  type="text"
                  placeholder="d00206 Medidex"
                  readOnly={this.state.readOnly ? true : false}
                  value={this.state.allergies.specificDrugAllergy}
                  name="specificDrugAllergy"
                  onChange={this.changeHandler}
                  style={{
                    background: this.state.readOnly ? "#f1f1f1" : "",
                    border: "0px",
                    outline: "none",
                  }}
                />
              </div>
              <div className="col-lg-4 mb-2">
                <label>Reaction:</label>
                <select
                  placeholder="Nasal Congestion"
                  disabled={this.state.readOnly ? true : false}
                  style={{ background: this.state.readOnly ? "" : "#fff" }}
                  name="reaction"
                  value={this.state.allergies.reaction}
                  onChange={this.changeHandler}
                >
                  <option>Reaction 1</option>
                  <option>Reaction 2</option>
                </select>
              </div>
              <div className="col-lg-4 mb-2">
                <label>Severity:</label>
                <select
                  placeholder="Moderate"
                  disabled={this.state.readOnly ? true : false}
                  style={{ background: this.state.readOnly ? "" : "#fff" }}
                  name="severity"
                  value={this.state.allergies.severity}
                  onChange={this.changeHandler}
                >
                  <option>Severity 1</option>
                  <option>Severity 2</option>
                </select>
              </div>
              <div className="col-lg-4 offset- 4 mb-2">
                <label>Status:</label>
                <select
                  placeholder="Active"
                  disabled={this.state.readOnly ? true : false}
                  style={{ background: this.state.readOnly ? "" : "#fff" }}
                  name="status"
                  value={this.state.allergies.status}
                  onChange={this.changeHandler}
                >
                  <option>Active</option>
                  <option>Disable</option>
                </select>
              </div>
              <div className="col-lg-12 note">
                <label>Note:</label>
                <textarea
                  disabled={this.state.readOnly ? true : false}
                  style={{ background: this.state.readOnly ? "" : "#fff" }}
                  value={this.state.allergies.notes}
                  name="notes"
                  onChange={this.changeHandler}
                />
              </div>
              <div className="col-lg-12 text-center">
                {!this.state.readOnly ? (
                  <div>
                    <input
                      type="button"
                      className="btn-blue"
                      value="Save"
                      onClick={this.saveData}
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
          </form>
        ) : (
          "No Allergies Found !"
        )}
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

export default connect(mapStateToProps, matchDispatchToProps)(Allergies);

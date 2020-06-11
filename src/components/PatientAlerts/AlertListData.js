import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import AddPatientAlert from "./AddPatientAlert";

// Api call links
import $ from "jquery";
import axios from "axios";
import Swal from "sweetalert2";

// CSS links
import styles from "./AlertListData.module.css";
import "./AlertListData.css";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginAction } from "../../actions/LoginAction";

class AlertListData extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/PatientAlerts/";

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.saveModel = {
      ID: 0,
      patientID: "1",
      type: "test",
      date: "",
      assignedTo: "",
      resolvedDate: "",
      resolveComments: "",
      notes: "testing 1 2 3",
      practiceId: "",
      inactive: "",
      AddedDate: "",
      AddedBy: "",
      UpdatedDate: "",
      UpdatedBy: "",
    };

    this.state = {
      showDiv: this.props.showResolve,
      // patientName : this.props.Alert.patientName,
      // type : this.props.Alert.type,
      // date : this.props.Alert.date,
      // assignedTo : this.props.Alert.assignedTo,
      // notes : this.props.Alert.notes,
      saveModel: this.saveModel,
      list: [],
      openAddPatientAlert: false,
      Alert: this.props.Alert,
    };
    this.saveData = this.saveData.bind(this);
    this.showDiv = this.showDiv.bind(this);
    this.editAlert = this.editAlert.bind(this);
  }

  showDiv = (event) => {
    this.setState({
      showDiv: !this.state.showDiv,
    });
  };

  toggle = () => {
    let hide = this.state.showDiv;
    this.setState({
      showDiv: !hide,
    });
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      saveModel: {
        ...this.state.saveModel,
        [event.target.name]: event.target.value.toUpperCase(),
        ID: this.props.Alert.id,
      },
    });
  };

  saveData = () => {
    if (
      this.state.saveModel.resolveComments == "" ||
      this.state.saveModel.resolveComments == null
    ) {
      Swal.fire("Fill Resolve Comments", "", "error");
      $("#btnCancel").click();
    } else {
      axios
        .post(
          this.url + "ResolvePatientAlerts",
          this.state.saveModel,
          this.config
        )
        .then((response) => {
          console.log("Add Patient Alert Response Data :::: ", response);
          Swal.fire("Record Saved Successfully", "", "success");
          $("#btnCancel").click();
          this.setState({
            showDiv: !this.state.showDiv,
          });
        })
        .catch((error) => {
          console.log("Error Here.....", error);
        });

      if (this.props.callingFrom == "ResolvedComments") {
        this.props.callBack();
      }

      // axios.get(this.url+ "PatientAlerts", this.config)
      // .then(response => {
      //   console.log("PatientAlerts Response : " ,response.data)
      //   this.setState({
      //     list: response.data,
      //   });
      // })

      // .catch(error => {

      //   console.log(error);
      // });
    }
  };

  getCurrentDate = () => {
    var tempDate = new Date();
    var date =
      tempDate.getMonth() +
      1 +
      "/" +
      tempDate.getDate() +
      "/" +
      tempDate.getFullYear() +
      " " +
      tempDate.getHours() +
      ":" +
      tempDate.getMinutes() +
      ":" +
      tempDate.getSeconds();

    const currDate = "Resolved Date : " + date;
    return <p>{currDate}</p>;
  };

  editAlert = (slectedData) => {
    this.setState({
      openAddPatientAlert: true,
      Alert: slectedData,
    });
  };
  callBackAlertListData = () => {
    this.setState({
      openAddPatientAlert: false,
    });
  };

  render() {
    let curruntUserEmail = this.props.userInfo1.email;

    let resolveComments = "";
    if (this.state.showDiv) {
      console.log(this.state.showDiv);
      resolveComments = (
        <div>
          <div className="row">
            <div className="col-lg-12">
              <span>
                <strong>Resolved By : </strong>
                {curruntUserEmail}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12  mt-2 mb-2 text-center">
              <textarea
                name="resolveComments"
                id="resolveComments"
                value={
                  this.state.saveModel.resolveComments
                    ? this.state.saveModel.resolveComments
                    : null
                }
                style={{ border: "2px solid #186790", width: "100%" }}
                onChange={this.handleChange}
              ></textarea>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div>
                <span>
                  <strong>{this.getCurrentDate()}</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-center mt-2 mb-2">
              <div style={{ float: "left", width: "100%" }}>
                <button className={styles.CancelButton} onClick={this.toggle}>
                  Close
                </button>
                <button className={styles.SaveButton} onClick={this.saveData}>
                  Save
                </button>
              </div>
            </div>
          </div>
          <hr
            style={{
              color: "#186790",
              backgroundColor: "#186790",
              height: "2px",
              borderColor: "2px solid #186790",
            }}
          />
        </div>
      );
    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-2 text-center">
              <div
                style={{
                  background: "#186790",
                  borderRadius: "50%",
                  width: "70px",
                  height: "70px",
                  color: "white",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <strong style={{ fontSize: "20px" }}>PN</strong>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-6">
                  <span
                    style={{ color: "#186790" }}
                    onDoubleClick={() => this.editAlert(this.state.Alert)}
                  >
                    {this.state.Alert.patientName}
                  </span>
                </div>
                <div className="col-lg-6">
                  <span style={{ color: "#186790", margin: "0px" }}>
                    {this.state.Alert.alertDate}
                  </span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-lg-12">
                  <span>
                    <strong>Assigned To :</strong>
                  </span>
                  <span style={{ marginLeft: "10px" }}>
                    {this.state.Alert.assignedTo}
                  </span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-lg-12">
                  <span>
                    <strong> Type :</strong>
                  </span>
                  <span style={{ marginLeft: "10px" }}>
                    {this.state.Alert.type}
                  </span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-lg-12">
                  {/* <label>Notes :</label>   */}
                  {/* <textarea className = "textArea"
                          name="" id=""  readOnly = "true" >
                          {this.state.notes}
                          </textarea> */}

                  <span
                    style={{
                      float: "left",
                      overflow: "hidden",
                      height: "20px",
                    }}
                    name=""
                    id=""
                    readOnly="true"
                    data-tip={this.state.Alert.notes}
                  >
                    <label style={{ fontWeight: "bold" }}>Notes :</label>{" "}
                    {this.state.Alert.notes}
                  </span>
                  <ReactTooltip />
                  {/* <span style = {{height : "100px" , overflow : "hidden"}}>
                              {this.state.notes}
                           </span> */}
                </div>
              </div>
            </div>
            <div className="col-lg-2">
              <input
                type="button"
                value="Resolve"
                onClick={this.showDiv}
                className={
                  this.state.showDiv
                    ? styles.afterResolve
                    : styles.beforeResolve
                }
              ></input>
            </div>
          </div>
        </div>
        <hr
          style={{
            color: "#186790",
            backgroundColor: "#186790",
            height: "2px",
            borderColor: "2px solid #186790",
          }}
        />

        {resolveComments}

        {this.state.openAddPatientAlert ? (
          <AddPatientAlert
            open={true}
            callingFrom="AlertListData"
            AlertListData={this.state.Alert}
            callBack={this.callBackAlertListData}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { token: "", isLogin: false },
    userInfo1:
      state.loginInfo != null
        ? state.loginInfo
        : { userPractices: [], email: ",", practiceID: null },
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

export default connect(mapStateToProps, matchDispatchToProps)(AlertListData);

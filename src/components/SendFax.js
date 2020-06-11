import React, { Component } from "react";
import { MDBDataTable, MDBBtn, MDBInput } from "mdbreact";
import axios from "axios";
import { isNullOrUndefined } from "util";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Input from "./Input";
import Swal from "sweetalert2";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class SendFax extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/FAX/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.faxModel = {
      pcp: "",
      patientName: this.props.faxModel.patientName,
      patientDOB: this.props.faxModel.patientDOB,
      serviceName: this.props.faxModel.serviceName,
      provider: "",
      faxNumber: this.props.faxModel.faxNumber,
      pCBProviderID: this.props.faxModel.pcpproviderid,
      providerID: this.props.faxModel.providerid,
      referralDocumentFileName: this.props.faxModel.referralDocumentFileName,
    };

    this.state = {
      faxModel: this.faxModel,
      data: [],
      popupName: "",
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendFax = this.sendFax.bind(this);
  }

  handleChange(event) {
    console.log(event.target.name, event.target.value);
    this.setState({
      faxModel: {
        ...this.state.faxModel,
        [event.target.name]: event.target.value,
      },
    });
  }

  sendFax() {
    console.log(this.state.faxModel);
    this.setState({ loading: true });
    axios
      .post(this.url + "SendFax", this.state.faxModel, this.config)
      .then((response) => {
        Swal.fire("Record Saved Successfully", "", "success");

        this.setState({ loading: false });
        this.sendFaxCount = 0;
      })
      .catch((error) => {
        this.sendFaxCount = 0;

        this.setState({ loading: false });
        try {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 401) {
                Swal.fire("Unauthorized Access", "", "error");
                return;
              } else if (error.response.status == 404) {
                Swal.fire("Not Found", "Failed With Status Code 404", "error");
                return;
              } else if (error.response.status == 400) {
                Swal.fire("Something Wrong", error.response.data, "error");
                return;
              }
            }
          } else {
            Swal.fire("Something Wrong", "Please Try Again", "error");
            return;
          }
        } catch {}
      });
  }

  render() {
    console.log("Fax Model as props", this.props.faxModel);
    console.log("Providers as Props", this.props.userProviders);
    console.log("Service Name", this.props.referralFor);

    const referralFor = [
      { value: "", display: "Please Select" },
      {
        value: "Most Recent Wellness Visit",
        display: "MOST RECENT WELLNESS VISIT",
      },
      {
        value: "Medical Clearance for Speech Therapy",
        display: "MEDICAL CLEARANCE FOR SPEECH THERAPY",
      },
      {
        value: "Medical Clearance for Hearing Aids",
        display: "MEDICAL CLEARANCE FOR HEARING AIDS",
      },
      {
        value: "Most Recent Audiological Evaluation",
        display: "MOST RECENT AUDIOLOGICAL EVALUATION",
      },
      {
        value: "Dizziness/Balance Testing",
        display: "DIZZINESS/BALANCE TESTING",
      },
      {
        value: "Most Recent Speech Language Evaluation",
        display: "MOST RECENT SPEECH LANGUAGE EVALUATION",
      },
      {
        value: "Auditory Brainstem Response Results",
        display: "AUDITORY BRAINSTEM RESPONSE RESULTS",
      },
    ];

    var dob = this.state.faxModel.patientDOB
      ? this.state.faxModel.patientDOB.slice(0, 10)
      : "";
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            imageStyle={{ marginTop: "20%", width: "100px", height: "100px" }}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="clientModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "200px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>Send Fax</h3>

                      <div class="float-lg-right text-right">
                        <button
                          class="close"
                          type="button"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span
                            aria-hidden="true"
                            onClick={() => this.props.onClose()}
                          >
                            ×
                          </span>
                        </button>
                      </div>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>

                    {/* Main Content */}
                    <div class="row">
                  <div class="col-md-12 col-sm-12 mt-1 provider-form ">

                    <div class="row">
                      <div class="col-md-12 m-0 p-0 float-right">
                        <div class="row">
                          <div class="col-md-4 mb-4 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="Account">
                                Patient Name
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 pl-1 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" Patient Name"
                                value={this.state.faxModel.patientName}
                                disabled={true}
                                name="patientName"
                                id="patientName"
                                max="60"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.checkNumberValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-4 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="mm/dd/yyyy">
                                Patient DOB
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 pl-0 p-0 m-0 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                type="date"
                                min="1900-01-01"
                                max="9999-12-31"
                                name="patientDOB"
                                min="1900-01-01"
                                max="9999-12-31"
                                disabled={true}
                                value={dob}
                                onChange={this.handleAuthChange}
                              />
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                          <div class="col-md-4 mb-4 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Provider
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 pl-0 p-0 m-0 float-left">
                              <select
                                 class="provider-form w-100 form-control-user"
                                name="providerID"
                                id="providerID"
                                disabled={true}
                                value={this.state.faxModel.providerID}
                                onChange={this.handleChange}
                              >
                                {this.props.userProviders.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.checkAmountValField} */}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-4 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Service Name
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 pl-0 p-0 m-0 float-left">
                              <select
                                class="provider-form w-100 form-control-user"
                                name="serviceName"
                                id="serviceName"
                                disabled={true}
                                value={this.state.faxModel.serviceName}
                                onChange={this.handleChange}
                              >
                                {this.props.referralFor.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.checkAmountValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-4 col-sm-4">
                            <div class="col-md-4 pr-1 float-left">
                              <label for="Account">
                                Fax Number
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 pl-1 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" Fax Number"
                                value={this.state.faxModel.faxNumber}
                                name="faxNumber"
                                id="faxNumber"
                                max="60"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.checkNumberValField} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
</div>
</div>
                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.sendFax}
                      >
                        Send
                      </button>

                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={
                          this.props.onClose
                            ? () => this.props.onClose()
                            : () => this.props.onClose()
                        }
                      >
                        Cancel
                      </button>
                    </div>

                    {/* End of Main Content */}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
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
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
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
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(SendFax);

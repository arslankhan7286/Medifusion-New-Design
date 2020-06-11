import React, { Component } from "react";
import Label from "./Label";
import Input from "./Input";
import axios from "axios";
import { MDBDataTable, MDBBtn, MDBInput } from "mdbreact";
import GridHeading from "./GridHeading";
import ElectronicSubmissionModel from "./ElectronicSubmissionModel";
import $ from "jquery";
import Swal from "sweetalert2";
import { isNullOrUndefined } from "util";
import GPopup from "./GPopup";
import moment from "moment";

import { withRouter } from "react-router-dom";

import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";

import GifLoader from "react-gif-loader";
import Eclips from "../images/loading_spinner.gif";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import NewInsurancePlan from "./NewInsurancePlan";

export class ElectronicSubmission extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/ElectronicSubmission/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.electModel = {
      receiverID: "",
      accountNum: "",
      visitID: null,
      practice: "",
      provider: "",
      planName: "",
      payerID: "",
      location: "",
      status: "",
      entryDateFrom: "",
      entryDateTo: "",
    };

    this.submitModel = {
      receiverID: 0,
      clientID: 1,
      SubmissionLogID: 0,
      visits: [],
    };

    this.display = "Record displaying Submit Successfully";

    this.validationModel = {
      EntryDateToGreaterValField: null,
      selectEntryFromValField: null,
      entryDateFromValField: "",
      entryDateToValField: "",
      validation: false,
    };

    this.state = {
      electModel: this.electModel,
      submitModel: this.submitModel,
      validationModel: this.validationModel,
      data: [],
      initialData: [],
      revData: [],
      ischeck: {},
      id: 0,
      checked: [],
      output: {},
      popupName: "",
      showPopup: false,
      showPracticePopup: false,
      showLocationPopup: false,
      showProviderPopup: false,
      patientPopup: false,
      visitPopup: false,
      loading: false,
    };

    this.selectedVisits = [];
    this.searchElectronicSub = this.searchElectronicSub.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.submitCheckedVisits = this.submitCheckedVisits.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
    this.isChecked = this.isChecked.bind(this);
    this.selectALL = this.selectALL.bind(this);
    this.openPatientPopup = this.openPatientPopup.bind(this);
    this.opensubmitPlanPopup = this.opensubmitPlanPopup.bind(this);
    this.closePatientPopup = this.closePatientPopup.bind(this);
    this.closesubmitPlanPopup = this.closesubmitPlanPopup.bind(this);
    this.openVisitPopup = this.openVisitPopup.bind(this);
    this.closeVisitPopUp = this.closeVisitPopUp.bind(this);
  }

  async componentWillMount() {
    if (this.props.receivers.length === 0) {
      await axios
        .get(this.url + "GetProfiles", this.config)
        .then(async (response) => {
          await this.setState({
            revData: response.data.receivers,
            electModel: {
              ...this.setState.electModel,
              receiverID:
                response.data.receivers.length == 2
                  ? response.data.receivers[1].id
                  : null,
              // accountNUm:this.props.match.params.id ?this.props.match.params.id:null
            },
            submitModel: {
              ...this.setState.submitModel,
              receiverID:
                response.data.receivers.length == 2
                  ? response.data.receivers[1].id
                  : null,
            },
          });
        })
        .catch((error) => {});
    } else {
      await this.setState({
        revData: this.props.receivers,
        electModel: {
          ...this.setState.electModel,
          receiverID:
            this.props.receivers.length == 2
              ? this.props.receivers[1].id
              : null,
        },
        submitModel: {
          ...this.setState.submitModel,
          receiverID:
            this.props.receivers.length == 2
              ? this.props.receivers[1].id
              : null,
        },
      });
    }

    try {
      if (this.props.location.query.receiverID) {
        await this.setState({
          electModel: {
            ...this.setState.electModel,
            receiverID: this.props.location.query.receiverID,
          },
        });

        this.searchElectronicSubmission();
      }
    } catch {}
  }

  openPracticePopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPracticePopup: true, id: id });
  };

  closePracticePopup = () => {
    $("#myModal").hide();
    this.setState({ showPracticePopup: false });
  };

  openLocationPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showLocationPopup: true, id: id });
  };

  closeLocationPopup = () => {
    $("#myModal").hide();
    this.setState({ showLocationPopup: false });
  };

  openPatientPopup(event, name, id) {
    event.preventDefault();
    this.setState({ popupName: name, patientPopup: true, id: id });
  }

  closePatientPopup(name, id) {
    this.setState({ popupName: "", patientPopup: false });
  }

  //Open Visit Popup
  openVisitPopup(event, name, id) {
    event.preventDefault();
    this.setState({ popupName: name, visitPopup: true, id: id });
  }

  //Close Visit Popup
  closeVisitPopUp() {
    this.setState({ popupName: "", visitPopup: false });
  }

  openProviderPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showProviderPopup: true, id: id });
  };

  closeProviderPopup = () => {
    $("#myModal").hide();
    this.setState({ showProviderPopup: false });
  };

  // Open Patient Plan By Subscriber ID Popup
  openPatientPlanPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  openPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  isChecked = (id) => {
    //return this.state.submitModel.visits.filter(name => name === id)[0] ? true : false
    var checked = this.selectedVisits.filter((name) => name == id)[0]
      ? true
      : false;
    return checked;
  };

  /////////// Null handle //////////////
  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

  async searchElectronicSubmission() {
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    //Entry Date From Future Date Validation
    if (this.isNull(this.state.electModel.entryDateFrom) == false) {
      if (
        new Date(
          moment(this.state.electModel.entryDateFrom).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.entryDateFromValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateFromValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Entry Date To Future Date Validation
    if (this.isNull(this.state.electModel.entryDateTo) == false) {
      if (
        new Date(
          moment(this.state.electModel.entryDateTo).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.entryDateToValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.entryDateToValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.entryDateToValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //Entry Date To must be greater than Entry Date From Validation
    if (
      this.isNull(this.state.electModel.entryDateFrom) == false &&
      this.isNull(this.state.electModel.entryDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.electModel.entryDateFrom).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.electModel.entryDateTo).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.EntryDateToGreaterValField = (
          <span className="validationMsg">
            Entry Date To must be greater than Entry Date From
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.EntryDateToGreaterValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.EntryDateToGreaterValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }
    //if Entry Date To is selected Then Make sure than Entry date Form is also selected Validation
    if (
      this.isNull(this.state.electModel.entryDateFrom) == true &&
      this.isNull(this.state.electModel.entryDateTo) == false
    ) {
      console.log("Select DOS From");
      myVal.selectEntryFromValField = (
        <span className="validationMsg">Select Entry Date From</span>
      );
      myVal.validation = true;
      if (myVal.validation == false) myVal.validation = false;
    } else {
      myVal.selectEntryFromValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    if (myVal.validation == true) {
      this.setState({ validationModel: myVal, loading: false });
      Swal.fire(
        "Something Wrong",
        "Please Select All Fields Properly",
        "error"
      );
      return;
    }
    await axios
      .post(this.url + "FindVisits", this.state.electModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          //console.log(row)
          newList.push({
            ischeck: (
              <input
              style={{ width: "20px", height: "19px" , marginLeft:"6px" }}
                type="checkbox"
                id={row.visitID}
                name={row.visitID}
                onChange={this.toggleCheck}
                checked={this.isChecked(row.visitID)}
              />
            ),
            visitID: (
              <a
                className={row.coverage === "S" ? "gridBtn" : "gridBlueBtn"}
                href=""
                onClick={(event) =>
                  this.openVisitPopup(event, "visit", row.visitID)
                }
              >
                {" "}
                {this.val(row.visitID)}
              </a>
            ),
            dos: row.dos,
            accountNum: (
              <a
                href=""
                onClick={(event) =>
                  this.openPatientPopup(event, "patient", row.patientID)
                }
              >
                {" "}
                {this.val(row.accountNum)}
              </a>
            ),
            patient: row.patient,
            subscriberID: (
              <a
                href=""
                onClick={(event) =>
                  this.openPatientPlanPopup(event, "patientplan", row.patientID)
                }
              >
                {" "}
                {this.val(row.subscriberID)}
              </a>
            ),
            insurancePlanName: (
              <a
                href=""
                onClick={(event) =>
                  this.openPopup(event, "insuranceplan", row.insurancePlanID)
                }
              >
                {" "}
                {this.val(row.planName)}
              </a>
            ),
            visitEntryDate: row.visitEntryDate,

            location: (
              <a
                href=""
                onClick={(event) =>
                  this.openLocationPopup(event, row.locationID)
                }
              >
                {" "}
                {this.val(row.location)}
              </a>
            ),
            provider: (
              <a
                href=""
                onClick={(event) =>
                  this.openProviderPopup(event, row.providerID)
                }
              >
                {" "}
                {this.val(row.provider)}
              </a>
            ),
            totalAmount: isNullOrUndefined(row.totalAmount)
              ? ""
              : "$" + row.totalAmount,
            validationMessage: this.val(row.validationMessage),
          });
        });

        //setTimeout(function () {
        this.setState({
          data: newList,
          initialData: response.data,
          loading: false,
        });
        //}.bind(this), 3000);
      })
      .catch((error) => {
        //setTimeout(function () {
        this.setState({ loading: false });
        //}.bind(this), 3000);
        if (error.response.status == 400) {
          Swal.fire("Error", error.response.data, "error");
        }
      });
  }

  searchElectronicSub = (e) => {
    e.preventDefault();

    if (
      this.state.electModel.receiverID === "" ||
      this.state.electModel.receiverID === null ||
      this.state.electModel.receiverID === undefined
    ) {
      Swal.fire({
        type: "error",
        text: "Please Select the Receiver",
      });
      return;
    }

    this.setState({ loading: true });
    this.searchElectronicSubmission();
    e.preventDefault();
  };

  selectALL = (e) => {
    // e.preventDefault();
    let newValue = !this.state.selectedAll;
    this.setState({ ...this.state, selectedAll: newValue });

    let newList = [];
    this.selectedVisits = [];
    this.state.initialData.map((row, i) => {
      if (newValue === true) this.selectedVisits.push(Number(row.visitID));

      newList.push({
        ischeck: (
          <input
          style={{ width: "20px", height: "19px" , marginLeft:"6px" }}
            type="checkbox"
            id={row.visitID}
            name={row.visitID}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.visitID) ? true : false}
          />
        ),
        visitID: (
          <a
            className={row.coverage === "S" ? "gridBtn" : "gridBlueBtn"}
            href=""
            onClick={(event) =>
              this.openVisitPopup(event, "visit", row.visitID)
            }
          >
            {" "}
            {this.val(row.visitID)}
          </a>
        ),
        dos: row.dos,
        accountNum: (
          <a
            href=""
            onClick={(event) =>
              this.openPatientPopup(event, "patient", row.patientID)
            }
          >
            {" "}
            {this.val(row.accountNum)}
          </a>
        ),
        patient: row.patient,
        subscriberID: (
          <a
            href=""
            onClick={(event) =>
              this.openPatientPlanPopup(event, "patientplan", row.patientID)
            }
          >
            {" "}
            {this.val(row.subscriberID)}
          </a>
        ),
        insurancePlanName: (
          <a
            href=""
            onClick={(event) =>
              this.openPopup(event, "insuranceplan", row.insurancePlanID)
            }
          >
            {" "}
            {this.val(row.planName)}
          </a>
        ),
        visitEntryDate: row.visitEntryDate,

        location: (
          <a
            href=""
            onClick={(event) => this.openLocationPopup(event, row.locationID)}
          >
            {" "}
            {this.val(row.location)}
          </a>
        ),
        provider: (
          <a
            href=""
            onClick={(event) => this.openProviderPopup(event, row.providerID)}
          >
            {" "}
            {this.val(row.provider)}
          </a>
        ),
        totalAmount: isNullOrUndefined(row.totalAmount)
          ? ""
          : "$" + row.totalAmount,
        validationMessage: this.val(row.validationMessage),
      });
    });

    this.setState({
      data: newList,
      submitModel: { ...this.state.submitModel, visits: this.selectedVisits },
    });
  };

  toggleCheck = (e) => {
    // e.preventDefault();
    let checkedArr = this.selectedVisits;
    let newList = [];

    checkedArr.filter((name) => name === Number(e.target.id))[0]
      ? (checkedArr = checkedArr.filter((name) => name !== Number(e.target.id)))
      : checkedArr.push(Number(e.target.id));

    this.selectedVisits = checkedArr;

    this.state.initialData.map((row, i) => {
      newList.push({
        ischeck: (
          <input
            style={{ width: "20px", height: "19px" , marginLeft:"6px" }}
            type="checkbox"
            id={row.visitID}
            name={row.visitID}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.visitID)}
          />
        ),
        visitID: (
          <a
            className={row.coverage === "S" ? "gridBtn" : "gridBlueBtn"}
            href=""
            onClick={(event) =>
              this.openVisitPopup(event, "visit", row.visitID)
            }
          >
            {" "}
            {this.val(row.visitID)}
          </a>
        ),
        dos: row.dos,
        accountNum: (
          <a
            href=""
            onClick={(event) =>
              this.openPatientPopup(event, "patient", row.patientID)
            }
          >
            {" "}
            {this.val(row.accountNum)}
          </a>
        ),
        patient: row.patient,
        subscriberID: (
          <a
            href=""
            onClick={(event) =>
              this.openPatientPlanPopup(event, "patientplan", row.patientID)
            }
          >
            {" "}
            {this.val(row.subscriberID)}
          </a>
        ),
        insurancePlanName: (
          <a
            href=""
            onClick={(event) =>
              this.openPopup(event, "insuranceplan", row.insurancePlanID)
            }
          >
            {" "}
            {this.val(row.planName)}
          </a>
        ),
        visitEntryDate: row.visitEntryDate,

        location: (
          <a
            href=""
            onClick={(event) => this.openLocationPopup(event, row.locationID)}
          >
            {" "}
            {this.val(row.location)}
          </a>
        ),
        provider: (
          <a
            href=""
            onClick={(event) => this.openProviderPopup(event, row.providerID)}
          >
            {" "}
            {this.val(row.provider)}
          </a>
        ),
        totalAmount: isNullOrUndefined(row.totalAmount)
          ? ""
          : "$" + row.totalAmount,
        validationMessage: this.val(row.validationMessage),
      });
    });

    //this.setState({ data: newList });
    this.setState({
      data: newList,
      submitModel: { ...this.state.submitModel, visits: this.selectedVisits },
    });
  };

  opensubmitPlanPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };
  closesubmitPlanPopup = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
    $("#searchID").click();
    this.searchElectronicSubmission();
  };

  submitCheckedVisits = (e) => {
    if (this.selectedVisits === null || this.selectedVisits.length === 0) {
      Swal.fire({
        type: "info",
        text: "Please Select the Visit(s)",
      });
      return;
    } else {
      this.setState({ loading: true });
      axios
        .post(this.url + "SubmitVisits", this.state.submitModel, this.config)
        .then((response) => {
          if (isNullOrUndefined(response.data.errorMessage) === false) {
            this.setState({ loading: false });
            Swal.fire({
              type: "error",
              text: response.data.errorMessage,
            });
          } else if (response.data.isisFileSubmitted === true) {
            this.setState({ loading: false });
            Swal.fire({
              type: "success",
              text: "File Submitted Successfully",
            }).then((sres) => {
              this.searchElectronicSubmission();
            });
          } else {
            this.selectedVisits = [];
            this.setState({
              output: response.data,
              showPopup: true,
              loading: false,
            });
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          Swal.fire({
            type: "error",
            text: "Something Wrong.Please Try Again",
          });
        });
    }
  };

  handleChange = (event) => {
    var myName = event.target.name ? event.target.name : "";
    if (myName == "entryDateFrom" || myName == "entryDateTo") {
    } else {
      //Carret Position
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }

    this.setState({
      electModel: {
        ...this.state.electModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
      submitModel: {
        ...this.state.submitModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
  };
  clearFields = (event) => {
    event.preventDefault();
    this.setState({
      electModel: this.electModel,
      selectedAll: false,
    });
    this.selectedVisits = [];
    this.searchElectronicSubmission();
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select"
    )
      return true;
    else return false;
  }

  render() {
    const data = {
      columns: [
        {
          //label: <MDBInput type="checkbox" onChange={this.selectALL} />,
          label: (
            <input
              style={{ width: "20px", height: "20px" }}
              type="checkbox"
              id="selectAll"
              name="selectAll"
              checked={this.state.selectedAll == true ? true : false}
              onChange={this.selectALL}
            />
            // <div class="lblChkBox">
            //   <input
            //     type="checkbox"
            //     id="selectAll"
            //     name="selectAll"
            //     checked={this.state.selectedAll == true ? true : false}
            //     onChange={this.selectALL}
            //   />
            //   <label for="selectAll">
            //     <span></span>
            //   </label>
            // </div>
          ),
          field: "ischeck",
          sort: "",
          width: 50,
        },

        {
          label: "VISIT #",
          field: "visitID",
          sort: "asc",
          width: 150,
        },
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 150,
        },
        {
          label: "ACCOUNT #",
          field: "accountNum",
          sort: "asc",
          width: 150,
        },
        {
          label: "PATIENT",
          field: "patient",
          sort: "asc",
          width: 150,
        },
        {
          label: "SUBSCRIBER ID",
          field: "subscriberID",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN",
          field: "insurancePlanName",
          sort: "asc",
          width: 150,
        },
        {
          label: "ENTRY DATE",
          field: "visitEntryDate",
          sort: "asc",
          width: 150,
        },
        // {
        //   label: "PRACTICE",
        //   field: "practice",
        //   sort: "asc",
        //   width: 150
        // },
        {
          label: "LOCATION",
          field: "location",
          sort: "asc",
          width: 150,
        },
        {
          label: "PROVIDER",
          field: "provider",
          sort: "asc",
          width: 150,
        },
        {
          label: "AMOUNT",
          field: "totalAmount",
          sort: "asc",
          width: 80,
        },
        {
          label: "VALIDATION MESSAGE",
          field: "validationMessage",
          sort: "asc",
          width: 400,
        },
      ],
      rows: this.state.data,
    };

    var entryDateFrom = this.state.electModel.entryDateFrom
      ? this.state.electModel.entryDateFrom.slice(0, 10)
      : "";
    var entryDateTo = this.state.electModel.entryDateTo
      ? this.state.electModel.entryDateTo.slice(0, 10)
      : "";

    let popup = "";

    if (this.state.showPopup) {
      popup = (
        <ElectronicSubmissionModel
          onClose={this.closesubmitPlanPopup}
          id={this.state.id}
          data={this.state.output}
        ></ElectronicSubmissionModel>
      );
    } else if (this.state.showPracticePopup) {
      popup = (
        <NewPractice
          onClose={this.closePracticePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.showLocationPopup) {
      popup = (
        <NewLocation
          onClose={this.closeLocationPopup}
          id={this.state.id}
        ></NewLocation>
      );
    } else if (this.state.showProviderPopup) {
      popup = (
        <NewProvider
          onClose={this.closeProviderPopup}
          id={this.state.id}
        ></NewProvider>
      );
    } else if (this.state.patientPopup) {
      popup = (
        <GPopup
          onClose={this.closePatientPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.patientPopup) {
      popup = (
        <GPopup
          onClose={this.closePatientPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.visitPopup) {
      popup = (
        <GPopup
          onClose={this.closeVisitPopUp}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.popupName === "insuranceplan") {
      popup = (
        <NewInsurancePlan
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlan>
      );
    } else if (this.state.popupName === "patientplan") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else popup = <React.Fragment></React.Fragment>;

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
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                  ELECTRONIC SUBMISSION SEARCH
                </h6>
                <form onSubmit={(event) => this.searchElectronicSub(event)}>
                  <div className="search-form">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label> Receiver:<span class="text-danger">*</span></label>
                            <select
                              style={{
                                borderRadius: "3px",
                                border: "1px solid rgb(250, 194, 205)",
                                boxSizing: "border-box",
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "500",
                                height: "36px",
                                lineHeight: "auto",
                                outline: "none",
                                position: "relative",
                                width: "100%",
                                paddingLeft: "2px",
                                color: "rgb(67, 75, 93",
                              }}
                              name="receiverID"
                              id="receiverID"
                              value={this.state.electModel.receiverID}
                              onChange={this.handleChange}
                            >
                              {this.state.revData.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.description}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12"></div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Account#:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="accountNum"
                              id="accountNum"
                              value={this.state.electModel.accountNum}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Visit#:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="visitID"
                              id="visitID"
                              value={
                                this.state.electModel.visitID == null
                                  ? ""
                                  : this.state.electModel.visitID
                              }
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Entry Date From:</label>
                            <input
                              type="date"
                              min="1900-01-01"
                              max="9999-12-31"
                              name="entryDateFrom"
                              id="entryDateFrom"
                              value={entryDateFrom}
                              onChange={this.handleChange}
                            />
                            {this.state.validationModel.entryDateFromValField}
                            {this.state.validationModel.selectEntryFromValField}
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Entry Date To:</label>
                            <input
                              type="date"
                              min="1900-01-01"
                              max="9999-12-31"
                              name="entryDateTo"
                              id="entryDateTo"
                              value={entryDateTo}
                              onChange={this.handleChange}
                            />
                            {this.state.validationModel.entryDateToValField}
                            {
                              this.state.validationModel
                                .EntryDateToGreaterValField
                            }
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Location:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="location"
                              id="location"
                              value={this.state.electModel.location}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Provider:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="provider"
                              id="provider"
                              value={this.state.electModel.provider}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Plan Name:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="planName"
                              id="planName"
                              value={this.state.electModel.planName}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Payer ID:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="payerID"
                              id="payerID"
                              max="9"
                              value={this.state.electModel.payerID}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                    </div>

                    <div className="clearfix"></div>
                    <br></br>
                    <div className="col-lg-12 text-center mr-2">
                      <button
                        style={{ marginTop: "-6px" }}
                        class="btn btn-primary mr-2"
                         type="button"
                        onClick={(event) => this.submitCheckedVisits(event)}
                      >
                        Submit
                      </button>

                      <button
                        style={{ marginTop: "-6px" }}
                        class="btn btn-primary mr-2"
                        type="submit"
                        // onClick={event => this.handleLogin(event)}
                      >
                        Search
                      </button>
                      <button
                        style={{ marginTop: "-6px" }}
                        class="btn btn-primary mr-2"
                        type="button"
                        onClick={(event) => this.clearFields(event)}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <br></br>
        {/* Grid Data */}
        <div className="container-fluid">
          <div className="card mb-4">
            <GridHeading
              Heading="ELECTRONIC SUBMISSION SEARCH RESULT"
              dataObj={this.state.electModel}
              url={this.url}
              methodName="Export"
              methodNamePdf="ExportPdf"
              length={this.state.data.length}
            ></GridHeading>
            <div className="card-body">
              <div className="table-responsive">
                <div
                  id="dataTable_wrapper"
                  className="dataTables_wrapper dt-bootstrap4"
                >
                  <MDBDataTable
                    responsive={true}
                    striped
                    bordered
                    searching={false}
                    data={data}
                    displayEntries={false}
                    sortable={true}
                    scrollX={false}
                    scrollY={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {popup}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
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
    receivers: state.receivers ? state.receivers : [],
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.electronicsSubmissionSearch,
          add: state.loginInfo.rights.electronicsSubmissionSubmit,
        }
      : [],
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

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(ElectronicSubmission)
);

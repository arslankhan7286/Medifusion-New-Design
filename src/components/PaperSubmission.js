import React, { Component } from "react";
import Label from "./Label";
import Input from "./Input";
import axios from "axios";
import { MDBDataTable, MDBInput, MDBBtn } from "mdbreact";
import GridHeading from "./GridHeading";
import PaperSubmissionModal from "./PaperSubmissionModal";
//import viewHCFAFile from './viewHCFAFile';
import GPopup from "./GPopup";
import { withRouter } from "react-router-dom";
import $ from "jquery";
import Swal from "sweetalert2";
import { isNullOrUndefined } from "util";
import moment from "moment";

import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import NewInsurancePlan from "./NewInsurancePlan";

export class PaperSubmission extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PaperSubmission/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.paperModel = {
      formType: "",
      accountNum: "",
      visitID: null,
      practice: "",
      provider: "",
      planName: "",
      payerID: "",
      location: "",
      entryDateFrom: "",
      entryDateTo: "",
    };

    this.submitModel = {
      formType: "",
      clientID: 1,
      visits: [],
      processedClaims: null,
      isFileSubmitted: false,
      ErrorVisits: [],
      filePath: "",
      errorMessage: "",
      sessionId: "",
      submissionLogID: null,
    };

    this.validationModel = {
      EntryDateToGreaterValField: null,
      selectEntryFromValField: null,
      entryDateFromValField: "",
      entryDateToValField: "",
      validation: false,
    };

    this.state = {
      paperModel: this.paperModel,
      submitModel: this.submitModel,
      validationModel: this.validationModel,
      data: [],
      initialData: [],
      revData: [],
      selectedAll: false,
      checked: [],
      output: {},
      showPopup: false,
      id: 0,
      showPopup: false,
      showPracticePopup: false,
      showLocationPopup: false,
      showProviderPopup: false,
      showPatientPopup: false,
      showVisitPopup: false,
      loading: false,
      popupName: "",
    };

    this.selectedVisits = [];

    this.handleChange = this.handleChange.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
    this.isChecked = this.isChecked.bind(this);
    this.selectALL = this.selectALL.bind(this);
    this.submitCheckedVisits = this.submitCheckedVisits.bind(this);
    this.searchPaperSub = this.searchPaperSub.bind(this);
    this.closesubmitPlanPopup = this.closesubmitPlanPopup.bind(this);
    this.opensubmitPlanPopup = this.opensubmitPlanPopup.bind(this);
    this.openPatientPopup = this.openPatientPopup.bind(this);
    this.closePatientPopup = this.closePatientPopup.bind(this);
    this.openVisitPopUp = this.openVisitPopUp.bind(this);
    this.closeVisitPopup = this.closeVisitPopup.bind(this);
  }

  //Open Patient Popup
  openPatientPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPatientPopup: true, id: id });
  };

  //Close Patient Popup
  closePatientPopup = () => {
    $("#myModal").hide();
    this.setState({ showPatientPopup: false });
  };

  //Open Visit Popup
  openVisitPopUp = (event, id) => {
    event.preventDefault();
    this.setState({ showVisitPopup: true, id: id });
  };

  //Close Visit Popup
  closeVisitPopup = () => {
    $("#myModal").hide();
    this.setState({ showVisitPopup: false });
  };

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
    return this.selectedVisits.filter((name) => name === id)[0] ? true : false;
  };

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

  searchPaperSubmission = () => {
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    //Entry Date From Future Date Validation
    if (this.isNull(this.state.paperModel.entryDateFrom) == false) {
      if (
        new Date(
          moment(this.state.paperModel.entryDateFrom).format().slice(0, 10)
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
    if (this.isNull(this.state.paperModel.entryDateTo) == false) {
      if (
        new Date(
          moment(this.state.paperModel.entryDateTo).format().slice(0, 10)
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
      this.isNull(this.state.paperModel.entryDateFrom) == false &&
      this.isNull(this.state.paperModel.entryDateTo) == false
    ) {
      if (
        new Date(
          moment(this.state.paperModel.entryDateFrom).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.paperModel.entryDateTo).format().slice(0, 10)
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
      this.isNull(this.state.paperModel.entryDateFrom) == true &&
      this.isNull(this.state.paperModel.entryDateTo) == false
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
    axios
      .post(this.url + "FindVisits", this.state.paperModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
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
                href=""
                onClick={(event) => this.openVisitPopUp(event, row.visitID)}
              >
                {" "}
                {this.val(row.visitID)}
              </a>
            ),
            dos: this.val(row.dos),
            accountNum: (
              <a
                href=""
                onClick={(event) => this.openPatientPopup(event, row.patientID)}
              >
                {" "}
                {this.val(row.accountNum)}
              </a>
            ),
            patient: this.val(row.patient),
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
            visitEntryDate: row.visitEntryDate,
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
            // practice: (
            //   <MDBBtn
            //     className="gridBlueBtn"
            //     onClick={() => this.openPracticePopup(row.practiceID)}
            //   >
            //     {" "}
            //     {this.val(row.practice)}
            //   </MDBBtn>
            // ),
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
            // totalAmount: this.val(row.totalAmount),
            totalAmount: isNullOrUndefined(row.totalAmount)
              ? ""
              : "$" + row.totalAmount,
            validationMessage: row.validationMessage,
          });
        });

        //setTimeout(function () {
        this.setState({
          data: newList,
          initialData: response.data,
          loading: false,
        });
        //}.bind(this), 3000);

        // this.setState({
        //     data: newList,
        //     initialData: response.data,
        //     loading: false
        // });
      })
      .catch((error) => {
        //setTimeout(function () {
        this.setState({ loading: false });
        //}.bind(this), 3000);
      });
  };
  // Search Paper Submission
  searchPaperSub = (e) => {
    e.preventDefault();

    if (
      this.state.paperModel.formType === "" ||
      this.state.paperModel.formType === null ||
      this.state.paperModel.formType === undefined
    ) {
      Swal.fire({
        type: "error",
        text: "Please Select the HCFA Template ",
      });
      return;
    }

    this.searchPaperSubmission();
    e.preventDefault();
  };

  selectALL = (e) => {
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
            checked={this.isChecked(row.visitID)}
          />
        ),
        visitID: (
          <a
            href=""
            onClick={(event) => this.openVisitPopUp(event, row.visitID)}
          >
            {" "}
            {this.val(row.visitID)}
          </a>
        ),
        dos: this.val(row.dos),
        accountNum: (
          <a
            href=""
            onClick={(event) => this.openPatientPopup(event, row.patientID)}
          >
            {" "}
            {this.val(row.accountNum)}
          </a>
        ),
        patient: this.val(row.patient),
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
        visitEntryDate: row.visitEntryDate,
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
        // practice: (
        //   <MDBBtn
        //     className="gridBlueBtn"
        //     onClick={() => this.openPracticePopup(row.practiceID)}
        //   >
        //     {" "}
        //     {this.val(row.practice)}
        //   </MDBBtn>
        // ),
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
        // totalAmount: this.val(row.totalAmount),
        totalAmount: isNullOrUndefined(row.totalAmount)
          ? ""
          : "$" + row.totalAmount,
        validationMessage: row.validationMessage,
      });
    });

    this.setState({
      data: newList,
      submitModel: { ...this.state.submitModel, visits: this.selectedVisits },
    });
  };

  toggleCheck = (e) => {
    let checkedArr = this.selectedVisits;
    let newList = [];

    checkedArr.filter((name) => name === Number(e.target.id))[0]
      ? (checkedArr = checkedArr.filter((name) => name !== Number(e.target.id)))
      : checkedArr.push(Number(e.target.id));

    this.selectedVisits = checkedArr;

    this.state.initialData.map((row, i) => {
      newList.push({
        //ischeck: <MDBInput type="checkbox" id={row.visitID} onChange={this.toggleCheck} checked={this.isChecked(row.visitID)} />,
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
            href=""
            onClick={(event) => this.openVisitPopUp(event, row.visitID)}
          >
            {" "}
            {this.val(row.visitID)}
          </a>
        ),
        dos: this.val(row.dos),
        accountNum: (
          <a
            href=""
            onClick={(event) => this.openPatientPopup(event, row.patientID)}
          >
            {" "}
            {this.val(row.accountNum)}
          </a>
        ),
        patient: this.val(row.patient),
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
        visitEntryDate: row.visitEntryDate,
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
        // practice: (
        //   <MDBBtn
        //     className="gridBlueBtn"
        //     onClick={() => this.openPracticePopup(row.practiceID)}
        //   >
        //     {" "}
        //     {this.val(row.practice)}
        //   </MDBBtn>
        // ),
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
        // totalAmount: this.val(row.totalAmount),
        totalAmount: isNullOrUndefined(row.totalAmount)
          ? ""
          : "$" + row.totalAmount,
        validationMessage: row.validationMessage,
      });
    });

    this.setState({
      data: newList,
      submitModel: { ...this.state.submitModel, visits: this.selectedVisits },
    });
  };

  opensubmitPlanPopup = (id) => {
    this.setState({ showPopup: true, id: id });
  };
  closesubmitPlanPopup = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
    $("#searchID").click();
    this.searchPaperSubmission();
  };

  submitCheckedVisits = (e) => {
    if (
      this.state.submitModel.visits === null ||
      this.state.submitModel.visits.length === 0
    ) {
      Swal.fire({
        type: "info",
        text: "Please Select the Visit(s)",
      });
      return;
    } else {
      this.setState({ ...this.state, loading: true });

      axios
        .post(this.url + "SubmitVisits", this.state.submitModel, this.config)
        .then((response) => {
          this.setState({ loading: false });
          if (
            isNullOrUndefined(response.data.errorMessage) === false &&
            response.data.errorMessage.length > 0
          ) {
            Swal.fire({
              type: "error",
              text: response.data.errorMessage,
            });
          } else if (response.data.isisFileSubmitted === true) {
            Swal.fire({
              type: "success",
              text: "File Submitted Successfully",
            }).then((sres) => {
              this.searchPaperSubmission();
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
          let errorList = [];
        });
    }
  };

  async componentWillMount() {
    try {
      if (this.props.location.query.formType == "HCFA 1500") {
        await this.setState({
          paperModel: {
            ...this.state.paperModel,
            formType: this.props.location.query.formType,
            // accountNUm:this.props.match.params.id ?this.props.match.params.id:null
          },
        });

        this.searchPaperSubmission();
      }
    } catch {}
    axios
      .get(this.url + "GetProfiles", this.config)
      .then((response) => {
        this.setState({
          revData: response.data.receivers,
        });
      })
      .catch((error) => {});
  }

  handleChange = (event) => {
    var myName = event.target.name ? event.target.name : "";
    if (myName == "entryDateTo" || myName == "entryDateFrom") {
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
      paperModel: {
        ...this.state.paperModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
      submitModel: {
        ...this.state.submitModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });

    event.preventDefault();
  };

  clearFields = (event) => {
    this.selectedVisits = [];
    this.setState({
      paperModel: this.paperModel,
      selectedAll: false,
    });

    this.searchPaperSubmission();
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
              checked={this.state.selectedAll === true ? true : false}
              onChange={this.selectALL}
            />
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
          label: "ENTRY DATE",
          field: "visitEntryDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN",
          field: "insurancePlanName",
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
          width: 150,
        },
        {
          label: "VALIDATION MSG",
          field: "validationMessage",
          sort: "asc",
          width: 250,
        },
      ],
      rows: this.state.data,
    };
    const formType = [
      { value: "", display: "Select Title" },
      { value: "HCFA 1500", display: "HCFA 1500" },
      { value: "PLAIN 1500", display: "Plain 1500" },
    ];

    var entryDateFrom = this.state.paperModel.entryDateFrom
      ? this.state.paperModel.entryDateFrom.slice(0, 10)
      : "";
    var entryDateTo = this.state.paperModel.entryDateTo
      ? this.state.paperModel.entryDateTo.slice(0, 10)
      : "";

    let popup = "";

    if (this.state.showPopup) {
      popup = (
        <PaperSubmissionModal
          onClose={this.closesubmitPlanPopup}
          id={this.state.id}
          data={this.state.output}
        ></PaperSubmissionModal>
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
    } else if (this.state.showPatientPopup) {
      popup = (
        <GPopup
          onClose={this.closePatientPopup}
          popupName="patient"
          id={this.state.id}
        ></GPopup>
      );
    } else if (this.state.showVisitPopup) {
      popup = (
        <GPopup
          onClose={this.closeVisitPopup}
          popupName="visit"
          id={this.state.id}
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
                  PAPER SUBMISSION SEARCH
                </h6>
                <form onSubmit={(event) => this.searchPaperSub(event)}>
                  <div className="search-form">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label> HCFA Template:<span class="text-danger">*</span></label>
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
                              name="formType"
                              id="formType"
                              value={this.state.paperModel.formType}
                              onChange={this.handleChange}
                            >
                              {formType.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.display}
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
                              value={this.state.paperModel.accountNum}
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
                                this.state.paperModel.visitID == null
                                  ? ""
                                  : this.state.paperModel.visitID
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
                              value={this.state.paperModel.location}
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
                              value={this.state.paperModel.provider}
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
                              value={this.state.paperModel.planName}
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
                        onClick={() => this.submitCheckedVisits()}
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
              Heading="PAPER SUBMISSION SEARCH RESULT"
              dataObj={this.state.paperModel}
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
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.paperSubmissionSearch,
          add: state.loginInfo.rights.paperSubmissionSubmit,
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
  connect(mapStateToProps, matchDispatchToProps)(PaperSubmission)
);

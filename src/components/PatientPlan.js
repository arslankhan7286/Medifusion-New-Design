import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  withRouter,
} from "react-router-dom";
import axios from "axios";

import Input from "./Input";
import Label from "./Label";
import Swal from "sweetalert2";
import $ from "jquery";
import moment from "moment";
import plusIconImage from "../images/plus-ico.png";
import NewInsurancePlan from "./NewInsurancePlan";
import NewInsurancePlanAddress from "./NewInsurancePlanAddress";
import insuranceCardFront from "../images/insurance-card-front.jpg";
import insuranceCardBack from "../images/insurance-card-back.jpg";
import uploadPicIcon from "../images/upload-pic-icon.png";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import NewPerformEligibilty from "./NewPerformEligbility";
import { MDBBtn } from "mdbreact";
import { MDBDataTable } from "mdbreact";
import { isNullOrUndefined } from "util";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import Select, { components } from "react-select";
import NumberFormat from "react-number-format";
import TopForm from "../components/TopForm/TopForm";
import plusImage from "../images/plus-ico.png";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import plusSrc from "../images/plus-icon.png";

class PatientPlan extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PatientPlan/";
    this.insurancePlanUrl = process.env.REACT_APP_URL + "/insurancePlan/";
    this.patientURL = process.env.REACT_APP_URL + "/Patient/";
    this.insurancePlanAddressURL =
      process.env.REACT_APP_URL + "/InsurancePlanAddress/";
    this.patientEligibilityURL =
      process.env.REACT_APP_URL + "/PatientEligibility/";
    this.zipURL = process.env.REACT_APP_URL + "/Common/";
    this.InsurancePlanUrl = process.env.REACT_APP_URL + "/InsurancePlan/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.errorField = "errorField";

    this.patientPlanModel = {
      id: 0,
      insurancePlanID: null,
      payerID: "",
      patientID: null,
      coverage: "",
      relationShip: "",
      lastName: "",
      firstName: "",
      middleInitial: "",
      ssn: "",
      dob: "",
      gender: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      school: "",
      zipCode: "",
      subscriberId: "",
      groupName: "",
      groupNumber: "",
      planBeginDate: "",
      planEndDate: "",
      copay: "",
      deductible: "",
      coInsurance: "",
      employerID: "",
      insurancePlanAddressID: null,
      insurancePlanID: null,
      isActive: true,
      isDeleted: false,
      frontSideCard: "",
      backSidecard: "",
      isSelfPay: false,
    };

    this.validationModel = {
      insurancePlanIDValField: "",
      payerIDValField: "",
      patientIDValField: "",
      coverageValField: "",
      relationShipValField: "",
      lastNameValField: "",
      firstNameValField: "",
      middleInitialValField: "",
      ssnValField: "",
      dobValField: "",
      genderValField: "",
      address1ValField: "",
      address2ValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      phoneNumberValField: "",
      emailValField: "",
      schoolValField: "",
      zipCodeExtensionValField: "",
      subscriberIdValField: "",
      groupNameValField: "",
      groupNumberValField: "",
      planBeginDateValField: "",
      planEndDateValField: "",
      copayValField: "",
      deductibleValField: "",
      coInsuranceValField: "",
      employerIDValField: "",
      insurancePlanAddressIDValField: "",
      isActiveValField: true,
      isDeletedValField: false,
      frontSideCardValField: "",
      backSidecardValField: "",
      effectiveStartDateValField: null,
      effectiveEndDateValField: "",
    };

    this.insurancePlanAddressModel = {
      insurancePlanId: null,
      insurancePlan: null,
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      faxNumber: null,
      isDeleted: false,
      notes: null,
    };

    this.patientEligibility = {
      id: "",
      eligibilityDate: "",
      dos: "",
      patient: "",
      plan: "",
      payer: "",
      status: "",
      subscriberID: "",
      groupNumber: "",
      provider: "",
      remarks: "",
    };

    this.state = {
      patientEligibility: this.patientEligibility,
      patientPlanModel: this.patientPlanModel,
      insurancePlanAddressModel: this.insurancePlanAddressModel,
      patientPlans: [],
      patientPlanId: null,
      insurancePlans: this.props.insurancePlans
        ? this.props.insurancePlans
        : [],
      insurancePlanAddresses: [],
      insurancCardFrontFile: "",
      insurancCardFrontImagePreviewUrl: insuranceCardFront,
      insurancCardBackFile: "",
      insurancCardBackImagePreviewUrl: insuranceCardBack,
      validationModel: this.validationModel,
      patient: null,
      // Patient Id
      editId: this.props.patientID > 0 ? this.props.patientID : this.props.id,
      loading: false,
      popupName: "",
      id: 0,
      data: [],
      showPopup: false,
      calledFrom: this.props.calledFrom,
      //selfPay: false

      planID: null,
      relationShipID: null,
      subscriberID: null,
      insurancePlanID: {},
      showinsPopup: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInsurancePlanChange = this.handleInsurancePlanChange.bind(this);

    this.handleCheck = this.handleCheck.bind(this);
    this.savePatientPlan = this.savePatientPlan.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleIPAChange = this.handleIPAChange.bind(this);
    this.deletePatientPlan = this.deletePatientPlan.bind(this);
    this.addNewPatientPlan = this.addNewPatientPlan.bind(this);
    this.handlePatientPlansChange = this.handlePatientPlansChange.bind(this);
    this.handleIPAModelChange = this.handleIPAModelChange.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleZip = this.handleZip.bind(this);
    this.handleRelationShipChange = this.handleRelationShipChange.bind(this);
    this.selfPay = this.selfPay.bind(this);

    this.openInsurancePlanPopup = this.openInsurancePlanPopup.bind(this);
    this.openInsurancePlanAddressPopup = this.openInsurancePlanAddressPopup.bind(
      this
    );
  }

  openInsurancePlanAddressPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  async componentDidMount() {
    await this.setState({ loading: true });
    try {
      // Getting Patient Data
      axios
        .get(this.patientURL + "findpatient/" + this.state.editId, this.config)
        .then((response) => {
          this.setState({ patient: response.data });
        })
        .catch((error) => {});

      try {
        let Plan = [];
        //GET PATIENT PLANS BY PATIENT ID
        await axios
          .get(
            this.url + "GetpatientPlansByPatientID/" + this.state.editId,
            this.config
          )
          .then((response) => {
            this.setState({ patientPlans: response.data });

            // Selecting the First Plan By Default
            if (!this.isNull(response.data) && response.data.length > 0) {
              if (this.props.planID) {
                Plan = response.data.filter(
                  (plan) => plan.id == this.props.planID
                );

                this.handleSelectedPatientPlan(Plan[0].id);
              } else {
                this.handleSelectedPatientPlan(response.data[0].id);
              }
            }
          })
          .catch((error) => {});
      } catch {}

      // add patient ID in patient Plan
      await this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          patientID: this.state.editId,
        },
      });

      try {
        //get insurance address details
        if (this.state.patientPlanModel.insurancePlanAddressID) {
          axios
            .get(
              this.url +
                "FindInsurancePlanAddress/" +
                this.state.patientPlanModel.insurancePlanAddressID,
              this.config
            )
            .then((response) => {
              this.setState({ insurancePlanAddressModel: response.data });
            })
            .catch((error) => {});
        }
      } catch {}

      /////////////////////////////////////////////////// Patient Eligibility Search Grid API ////////////////////////////////////////////

      axios
        .get(
          this.patientEligibilityURL +
            "FindPatientEligibilityRecords/" +
            this.state.patientPlanId
        )
        .then((response) => {
          let newList = [];
          response.data.map((row, i) => {
            var eligibilityDate =
              row.eligibilityDate === null ? "  " : row.eligibilityDate;
            var dos = row.dos === null ? " " : row.dos;
            var patient = row.patient === null ? " " : row.patient;
            var plan = row.plan === null ? " " : row.plan;
            var payer = row.payer === null ? " " : row.payer;
            var status = row.status === null ? " " : row.status;
            var subscriberID =
              row.subscriberID === null ? " " : row.subscriberID;
            var groupNumber =
              row.groupNumber === null || " " ? " " : row.groupNumber;
            var provider = row.provider === null ? " " : row.provider;
            var remarks = row.remarks === null ? " " : row.remarks;
            var eligibilityDate = eligibilityDate.slice(0, 10);
            var dos = dos.slice(0, 10);
            newList.push({
              eligibilityDate: eligibilityDate,
              eligibilityDate: (
                <span>
                  <a
                    href=""
                    onClick={(event) =>
                      this.openEligibilityCodePopup(event, row.id)
                    }
                  >
                    {eligibilityDate}
                  </a>
                </span>
              ),
              dos: dos,
              patient: patient,
              plan: plan,
              payer: payer,
              status: status,
              subscriberID: subscriberID,
              groupNumber: groupNumber,
              provider: provider,
              remarks: remarks,
            });
          });
          this.setState({ data: newList });
        })
        .catch((error) => {});
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  replace(field, replaceWhat, replaceWith) {
    if (this.isNull(field)) return field;
    else return field.replace(replaceWhat, replaceWith);
  }

  handleZip(event) {
    event.preventDefault();
    var zip = event.target.value;

    this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });

    if (zip.length >= 5 && zip.length <= 9) {
      axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then((response) => {
          this.setState({
            patientPlanModel: {
              ...this.state.patientPlanModel,
              city: response.data.state_name,
              state: response.data.state_id,
            },
          });
        })
        .catch((error) => {
          this.setState({ loading: false });

          Swal.fire(
            "Something Wrong",
            "Please Check Server Connection",
            "error"
          );
          let errorsList = [];
          if (error.response !== null && error.response.data !== null) {
            errorsList = error.response.data;
          }
        });
    } else {
    }
  }

  cancelBtn = (e) => {
    e.preventDefault();
    this.props.selectTabAction("PatientPlan");
  };

  handleCheck = (e) => {
    e.preventDefault();

    this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        isActive: !this.state.patientPlanModel.isActive,
      },
    });
  };

  handleInsurancePlanChange = (event) => {
    event.preventDefault();
    var name = event.target.value == "Please Select" ? 0 : event.target.value;
    this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        [event.target.name]:
          event.target.value == "Please Select" ? null : event.target.value,
      },
    });

    this.getInsurancePlanAddress(name);
  };

  //Handle Insurance Plan Address DropDown Change
  async handleIPAChange(event) {
    event.preventDefault();

    const IPADetails = this.state.insurancePlanAddresses.filter(
      (option) => option.id == event.target.value
    );

    //if (this.state.patientPlanModel.insurancePlanAddressID) {
    if (event.target.value == 0) {
      this.setState({
        insurancePlanAddressModel: this.insurancePlanAddressModel,
      });
    } else {
      this.setState({
        insurancePlanAddressModel: IPADetails[0],
      });
    }

    this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        insurancePlanAddressID:
          event.target.value == 0 ? null : event.target.value,
      },
    });
  }

  //handle insurancePlanAddressModel IPA Model
  handleIPAModelChange(event) {
    event.preventDefault();
    this.setState({
      insurancePlanAddressModel: {
        ...this.state.insurancePlanAddressModel,
        [event.target.name]: event.target.value,
      },
    });
  }

  handleChange = (event) => {
    event.preventDefault();
    //Carret Position

    var regExpr = /[^a-zA-Z0-9 ]/g;
    var myValue = event.target.value;
    var myName = event.target.name;

    if (
      myName == "planBeginDate" ||
      myName == "planEndDate" ||
      myName == "dob"
    ) {
    } else {
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }
    if (myName == "subscriberId") {
      myValue = myValue.replace(regExpr, "");
    }

    this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        [myName]: myValue.toUpperCase(),
      },
    });
  };

  async getInsurancePlanAddress(insurancePlanID, insurancePlanAddressID) {
    await axios
      .get(
        this.insurancePlanAddressURL +
          "GetInsurancePlanAddressesByInsurancePlanID/" +
          insurancePlanID,
        this.config
      )
      .then((response) => {
        if (response.data.length > 1) {
          var insurancePlanAddress = response.data.filter(
            (option) => option.id == insurancePlanAddressID
          );
          this.setState({
            insurancePlanAddresses: response.data,
            insurancePlanAddressModel:
              insurancePlanAddress.length > 0
                ? insurancePlanAddress[0]
                : this.insurancePlanAddressModel,
          });

          // SELECTING PLAN's ADDRESS
          //if (this.state.patientPlanModel.insurancePlanAddressID) {
          // this.setState({
          //   ...this.state,
          //   insurancePlanAddressModel: response.data.filter(option => option.id == this.state.patientPlanModel.insurancePlanAddressID)
          // })
          // } else {
          //   this.setState({
          //     ...this.state,
          //     insurancePlanAddressModel: null
          //   })
          // }
        } else if (response.data.length == 1) {
          this.setState({
            insurancePlanAddresses: response.data,
            insurancePlanAddressModel: {
              ...this.state.insurancePlanAddressModel,
              insurancePlanId: null,
              insurancePlan: null,
              address1: "",
              address2: "",
              city: "",
              state: "",
              zipCode: "",
              phoneNumber: "",
              faxNumber: null,
              isDeleted: false,
              notes: null,
            },
          });
        } else
          this.setState({
            insurancePlanAddresses: [],
            insurancePlanAddressModel: {
              ...this.state.insurancePlanAddressModel,
              insurancePlanId: null,
              insurancePlan: null,
              address1: "",
              address2: "",
              city: "",
              state: "",
              zipCode: "",
              phoneNumber: "",
              faxNumber: null,
              isDeleted: false,
              notes: null,
            },
          });
      })
      .catch((error) => {});
  }

  async selfPay(event) {
    var valu = event.target.value;
    await this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        isSelfPay: !this.state.patientPlanModel.isSelfPay,
      },
    });

    if (this.state.patientPlanModel.isSelfPay) {
      var selfpayID = await this.props.insurancePlans.filter(
        (insurancePlan) => insurancePlan.value == "SELFPAY"
      )[0];
      this.setState({
        insurancePlanID: selfpayID,
        patientPlanModel: {
          ...this.state.patientPlanModel,
          insurancePlanID: selfpayID.id,
          subscriberId: "SELFPAY",
        },
      });

      // await axios
      //   .get(this.url + "getprofiles", this.config)
      //   .then((response) => {
      //     var selfpayID = response.data.insurancePlans.filter(
      //       (insurancePlan) => insurancePlan.value == "SELFPAY"
      //     )[0];
      //     this.setState({
      //       insurancePlans: response.data.insurancePlans,
      //       insurancePlanID: selfpayID,
      //       patientPlanModel: {
      //         ...this.state.patientPlanModel,
      //         insurancePlanID: selfpayID.id,
      //         subscriberId: "SELFPAY",
      //       },
      //     });
      //   });
    } else {
      await this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          insurancePlanID: this.state.planID,
          relationShip: this.state.relationshipID,
          subscriberId: this.state.subscriberID,
        },
      });
    }

    this.handleRelationShipChange(event);
  }

  handleRelationShipChange = (event) => {
    var name = "";
    var value = "";
    if (event.target == null) {
      if (this.state.patientPlanModel.isSelfPay) {
        value = 18;
        name = "relationShip";
      } else {
        value = this.state.relationshipID;
        name = "relationShip";
      }
    } else {
      value = event.target.value;
      name = event.target.name;
    }

    // //    this.componentDidMount();
    // axios
    //   .get(this.url + "getprofiles", this.config)
    //   .then(response => {
    //     this.setState({ insurancePlans: response.data.insurancePlans });
    //   })
    //   .then(error => {});

    // else{
    this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        [name]: value,
      },
    });

    // SELF RULE
    if (value == "18") {
      this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          lastName: this.state.patient.lastName,
          firstName: this.state.patient.firstName,
          middleInitial: this.state.patient.middleInitial,
          gender: this.state.patient.gender,
          dob: this.state.patient.dob,
          ssn: this.state.patient.ssn,
          address1: this.state.patient.address1,
          address2: this.state.patient.address2,
          city: this.state.patient.city,
          state: this.state.patient.state,
          zipCode: this.state.patient.zipCode,
          email: this.state.patient.email,
          phoneNumber: this.state.patient.phoneNumber,

          [name]: value,
        },
      });
    } else {
      this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          relationShip: value,
          lastName: "",
          firstName: "",
          middleInitial: "",
          gender: "",
          dob: "",
          ssn: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          zipCode: "",
          email: "",
          phoneNumber: "",
        },
      });
    }
  };

  handleDateChange = (event) => {
    event.preventDefault();
    this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        [event.target.name]: event.target.value,
      },
    });
  };

  async handleSelectedPatientPlan(patientPlanID) {
    this.setState({ patientPlanId: patientPlanID });
    //get patient plan
    await axios
      .get(this.url + "findpatientplan/" + patientPlanID, this.config)
      .then((response) => {
        var insurancePlan = this.props.insurancePlans.filter(
          (option) => option.id == response.data.insurancePlanID
        );
        var patientPlanModel = response.data;
        patientPlanModel.payerID = insurancePlan[0].description;
        this.setState({
          patientPlanModel: patientPlanModel,
          patientPlanId: patientPlanID,
          planID: response.data.insurancePlanID,
          relationshipID: response.data.relationShip,
          subscriberID: response.data.subscriberId,
          insurancePlanID: insurancePlan[0],
        });

        this.getInsurancePlanAddress(
          response.data.insurancePlanID,
          response.data.insurancePlanAddressID
        );
      })
      .catch((error) => {});
  }

  //Select Patient Plan Drop down
  async handlePatientPlansChange(event) {
    // event.target.value
    this.handleSelectedPatientPlan(event.target.value);
    var planid = event.target.value;

    //get insurance address details
    if (this.state.patientPlanModel.insurancePlanAddressID) {
      await axios
        .get(
          this.url +
            "FindInsurancePlanAddress/" +
            this.state.patientPlanModel.insurancePlanAddressID,
          this.config
        )
        .then((response) => {
          this.setState({ insurancePlanAddressModel: response.data });
        })
        .catch((error) => {});
    }

    /////////////////////////////////////////////   Patient Eligibility Grid Result  ///////////////////////////////////////////////

    axios
      .get(
        this.patientEligibilityURL + "FindPatientEligibilityRecords/" + planid
      )
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          var eligibilityDate =
            row.eligibilityDate === null ? "  " : row.eligibilityDate;
          var dos = row.dos === null ? " " : row.dos;
          var patient = row.patient === null ? " " : row.patient;
          var plan = row.plan === null ? " " : row.plan;
          var payer = row.payer === null ? " " : row.payer;
          var status = row.status === null ? " " : row.status;
          var subscriberID = row.subscriberID === null ? " " : row.subscriberID;
          var groupNumber =
            row.groupNumber === null || " " ? " " : row.groupNumber;
          var provider = row.provider === null ? " " : row.provider;
          var remarks = row.remarks === null ? " " : row.remarks;
          var eligibilityDate = eligibilityDate.slice(0, 10);
          var dos = dos.slice(0, 10);
          newList.push({
            id: row.id,
            eligibilityDate: (
              <span>
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() => this.openEligibilityCodePopup(row.id)}
                >
                  {eligibilityDate}
                </MDBBtn>
              </span>
            ),
            dos: dos,
            patient: patient,
            plan: plan,
            payer: payer,
            status: status,
            subscriberID: subscriberID,
            groupNumber: groupNumber,
            provider: provider,
            remarks: remarks,
          });
        });
        this.setState({ data: newList });
      })
      .catch((error) => {});
    ///////////////////////////////////////////   End Patient Eligibility   //////////////////////////////////////////////////////////
  }

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value === "Please Coverage" ||
      value === "Please Relationship"
    )
      return true;
    else return false;
  }

  //save Patient Plan
  savePatientPlan(e) {
    e.preventDefault();
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    var phoneNumber = this.state.patientPlanModel.phoneNumber
      ? this.state.patientPlanModel.phoneNumber.replace(/[- )(]/g, "")
      : "";
    this.state.patientPlanModel.phoneNumber = phoneNumber
      ? phoneNumber.replace(/^0+/, "")
      : "";
    this.state.patientPlanModel.phoneNumber = this.state.patientPlanModel
      .phoneNumber
      ? this.state.patientPlanModel.phoneNumber.replace("_", "")
      : "";

    // Effectice End Date Validation
    if (
      !this.isNull(this.state.patientPlanModel.planBeginDate) &&
      !this.isNull(this.state.patientPlanModel.planEndDate) &&
      this.state.patientPlanModel.planEndDate <
        this.state.patientPlanModel.planBeginDate
    ) {
      myVal.effectiveEndDateValField = (
        <span className="validationMsg">
          Effective End Date Must Be Greater Than Or Equals To Start Date
        </span>
      );
      myVal.validation = true;
    } else {
      myVal.effectiveEndDateValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientPlanModel.insurancePlanID)) {
      myVal.insurancePlanIDValField = (
        <span className="validationMsg">Select Insurance Plan</span>
      );
      myVal.validation = true;
    } else {
      myVal.insurancePlanIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientPlanModel.coverage)) {
      myVal.coverageValField = (
        <span className="validationMsg">Select Coverage</span>
      );
      myVal.validation = true;
    } else {
      myVal.coverageValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientPlanModel.relationShip)) {
      myVal.relationShipValField = (
        <span className="validationMsg">Select RelationShip</span>
      );
      myVal.validation = true;
    } else {
      myVal.relationShipValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientPlanModel.subscriberId)) {
      myVal.subscriberIdValField = (
        <span className="validationMsg">Enter Subscriber Id</span>
      );
      myVal.validation = true;
    } else {
      myVal.subscriberIdValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientPlanModel.lastName)) {
      myVal.lastNameValField = (
        <span className="validationMsg">Enter Last Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.lastNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.patientPlanModel.firstName)) {
      myVal.firstNameValField = (
        <span className="validationMsg">Enter First Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.firstNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.patientPlanModel.zipCode) === false &&
      this.state.patientPlanModel.zipCode.length > 0
    ) {
      if (this.state.patientPlanModel.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of alleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.patientPlanModel.zipCode.length > 5 &&
        this.state.patientPlanModel.zipCode.length < 9
      ) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of either 5 or 9 digits
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.zipCodeValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.zipCodeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.patientPlanModel.ssn) === false &&
      this.state.patientPlanModel.ssn.length < 9
    ) {
      myVal.ssnValField = (
        <span className="validationMsg">SSN length should be 9</span>
      );
      myVal.validation = true;
    } else {
      myVal.ssnValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.patientPlanModel.phoneNumber) === false &&
      this.state.patientPlanModel.phoneNumber.length < 10
    ) {
      myVal.phoneNumberValField = (
        <span className="validationMsg">Phone # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.phoneNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //DOB Future Date Validation
    if (this.isNull(this.state.patientPlanModel.dob) == false) {
      if (
        new Date(
          moment(this.state.patientPlanModel.dob).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.dobValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.dobValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.dobValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Effective Start Date Future Date Validation
    if (this.isNull(this.state.patientPlanModel.planBeginDate) == false) {
      if (
        new Date(
          moment(this.state.patientPlanModel.planBeginDate)
            .format()
            .slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.effectiveStartDateValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.effectiveStartDateValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.effectiveStartDateValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //Effective End Date Future Date Validation
    if (this.isNull(this.state.patientPlanModel.planEndDate) == false) {
      if (
        new Date(
          moment(this.state.patientPlanModel.planEndDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.effectiveEndDateValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.effectiveEndDateValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.effectiveEndDateValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      Swal.fire("Something Wrong", "Please Fill All Fields Properly", "error");
      return;
    }
    axios
      .post(
        this.url + "savePatientplan",
        this.state.patientPlanModel,
        this.config
      )
      .then((response) => {
        var patientPlans = [];
        axios
          .get(
            this.url + "GetpatientPlansByPatientID/" + this.state.editId,
            this.config
          )
          .then((planResponse) => {
            patientPlans = planResponse.data;
            this.setState({
              patientPlanModel: response.data,
              patientPlans: patientPlans,
              loading: false,
            });
            Swal.fire("Record Saved Successfully", "", "success");
          })
          .catch();
      })
      .catch((error) => {
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
                if (error.response.data.Email) {
                  if (error.response.data.Email[0]) {
                    //Swal.fire("Something Wrong", error.response.data.Email[0], "error");
                    myVal.emailValField = (
                      <span className="validationMsg">
                        Please enter Valid Email ID
                      </span>
                    );
                    myVal.validation = true;
                  } else {
                    myVal.emailValField = "";
                    if (myVal.validation === false) myVal.validation = false;
                  }
                } else {
                  Swal.fire("Error", error.response.data, "error");
                }

                this.setState({
                  validationModel: myVal,
                });
              }
            }
          } else {
            Swal.fire("Something went Wrong", "", "error");
            return;
          }
        } catch {}
      });

    //http://192.168.110.44/Database/api/InsurancePlanAddress/SaveInsurancePlanAddress
  }

  //Delete Patient Plan
  deletePatientPlan() {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        axios
          .delete(
            this.url + "DeletePatientPlan/" + this.state.patientPlanId,
            this.config
          )
          .then((response) => {
            Swal.fire("Record Deleted!", "Record has been deleted.", "success");
            $("#btnCancel").click();
            this.props.selectTabAction("Patient");
          })
          .catch((error) => {
            try {
              let errorsList = [];
              if (error.response !== null && error.response.data !== null) {
                errorsList = error.response.data;
              }
            } catch {}
          });

        //this.props.onClose();
      }
    });
  }

  async addNewPatientPlan() {
    await this.setState({
      patientPlanModel: this.patientPlanModel,
      insurancePlanAddressModel: this.insurancePlanAddressModel,
    });

    //add patient ID in patient Plan
    await this.setState({
      patientPlanModel: {
        ...this.state.patientPlanModel,
        patientID: this.state.editId,
      },
      insurancePlanID: null,
    });
  }

  cancelBtn = (e) => {
    e.preventDefault();
    this.props.selectTabAction("Patient");
    this.props.history.push("/Patient");
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  handleAmountChange = (e) => {
    e.preventDefault();
    // const amount = e.target.value;

    // if (amount.match(/^-?0*(?:\d+(?!,)(?:\.\d{1,2})?|(?:\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?))$/)) {
    //   this.setState({
    //     patientPlanModel: { ...this.state.patientPlanModel, [e.target.name]: amount }
    //   });
    // }
    // else if (amount == "") {
    //   this.setState({
    //     patientPlanModel: { ...this.state.patientPlanModel, [e.target.name]: amount }
    //   });
    // }

    const amount = e.target.value;
    var regexp = /^\d+(\.(\d{1,2})?)?$/;
    if (regexp.test(amount)) {
      this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          [e.target.name]: amount,
        },
      });
    } else if (amount == "") {
      this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          [e.target.name]: "",
        },
      });
    }
  };

  openInsurancePlanPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showinsPopup: true, id: id });
  };

  closeInsurancePlanPopup = () => {
    $("#myModal").hide();
    this.setState({ showinsPopup: false });

    try {
      //get insurance plans from get profiles
      axios
        .get(this.url + "getprofiles", this.config)
        .then((response) => {
          this.setState({ insurancePlans: response.data.insurancePlans });
        })
        .then((error) => {});
    } catch {}
  };

  openEligibilityCodePopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  //close facility popup
  closeEligibilityCodePopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  };

  _handleFrontImageChange(e) {
    e.preventDefault();

    if (e.target.files[0]) {
      let reader = new FileReader();
      let insurancCardFrontFile = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          insurancCardFrontFile: insurancCardFrontFile,
          insurancCardFrontImagePreviewUrl: reader.result,
        });
      };

      reader.readAsDataURL(insurancCardFrontFile);
    }
  }

  _handleBackImageChange(e) {
    e.preventDefault();

    if (e.target.files[0]) {
      let reader1 = new FileReader();
      let insurancCardBackFile = e.target.files[0];

      reader1.onloadend = () => {
        this.setState({
          insurancCardBackFile: insurancCardBackFile,
          insurancCardBackImagePreviewUrl: reader1.result,
        });
      };

      reader1.readAsDataURL(insurancCardBackFile);
    }
  }

  openPopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openhistorypopup = (event, name, id) => {
    event.preventDefault();
    this.setState({ popupName: "NewHistoryPractice", id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ popupName: "" });
  };

  async handleInsurancePlansuggChange(event) {
    var event = event;

    if (event) {
      var insurancePlan = await this.props.insurancePlans.filter(
        (option) => option.id == event.id
      );

      this.setState({
        insurancePlanID: event,
        patientPlanModel: {
          ...this.state.patientPlanModel,
          insurancePlanID: event.id,
          payerID: insurancePlan[0].description,
        },
      });
      this.getInsurancePlanAddress(event.id);
    } else {
      // this.setState({
      //   insurancePlanID: null,
      //   patientPlanModel: {
      //     ...this.state.patientPlanModel,
      //     insurancePlanID: null
      //   }
      // });

      this.setState({
        insurancePlanID: null,
        insurancePlanAddresses: [],
        insurancePlanAddressModel: {
          ...this.state.insurancePlanAddressModel,
          insurancePlanId: null,
          insurancePlan: null,
          address1: "",
          address2: "",
          city: "",
          state: "",
          zipCode: "",
          phoneNumber: "",
          faxNumber: null,
          isDeleted: false,
          notes: null,
        },
      });
      // this.getInsurancePlanAddress(event.id);
    }
  }

  filterOption = (option, inputValue) => {
    try {
      var value = inputValue + "";
      if (value.length > 1) {
        const words = inputValue.split(" ");
        return words.reduce(
          (acc, cur) =>
            acc && option.label.toLowerCase().includes(cur.toLowerCase()),
          true
        );
      }
    } catch {}
  };

  onPaste = (event) => {
    event.preventDefault();
    var x = event.target.value;
    x = x.trim();
    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          [event.target.name]: x,
        },
      });
      return;
    }

    if (!x.match(regex)) {
      Swal.fire("", "Should be Number", "error");
      return;
    } else {
      this.setState({
        patientPlanModel: {
          ...this.state.patientPlanModel,
          [event.target.name]: x,
        },
      });
    }

    return;
  };

  render() {
    const options = [
      { value: "History", label: "History", className: "dropdown" },
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingsIcon} width="17px" />
      </div>
    );

    var dropdown;
    dropdown = (
      <Dropdown
        className=""
        options={options}
        onClick={(event) =>
          this.openhistorypopup(event, "NewHistoryPractice", 0)
        }
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    //Insurance Plan Popup
    let popup = "";
    if (this.state.popupName == "insuranceplan") {
      popup = (
        <NewInsurancePlan
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlan>
      );
    } else if (this.state.showPopup) {
      popup = (
        <NewPerformEligibilty
          onClose={this.closeEligibilityCodePopup}
          id={this.state.id}
        ></NewPerformEligibilty>
      );
    } else if (this.state.popupName == "insuranceplanaddress") {
      popup = (
        <NewInsurancePlanAddress
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlanAddress>
      );
    } else if (this.state.popupName == "NewHistoryPractice") {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.patientPlanModel.id}
          apiURL={this.url}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else if (this.state.showinsPopup) {
      popup = (
        <NewInsurancePlanAddress
          onClose={this.closeInsurancePlanPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewInsurancePlanAddress>
      );
    } else popup = <React.Fragment></React.Fragment>;

    //image preview Fornt Side
    let { insurancCardFrontImagePreviewUrl } = this.state;
    let $insurancCardFrontImagePreview = null;
    if (insurancCardFrontImagePreviewUrl) {
      $insurancCardFrontImagePreview = insurancCardFrontImagePreviewUrl;
    } else {
      $insurancCardFrontImagePreview = "";
    }

    //Image preview baack Side
    let { insurancCardBackImagePreviewUrl } = this.state;
    let $insurancCardBackImagePreview = null;
    if (insurancCardBackImagePreviewUrl) {
      $insurancCardBackImagePreview = insurancCardBackImagePreviewUrl;
    } else {
      $insurancCardBackImagePreview = "";
    }

    //Is Active
    let active = this.state.patientPlanModel.isActive;

    //US States
    const usStates = [
      { value: "", display: "Select State" },
      { value: "AL", display: "AL - Alabama" },
      { value: "AK", display: "AK - Alaska" },
      { value: "AZ", display: "AZ - Arizona" },
      { value: "AR", display: "AR - Arkansas" },
      { value: "CA", display: "CA - California" },
      { value: "CO", display: "CO - Colorado" },
      { value: "CT", display: "CT - Connecticut" },
      { value: "DE", display: "DE - Delaware" },
      { value: "FL", display: "FL - Florida" },
      { value: "GA", display: "GA - Georgia" },
      { value: "HI", display: "HI - Hawaii" },
      { value: "ID", display: "ID - Idaho" },
      { value: "IL", display: "IL - Illinois" },
      { value: "IN", display: "IN - Indiana" },
      { value: "IA", display: "IA - Iowa" },
      { value: "KS", display: "KS - Kansas" },
      { value: "KY", display: "KY - Kentucky" },
      { value: "LA", display: "LA - Louisiana" },
      { value: "ME", display: "ME - Maine" },
      { value: "MD", display: "MD - Maryland" },
      { value: "MA", display: "MA - Massachusetts" },
      { value: "MI", display: "MI - Michigan" },
      { value: "MN", display: "MN - Minnesota" },
      { value: "MS", display: "MS - Mississippi" },
      { value: "MO", display: "MO - Missouri" },
      { value: "MT", display: "MT - Montana" },
      { value: "NE", display: "NE - Nebraska" },
      { value: "NV", display: "NV - Nevada" },
      { value: "NH", display: "NH - New Hampshire" },
      { value: "NJ", display: "NJ - New Jersey" },
      { value: "NM", display: "NM - New Mexico" },
      { value: "NY", display: "NY - New York" },
      { value: "NC", display: "NC - North Carolina" },
      { value: "ND", display: "ND - North Dakota" },
      { value: "OH", display: "OH - Ohio" },
      { value: "OK", display: "OK - Oklahoma" },
      { value: "OR", display: "OR - Oregon" },
      { value: "PA", display: "PA - Pennsylvania" },
      { value: "RI", display: "RI - Rhode Island" },
      { value: "SC", display: "SC - South Carolina" },
      { value: "SD", display: "SD - South Dakota" },
      { value: "TN", display: "TN - Tennessee" },
      { value: "TX", display: "TX - Texas" },
      { value: "UT", display: "UT - Utah" },
      { value: "VT", display: "VT - Vermont" },
      { value: "VA", display: "VA - Virginia" },
      { value: "WA", display: "WA - Washington" },
      { value: "WV", display: "WV - West Virginia" },
      { value: "WI", display: "WI - Wisconsin" },
      { value: "WY", display: "WY - Wyoming" },
    ];

    //Gender
    const gender = [
      { value: "", display: "Select Gender" },
      { value: "M", display: "MALE" },
      { value: "F", display: "FEMALE" },
      { value: "U", display: "UNKNOWN" },
    ];

    //Coverage
    const coverage = [
      { value: "", display: "Select Coverage" },
      { value: "P", display: "PRIMARY" },
      { value: "S", display: "SECONDARY" },
      { value: "T", display: "TERTIARY" },
    ];

    const relationship = [
      { value: "", display: "Select Relationship" },
      { value: "18", display: "18 SELF" },
      { value: "01", display: "01 SPOUSE" },
      { value: "19", display: "19 CHiLD" },
      { value: "20", display: "20 EMPLOYEE" },
      { value: "21", display: "21 UNKNOWN" },
      { value: "39", display: "39 ORGAN DONAR" },
      { value: "53", display: "53 LIFE PARTNER" },
      { value: "G8", display: "G8 OTHER RELATIONSHIP" },
    ];
    var insurancePlanName = this.props.insurancePlans.filter(
      (plan) => plan.id == this.state.patientPlanModel.insurancePlanID
    );

    // FOR PATIENT EGLIGIBILTY GRID
    const data = {
      columns: [
        {
          label: "ELIGIBILITY DATE",
          field: "eligibilityDate",
          sort: "asc",
          //width: 150
        },
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          //width: 150
        },
        {
          label: "PATIENT",
          field: "patient",
          sort: "asc",
          //width: 150
        },
        {
          label: "PLAN",
          field: "plan",
          sort: "asc",
          //width: 150
        },
        {
          label: "PAYER",
          field: "payer",
          sort: "asc",
          //width: 150
        },
        {
          label: "STATUS",
          field: "status",
          sort: "asc",
          //width: 150
        },
        {
          label: "SUBSCRIBER ID",
          field: "subscriberID",
          sort: "asc",
          //width: 150
        },
        {
          label: "GROUP #",
          field: "groupNumber",
          sort: "asc",
          //width: 150
        },
        {
          label: "PROVIDER",
          field: "provider",
          sort: "asc",
          //width: 150
        },
        {
          label: "REMARKS",
          field: "remarks",
          sort: "asc",
          //width: 150
        },
      ],
      rows: this.state.data,
    };

    //Spinner
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
        {spiner}
        {/* // <!-- /.container-fluid Starts--> */}
        <div>
          {/* <!-- Page Heading --> */}

          {/* <!-- Container Top Starts Here --> */}
          <div>
            {/* <!-- Tab Content Starts --> */}
            <div class="tab-content">
              {/* <!-- Tab Pane Starts Here --> */}
              <div id="home" class="tab-pane">
                {/* <!---Patient Plan/Top Form Start here --> */}
                {this.props.SchedularAdvSearch ? null : this.props.id > 0 ? (
                  <TopForm patientID={this.props.id} />
                ) : null}
                {/* <!---Patient Plan/Top Form End here -->  */}

                {/* <!---Patient Plan |  | Edits start here --> */}
                <br></br>
                <div class="row">
                  <div class="col-md-12 mt-1 order-md-1 provider-form">
                    <div class="header pt-1">
                      <h6>
                        <span class="mh4">
                          {this.state.editId > 0
                            ? insurancePlanName.length > 0 &&
                              insurancePlanName[0].id != null
                              ? insurancePlanName[0].value +
                                " - " +
                                (this.state.patientPlanModel.coverage
                                  ? this.state.patientPlanModel.coverage
                                  : " ") +
                                " - " +
                                this.state.patientPlanModel.subscriberId
                              : this.state.patientPlanModel.coverage +
                                " - " +
                                this.state.patientPlanModel.subscriberId
                            : "NEW PATIENT PLAN"}
                        </span>

                        <div
                          class="float-right p-0 col-md-0"
                          style={{ marginTop: "-3px" }}
                        >
                          {this.state.editId > 0 ? dropdown : ""}
                        </div>

                        <div class="float-right p-0 col-md-0">
                          <button
                            style={{ marginTop: "-5px" }}
                            className="btn btn-primary ml-1 mr-2"
                            disabled={this.isDisabled(this.props.rights.delete)}
                            onClick={() => this.deletePatientPlan()}
                          >
                            Delete
                          </button>
                        </div>
                        <div class="float-right p-0 col-md-0">
                          <button
                            style={{ marginTop: "-5px" }}
                            className="btn btn-primary ml-1 mr-2"
                            onClick={() => this.addNewPatientPlan()}
                            disabled={this.isDisabled(this.props.rights.add)}
                          >
                            Add New
                          </button>
                        </div>
                        <div class="float-right p-0 col-md-0">
                          <input
                            style={{ marginTop: "5px" }}
                            class="checkbox mr-2"
                            type="checkbox"
                            onClick={this.handleCheck}
                            checked={active}
                          />
                          Active
                        </div>
                        <div class="float-right p-0 col-md-0 mr-1">
                          {" "}
                          <select
                            style={{
                              minWidth: "100px",
                              maxWidth: "200px",
                              height: "35px",
                              marginTop: "-5px",
                            }}
                            name="patientPlanId"
                            id="patientPlanId"
                            disabled={
                              this.isNull(this.state.calledFrom) == true
                                ? false
                                : true
                            }
                            value={this.state.patientPlanModel.id}
                            onChange={this.handlePatientPlansChange}
                          >
                            {this.state.patientPlans.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description2}
                              </option>
                            ))}
                          </select>
                        </div>
                      </h6>
                    </div>

                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                  </div>
                </div>
                {/* <!----Patient Plan | Demographics | Edits ends here --> */}

                {/* Details Header Starts */}
                <div class="row">
                  <div class="col-md-12 mt-1 order-md-1 provider-form">
                    <div class="header pt-3">
                      <h6 class="heading">
                        Details
                        <div class="float-lg-right text-right">
                          <input
                            class="checkbox"
                            type="checkbox"
                            id="selfPay"
                            name="selfPay"
                            checked={this.state.patientPlanModel.isSelfPay}
                            onChange={this.selfPay}
                          />
                          Self Pay
                        </div>
                      </h6>
                      <div
                        class="clearfix"
                        style={{ borderBottom: "1px solid #037592" }}
                      ></div>
                      <div class="clearfix"></div>
                    </div>
                    <br></br>

                    <div class="row">
                      <div class="col-md-4 mb-4">
                        <div class="col-md-4 float-left">
                          <label
                            className={
                              this.state.patientPlanModel.insurancePlanID
                                ? "txtUnderline"
                                : ""
                            }
                            onClick={
                              this.state.patientPlanModel.insurancePlanID
                                ? (event) =>
                                    this.openPopup(
                                      event,
                                      "insuranceplan",
                                      this.state.patientPlanModel
                                        .insurancePlanID
                                    )
                                : undefined
                            }
                          >
                            Plan
                          </label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <Select
                            value={this.state.insurancePlanID}
                            onChange={(event) =>
                              this.handleInsurancePlansuggChange(event)
                            }
                            options={this.props.insurancePlans}
                            filterOption={this.filterOption}
                            placeholder=""
                            isClearable={true}
                            isSearchable={true}
                            openMenuOnClick={false}
                            escapeClearsValue={true}
                            styles={{
                              indicatorSeparator: () => {},
                              clearIndicator: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#286881",
                              }),
                              container: (defaultProps) => ({
                                ...defaultProps,
                                position: "absolute",
                                width: "80%",
                              }),
                              // indicatorsContainer: (defaultStyles) => ({
                              //   ...defaultStyles,
                              //   padding: "0px",
                              //   marginBottom: "0",
                              //   marginTop: "0px",
                              //   height: "36px",
                              //   borderBottomRightRadius: "10px",
                              //   borderTopRightRadius: "10px",
                              //   // borderRadius:"0 6px 6px 0"
                              // }),
                              indicatorContainer: (defaultStyles) => ({
                                ...defaultStyles,
                                color: "#171717",
                                paddingTop: "3px",
                                paddingLeft: "8px",
                                paddingBottom: "8px",
                                paddingRight: "8px",
                              }),
                              dropdownIndicator: (defaultStyles) => ({
                                display: "none",
                              }),
                              input: (defaultStyles) => ({
                                ...defaultStyles,
                                marginTop: "-3px",
                                marginLeft: "-8px",
                                padding: "0px",
                                // display:'none'
                              }),
                              singleValue: (defaultStyles) => ({
                                ...defaultStyles,
                                fontSize: "16px",
                                transition: "opacity 300ms",
                                top: "0%",
                                marginLeft: "-8px",
                                marginTop: "13px",
                                fontSize: "0.8rem",
                                // display:'none'
                              }),
                              control: (defaultStyles) => ({
                                ...defaultStyles,
                                minHeight: "30px",
                                height: "30px",
                                height: "30px",
                                paddingLeft: "10px",
                                borderColor: "#696969",
                                boxShadow: "none",
                                "&:hover": {
                                  borderColor: "#696969",
                                },
                                // "&:focus-out":{
                                //   borderColor:"#696969"
                                // },
                                // "&:focus":{
                                //   borderColor:"#eb788f"
                                // }
                              }),
                            }}
                          />
                          <img
                            style={{ width: "32px", height: "32px" }}
                            class="float-right"
                            id="myModal"
                            src={plusIconImage}
                            alt=""
                            onClick={(event) =>
                              this.openPopup(event, "insuranceplan", 0)
                            }
                            disabled={this.isDisabled(this.props.rights.add)}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.insurancePlanIDValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Payer ID</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            name="payerID"
                            id="payerID"
                            placeholder=" Payer ID"
                            disabled
                            value={this.state.patientPlanModel.payerID}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            Coverage<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8  p-0 m-0 float-left">
                          <select
                            name="coverage"
                            id="coverage"
                            value={this.state.patientPlanModel.coverage}
                            onChange={this.handleChange}
                            style={{ width: "100%", padding: "5px" }}
                            class="provider-form form-control-user"
                          >
                            {coverage.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.coverageValField}
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            RelationShip<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8  p-0 m-0 float-left">
                          <select
                            name="relationShip"
                            id="relationShip"
                            value={this.state.patientPlanModel.relationShip}
                            onChange={this.handleRelationShipChange}
                            style={{ width: "100%", padding: "5px" }}
                            class="provider-form form-control-user"
                          >
                            {relationship.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.relationShipValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            Subscriber ID<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder=" Subscriber ID"
                            name="subscriberId"
                            id="subscriberId"
                            maxLength="15"
                            value={this.state.patientPlanModel.subscriberId}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.subscriberIdValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Group Number</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Group Number"
                            name="groupNumber"
                            id="groupNumber"
                            maxLength="15"
                            value={this.state.patientPlanModel.groupNumber}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Group Name</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Group Name"
                            name="groupName"
                            id="groupName"
                            maxLength="15"
                            value={this.state.patientPlanModel.groupName}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Copay Amount</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Copay Amount"
                            name="copay"
                            id="copay"
                            maxLength="15"
                            value={this.state.patientPlanModel.copay}
                            onChange={this.handleAmountChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Deductible</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Deductible"
                            name="deductible"
                            id="deductible"
                            max
                            maxLength="15"
                            value={this.state.patientPlanModel.deductible}
                            onChange={this.handleAmountChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Remaining Deductible</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Remaining Deductible"
                            name="remainingDeductible"
                            id="remainingDeductible"
                            maxLength="15"
                            value={
                              this.state.patientPlanModel.remainingDeductible
                            }
                            onChange={this.handleAmountChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Effective Start Date</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="planBeginDate"
                            id="planBeginDate"
                            value={this.replace(
                              this.state.patientPlanModel.planBeginDate,
                              "T00:00:00",
                              ""
                            )}
                            onChange={this.handleDateChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {
                            this.state.validationModel
                              .effectiveStartDateValField
                          }
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Effective End Date</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="planEndDate"
                            id="planEndDate"
                            // value={planEndDate}
                            value={this.replace(
                              this.state.patientPlanModel.planEndDate,
                              "T00:00:00",
                              ""
                            )}
                            onChange={this.handleDateChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.effectiveEndDateValField}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Detail Header Ends */}

                {/* Subscriber info row starts here */}
                <br></br>
                <div class="row">
                  <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                    <div class="header pt-0">
                      <h6 class="heading">Subscriber Information</h6>
                      <hr
                        class="p-0 mt-0 mb-1"
                        style={{ backgroundColor: "#037592" }}
                      ></hr>
                      <div class="clearfix"></div>
                    </div>
                    <br></br>
                    <div class="row">
                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            Last Name <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="  Last Name "
                            name="lastName"
                            id="lastName"
                            maxLength="35"
                            value={this.state.patientPlanModel.lastName}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.lastNameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            First Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="First Name"
                            name="firstName"
                            id="firstName"
                            maxLength="35"
                            value={this.state.patientPlanModel.firstName}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.firstNameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Middle Initial</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Middle Initial"
                            name="middleInitial"
                            id="middleInitial"
                            maxLength="3"
                            value={this.state.patientPlanModel.middleInitial}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            Gender
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8  p-0 m-0 float-left">
                          <select
                            name="gender"
                            id="gender"
                            value={this.state.patientPlanModel.gender}
                            onChange={this.handleChange}
                            style={{ width: "100%", padding: "5px" }}
                            class="provider-form form-control-user"
                          >
                            {gender.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.relationShipValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            DOB
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="date"
                            class="provider-form w-100 form-control-user"
                            min="1900-01-01"
                            max="9999-12-31"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            name="dob"
                            id="dob"
                            // value={this.state.patientPlanModel.dob}
                            value={this.replace(
                              this.state.patientPlanModel.dob,
                              "T00:00:00",
                              ""
                            )}
                            onChange={this.handleDateChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.dobValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">SSN</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="SSN"
                            name="ssn"
                            id="ssn"
                            maxLength="9"
                            value={this.state.patientPlanModel.ssn}
                            onInput={this.onPaste}
                            // onChange={() => this.handleChange}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.ssnValField}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Subscriber info row Ends here */}

                {/* Subsscriber Address Starts Here */}
                <div class="row">
                  <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                    <div class="header pt-0">
                      <h6 class="heading">Subscriber Address</h6>
                      <hr
                        class="p-0 mt-0 mb-1"
                        style={{ backgroundColor: "#037592" }}
                      ></hr>
                      <div class="clearfix"></div>
                    </div>
                    <br></br>

                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <div class="col-md-2 float-left">
                          <label for="firstName">Address 1</label>
                        </div>
                        <div class="col-md-10 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Address 1 "
                            name="address1"
                            id="address1"
                            maxLength="55"
                            value={this.state.patientPlanModel.address1}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"></div>
                      </div>
                      <div class="col-md-6 mb-2">
                        <div class="col-md-2 float-left">
                          <label for="firstName">
                            Address 2
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Address 2"
                            name="address2"
                            id="address2"
                            maxLength="55"
                            value={this.state.patientPlanModel.address2}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback"></div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            City 
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form ml-1 w-100 form-control-user"
                            name="city"
                            id="city"
                            maxLength="20"
                            value={this.state.patientPlanModel.city}
                            onChange={this.handleChange}
                            placeholder="City "
                          />
                        </div>
                        <div class="invalid-feedback"></div>
                      </div>
                      <div class="col-md-3 mb-2">
                        <div class="col-md-3 float-left">
                          <label for="firstName">
                            State
                             {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 p-0 pl-0 float-left">
                          <select
                            class="w-100"
                            name="state"
                            id="state"
                            value={this.state.patientPlanModel.state}
                            onChange={this.handleChange}
                          >
                            {usStates.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback"></div>
                      </div>
                      <div class="col-md-6 mb-2">
                        <div class="col-md-2 float-left">
                          <label for="firstName">
                            Zip Code
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-4 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            name="zipCode"
                            id="zipCode"
                            maxLength="9"
                            value={this.state.patientPlanModel.zipCode}
                            onChange={this.handleZip}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                            placeholder="Zip Code"
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.zipCodeValField}
                        </div>
                        <div class="col-md-2 float-left">
                          <label for="firstName">
                            Cell#
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-4 float-left">
                          <NumberFormat
                            format="00 (###) ###-####"
                            mask="_"
                            class="provider-form w-100 form-control-user"
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            max="10"
                            placeholder="00 (111) 111-1111"
                            value={this.state.patientPlanModel.phoneNumber}
                            onChange={this.handleChange}
                            onKeyPress={(event) =>
                              this.handleNumericCheck(event)
                            }
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.phoneNumberValField}
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <div class="col-md-2 float-left">
                          <label for="firstName">
                            Email
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            name="email"
                            id="email"
                            maxLength="60"
                            value={this.state.patientPlanModel.email}
                            onChange={this.handleChange}
                            placeholder="Email"
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.emailValField}
                        </div>
                      </div>
                      <div class="col-md-6 mb-2"></div>
                    </div>
                  </div>
                </div>
                {/* Subscriber Address ends here */}

                {/* Insurance Plan Address Starts Here */}
                <div class="row">
                  <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                    <div class="header pt-0">
                      <h6 class="heading">Insurance Plan Address</h6>
                      <hr
                        class="p-0 mt-0 mb-1"
                        style={{ backgroundColor: "#037592" }}
                      ></hr>
                      <div class="clearfix"></div>
                    </div>
                    <br></br>

                    <div className="row">
                      <div class="col-md-6 mb-2">
                        <div class="col-md-2 float-left">
                          <label for="firstName">
                            <label for="firstName">
                              {this.state.patientPlanModel
                                .insurancePlanAddressID ? (
                                <a
                                  href="#"
                                  onClick={
                                    this.state.patientPlanModel
                                      .insurancePlanAddressID > 0
                                      ? (event) =>
                                          this.openPopup(
                                            event,
                                            "insuranceplanaddress",
                                            this.state.patientPlanModel
                                              .insurancePlanAddressID
                                          )
                                      : undefined
                                  }
                                >
                                  Plan Address
                                </a>
                              ) : (
                                <span> Plan Address</span>
                              )}
                            </label>
                          </label>
                        </div>
                        <div class="col-md-10 float-left">
                          <select
                            style={{ width: "90%", padding: "5px" }}
                            class="provider-form form-control-user"
                            name="insurancePlanAddressID"
                            id="insurancePlanAddressID"
                            value={
                              this.state.patientPlanModel
                                .insurancePlanAddressID == null
                                ? "Please Select"
                                : this.state.patientPlanModel
                                    .insurancePlanAddressID
                            }
                            onChange={this.handleIPAChange}
                          >
                            {this.state.insurancePlanAddresses.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.address1}
                              </option>
                            ))}
                          </select>
                          <a
                            href="popup-provider.html"
                            data-toggle="modal"
                            data-target="#logoutModal"
                          >
                            <img
                              class="float-right pt-1"
                              id="myModal"
                              src={plusImage}
                              style={{ width: "25px" }}
                              onClick={(event) =>
                                this.openInsurancePlanPopup(event, 0)
                              }
                              disabled={this.isDisabled(this.props.rights.add)}
                              alt=""
                            />
                          </a>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.locationIdValField} */}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div class="col-md-6 mb-2 col-sm-4">
                        <div class="col-md-2 float-left">
                          <label for="firstName">Address1</label>
                        </div>
                        <div class="col-md-10 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Address1"
                            name="address1"
                            id="address1"
                            disabled={true}
                            value={
                              this.state.insurancePlanAddressModel.address1
                            }
                            onChange={this.handleIPAModelChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.ssnValField} */}
                        </div>
                      </div>
                      <div class="col-md-6 mb-2 ">
                        <div class="col-md-2 float-left">
                          <label for="firstName">Address2</label>
                        </div>
                        <div class="col-md-10 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Address2"
                            name="address2"
                            id="address2"
                            disabled={true}
                            value={
                              this.state.insurancePlanAddressModel.address2
                            }
                            onChange={this.handleIPAModelChange}
                          />
                        </div>
                        <div class="invalid-feedback"></div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-3 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            City
                             {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form ml-1 w-100 form-control-user"
                            name="city"
                            id="city"
                            maxLength="20"
                            disabled={true}
                            value={this.state.insurancePlanAddressModel.city}
                            onChange={this.handleIPAModelChange}
                            placeholder="City "
                          />
                        </div>
                        <div class="invalid-feedback"></div>
                      </div>
                      <div class="col-md-3 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            State 
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form  w-100 form-control-user"
                            name="city"
                            id="city"
                            maxLength="20"
                            disabled={true}
                            value={this.state.insurancePlanAddressModel.state}
                            onChange={this.handleIPAModelChange}
                            placeholder="State "
                          />
                        </div>
                        <div class="invalid-feedback"></div>
                      </div>
                      <div class="col-md-6 mb-2">
                        <div class="col-md-2 float-left">
                          <label for="firstName">
                            Zip Code
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-4 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            name="zipCode"
                            id="zipCode"
                            maxLength="9"
                            disabled={true}
                            value={this.state.insurancePlanAddressModel.zipCode}
                            placeholder="Zip Code"
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.zipCodeValField} */}
                        </div>
                        <div class="col-md-2 float-left">
                          <label for="firstName">
                            Cell#
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-4 float-left">
                          <NumberFormat
                            format="00 (###) ###-####"
                            mask="_"
                            class="provider-form w-100 form-control-user"
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            disabled={true}
                            value={
                              this.state.insurancePlanAddressModel.phoneNumber
                            }
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.phoneNumberValField} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Insurance Plan Address Starts Here */}

                {/* <!-- Scroll to Top Button | save button starts--> */}
                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
                <div class="clearfix"></div>
                <br></br>
                <div class="row">
                  {/* <!--Address Information start here--> */}
                  <div class="col-12 pt-2 text-center">
                    <button
                      class="btn btn-primary mr-2"
                      onClick={this.savePatientPlan}
                      disabled={this.isDisabled(
                        this.state.editId > 0
                          ? this.props.rights.update
                          : this.props.rights.add
                      )}
                    >
                      Save
                    </button>
                    <button
                      class="btn btn-primary mr-2"
                      onClick={
                        this.props.patientID > 0
                          ? () => this.props.onClose()
                          : this.cancelBtn
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {/* <!-- Scroll to Top Button | save button ends--> */}

                {/* Eligibility Grid Starts here */}

                <div class="header pt-2">
                  <h6 class="heading">Patient Payments</h6>
                </div>
                <div
                  class="clearfix"
                  style={{ borderBottom: "1px solid #037592" }}
                ></div>
                <div class="card mb-4 mt-3">
                  <div class="card-header py-1">
                    <h6 class="m-0 font-weight-bold text-primary search-h">
                      PATIENT ELIGIBILITY
                      <button
                        class="btn btn-primary ml-5 float-right"
                        id="myModal"
                        onClick={(event) =>
                          this.openEligibilityCodePopup(
                            event,
                            this.state.patientPlanModel.id
                          )
                        }
                      >
                        Perform Eligibility
                      </button>
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      {/* <!-- Patient PAyment table contetn --> */}
                      <div
                        style={{ overflowX: "hidden" }}
                        id="dataTable_wrapper"
                        class="dataTables_wrapper dt-bootstrap4"
                      >
                        <MDBDataTable
                          responsive={true}
                          striped
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

                {/* Eligibility Grid Ends here */}
              </div>
              {/* <!-- Tab Pane Ends Here --> */}
            </div>
            {/* <!-- Tab Content Ends --> */}
          </div>
          {/* <!-- Container Top Ends Here --> */}

          {/* <!-- End of Main Content --> */}

          {/* <!-- Footer --> */}
          <footer class="sticky-footer bg-white">
            <div class="container my-auto">
              <div class="copyright text-center my-auto">
                {" "}
                <span>
                  Version 1.0 <br />
                  Copyright &copy; 2020 Bellmedex LLC. All rights reserved.
                </span>{" "}
              </div>
            </div>
          </footer>
          {/* <!-- End of Footer --> */}
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
    insurancePlans: state.insurancePlans
      ? state.insurancePlans.insurancePlans
      : [],
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.patientPlanSearch,
          add: state.loginInfo.rights.patientPlanCreate,
          update: state.loginInfo.rights.patientPlanUpdate,
          delete: state.loginInfo.rights.patientPlanDelete,
          export: state.loginInfo.rights.patientPlanExport,
          import: state.loginInfo.rights.patientPlanImport,
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
  connect(mapStateToProps, matchDispatchToProps)(PatientPlan)
);

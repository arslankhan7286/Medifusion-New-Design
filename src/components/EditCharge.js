import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import Select from "react-select";
import { Tabs, Tab } from "react-tab-view";
import { MDBDataTable } from "mdbreact";
import { MDBBtn } from "mdbreact";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import backIcon from "../images/icons/back-icon.png";
import frontIcon from "../images/icons/front-icon.png";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class EditCharge extends Component {
  constructor(props) {
    super(props);

    this.submissionHistoryUrl =
      process.env.REACT_APP_URL + "/ChargeSubmissionHistory/";
    this.resubmissionHistoryUrl =
      process.env.REACT_APP_URL + "/ResubmitHistory/";
    this.chargeUrl = process.env.REACT_APP_URL + "/Charge/";
    this.visitUrl = process.env.REACT_APP_URL + "/visit/";
    this.patientPlanUrl = process.env.REACT_APP_URL + "/patientPlan/";
    this.paymentLedgerUrl = process.env.REACT_APP_URL + "/PaymentLedger/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.currentIndex = 0;
    this.submitSearchModel = {
      addedDate: "",
      submitType: "",
      receiver: "",
      formType: "",
      plan: "",
      coverage: "",
      addedBy: "",
    };

    this.resubmitModel = {
      addedDate: "",
      addedBy: "",
    };

    this.auditModel = {
      addedDate: "",
      field: "",
      previousValue: "",
      newValue: "",
      addedBy: "",
    };

    this.paymentLedgerModel = {
      id: "",
      chargeID: "",
      visitID: "",
      patientPlanID: "",
      patientPaymentChargeID: "",
      paymentChargeID: "",
      adjustmentCodeID: "",
      adjustmentCode: "",
      ledgerBy: "",
      ledgerType: "",
      ledgerDescription: "",
      ledgerDate: "",
      amount: "",
      covrage: "",
      addedBy: "",
    };

    this.chargeValidationModel = {
      dosToValField: "",
      validation: false,
    };

    this.chargeModel = {
      id: null,
      cptid: null,
      cptObj: {},
      dateOfServiceFrom: "",
      dateOfServiceTo: "",
      modifier1ID: null,
      units: "",
      isSubmitted: false,
      submittetdDate: "",
      submissionLogID: null,
      isDontPrint: false,
      patientID: null,

      ndcUnits: "",
      ndcNumber: "",
      ndcMeasurementUnit: "",
      primaryPatientPlanID: null,
      secondaryPatientPlanID: null,
      tertiaryPatientPlanID: null,

      primaryBilledAmount: "",
      primaryPlanAmount: "",
      primaryPlanAllowed: "",
      primaryPlanPaid: "",
      primaryWriteOff: "",

      //Secondary Plan Fields
      secondaryBilledAmount: "",
      secondaryAllowed: "",
      secondaryWriteOff: "",
      secondaryPaid: "",
      secondaryPatResp: "",
      secondaryBal: "",
      secondaryTransferred: "",
      secondaryStatus: "",
    };

    this.state = {
      submitSearchModel: this.submitSearchModel,
      editId: this.props.chargeId ? this.props.chargeId : 0,
      submitdata: [],
      id: 0,
      resubmitModel: this.resubmitModel,
      resubmitdata: [],

      auditModel: this.auditModel,
      auditdata: [],

      paymentLedgerModel: this.paymentLedgerModel,
      paymentLedgerdata: [],

      chargeModel: this.chargeModel,
      chargeValidationModel: this.chargeValidationModel,
      practice: [],
      location: [],
      provider: [],
      refProvider: [],
      supProvider: [],
      pos: [],

      patientPlanDropdown: [],
      primaryPlanName: "",
      secondaryPlanName: "",
      cptOptions: [],
      options: [],
      modifierOptions: [],
      chargesList: this.props.chargesList ? this.props.chargesList : [],
      cptLabel: "",
      icd1Label: "",
      icd2Label: "",
      icd3Label: "",
      icd4Label: "",
      modifierLabel: "",
      maxHeight: "361",
      loading: false,
    };
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveCharge = this.saveCharge.bind(this);
    this.handleNDCUnitsChange = this.handleNDCUnitsChange.bind(this);
    this.reSubmitCharge = this.reSubmitCharge.bind(this);
    this.isNull = this.isNull.bind(this);
    this.nextVisit = this.nextVisit.bind(this);
    this.previousVisit = this.previousVisit.bind(this);
    //  this.searchSubmit= this.searchSubmit.bind(this);
  }

  setModalMaxHeight(element) {
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.setState({ maxHeight: maxHeight });
  }

  async componentDidMount() {
    //Adding custom className for CSS
    Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " userTab";
    });

    this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    this.setState({ loading: true });

    await axios
      .get(this.chargeUrl + "FindCharge/" + this.state.editId, this.config)
      .then((response) => {
        this.setState({
          chargeModel: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    axios
      .get(
        this.patientPlanUrl +
          "GetpatientPlansByPatientID/" +
          this.state.chargeModel.patientID,
        this.config
      )
      .then((res) => {
        let primaryPatientPlan = res.data.filter(
          (patientPlan) => patientPlan.description == "P"
        );
        this.setState({
          primaryPlanName:
            primaryPatientPlan.length > 0
              ? "Primary - " + primaryPatientPlan[0].description2
              : "",
        });
        let secondaryPatientPlan = res.data.filter(
          (patientPlan) => patientPlan.description == "S"
        );
        this.setState({
          secondaryPlanName:
            secondaryPatientPlan.length > 0
              ? "Secondary - " + secondaryPatientPlan[0].description2
              : "",
        });
        // this.setState({
        //   primaryPlanName: "Primary - " + res.data.coverage

        // })
      });

    var cpt = {};
    cpt = await this.props.cptCodes.filter(
      (option) => option.id == this.state.chargeModel.cptid
    );

    const icd1 = await this.props.icdCodes.filter(
      (option) => option.id == this.props.icd1Id
    );
    const icd2 = await this.props.icdCodes.filter(
      (option) => option.id == this.props.icd2Id
    );
    const icd3 = await this.props.icdCodes.filter(
      (option) => option.id == this.props.icd3Id
    );
    const icd4 = await this.props.icdCodes.filter(
      (option) => option.id == this.props.icd4Id
    );

    var modifier1 = await this.props.modifiers.filter(
      (option) => option.id == this.state.chargeModel.modifier1ID
    );
    var modifier2 = await this.props.modifiers.filter(
      (option) => option.id == this.state.chargeModel.modifier2ID
    );
    var modifier3 = await this.props.modifiers.filter(
      (option) => option.id == this.state.chargeModel.modifier3ID
    );
    var modifier4 = await this.props.modifiers.filter(
      (option) => option.id == this.state.chargeModel.modifier4ID
    );

    await this.setState({
      cptLabel: cpt.length > 0 ? cpt[0].label : "",
      icd1Label: icd1.length > 0 ? icd1[0].label : "",
      icd2Label: icd2.length > 0 ? icd2[0].label : "",
      icd3Label: icd3.length > 0 ? icd3[0].label : "",
      icd4Label: icd4.length > 0 ? icd4[0].label : "",
      modifierLabel:
        (modifier1.length > 0 ? modifier1[0].label : "") +
        (modifier2.length > 0 ? modifier2[0].label + " , " : "") +
        (modifier3.length > 0 ? modifier3[0].label + " , " : "") +
        (modifier4.length > 0 ? modifier4[0].label + " , " : ""),
    });

    //submit grid
    axios
      .get(
        this.submissionHistoryUrl + "FindChargeSubmission/" + this.state.editId,
        this.config
      )
      .then(async (response) => {
        let newList = [];

        await response.data.map((row, i) => {
          var submitType = row.submitType == null ? "  " : row.submitType;
          newList.push({
            date: row.addedDate.slice(0, 10),
            submitType: submitType,
            receiver: row.receiver,
            formType: row.formType,
            Plan: row.plan,
            coverage: row.coverage,
            user: row.user,
          });
          this.setState({ submitdata: newList });
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    //re-submit grid
    axios
      .get(
        this.resubmissionHistoryUrl +
          "GetResubmitChargeHistory/" +
          this.state.editId,
        this.config
      )
      .then(async (response) => {
        let newList = [];
        await response.data.map((row, i) => {
          var date = row.addedDate ? row.addedDate.slice(0, 10) : "";
          date = row.addedDate
            ? row.addedDate.slice(5, 7) +
              "/" +
              row.addedDate.slice(8, 10) +
              "/" +
              row.addedDate.slice(0, 4)
            : "";

          newList.push({
            date: date,
            user: row.addedBy,
          });
        });
        this.setState({ resubmitdata: newList });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    //audit grid
    axios
      .get(this.chargeUrl + "GetChargeAudit/" + this.state.editId, this.config)
      .then(async (response) => {
        let newList = [];

        await response.data.map((row, i) => {
          var date = row.addedDate ? row.addedDate.slice(0, 10) : "";
          date = row.addedDate
            ? row.addedDate.slice(5, 7) +
              "/" +
              row.addedDate.slice(8, 10) +
              "/" +
              row.addedDate.slice(0, 4)
            : "";

          newList.push({
            date: date,
            field: row.columnName,
            previousValue: this.handleDate(row.columnName, row.currentValue),
            //newValue: row.newValue.replace(/-/g, "/"),
            newValue: this.handleDate(row.columnName, row.newValue),
            user: row.addedBy,
          });
        });
        this.setState({ auditdata: newList });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    //payment ledger grid
    axios
      .get(
        this.paymentLedgerUrl + "GetPaymentLedger/" + this.state.editId,
        this.config
      )
      .then(async (response) => {
        let newList = [];

        await response.data.map((row, i) => {
          var ledgerDate = row.ledgerDate.slice(0, 10);
          newList.push({
            ledgerDate: row.ledgerDate,
            ledgerBy: row.ledgerBy,
            ledgerType: row.ledgerType,
            ledgerDescription:
              this.isNull(row.ledgerDescription) == true
                ? " "
                : row.ledgerDescription,
            checkNumber: row.checkNumber,
            amount: row.amount > 0 ? "$" + row.amount : "",
            covrage: this.isNull(row.covrage) == true ? " " : row.covrage,
            addedBy: this.isNull(row.addedBy) == true ? " " : row.addedBy,
          });
        });
        this.setState({ paymentLedgerdata: newList });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    this.setState({ loading: false });
  }

  handleDate = (field, data) => {
    if (field === "SubmittetdDate") {
      var d = data ? data.slice(0, 10) : "";
      d = d
        ? data.slice(5, 7) + "/" + data.slice(8, 10) + "/" + data.slice(0, 4)
        : "";
      console.log(d);
      return d;
    } else return data;
  };

  handleChange(event) {
    if (event.target.name == "isDontPrint") {
      this.setState({
        chargeModel: {
          ...this.state.chargeModel,
          isDontPrint: !this.state.chargeModel.isDontPrint,
        },
      });
    } else {
      this.setState({
        chargeModel: {
          ...this.state.chargeModel,
          [event.target.name]:
            event.target.value == "Please Select"
              ? null
              : event.target.value.toUpperCase(),
        },
      });
    }
  }

  handleNDCUnitsChange = (event) => {
    const amount = event.target.value;
    var name = event.target.name;
    var regexp = /^\d+(\.(\d{1,2})?)?$/;

    if (regexp.test(amount)) {
      this.setState({
        chargeModel: {
          ...this.state.chargeModel,
          [name]: Number(amount),
        },
      });
    } else if (amount == "") {
      this.setState({
        chargeModel: {
          ...this.state.chargeModel,
          [name]: "",
        },
      });
    }
  };

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

  saveCharge() {
    // var chargeVal;
    // chargeVal = { ...this.chargeValidationModel };
    // chargeVal.validation = false;
    // //DOS To greater than check
    // if (
    //   !this.isNull(this.state.chargeModel.dateOfServiceFrom) &&
    //   !this.isNull(this.state.chargeModel.dateOfServiceTo)
    // ) {
    //   var dosFrom = new Date(this.state.chargeModel.dateOfServiceFrom);
    //   var dosTo = new Date(this.state.chargeModel.dateOfServiceTo);
    //   if (dosTo < dosFrom) {
    //     chargeVal.dosToValField = (
    //       <span className="validationMsg">
    //         DOS To must be greater than DOS From
    //       </span>
    //     );
    //     chargeVal.validation = true;
    //   }
    // } else {
    //   chargeVal.dosToValField = "";
    //   if (chargeVal.validation === false) chargeVal.validation = false;
    // }

    // this.setState({
    //   chargeValidationModel: chargeVal
    // });

    // if (chargeVal.validation === true) {
    //   Swal.fire(
    //     "SOMETHING WRONG",
    //     "Please Select All Fields Properly",
    //     "error"
    //   );
    //   return;
    // }

    axios
      .post(this.chargeUrl + "savecharge", this.state.chargeModel, this.config)
      .then((response) => {
        this.setState({
          chargeModel: response.data,
        });
        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch((error) => {
        Swal.fire("Please Select All Fields Properly", "", "error");
      });
  }

  //resubmit Charge
  reSubmitCharge() {
    if (this.state.chargeModel.isSubmitted === true) {
      axios
        .get(this.visitUrl + "ResubmitCharge/" + this.state.chargeModel.id)
        .then((response) => {
          this.setState({ chargeModel: response.data });

          this.componentDidMount();

          Swal.fire("SUCCESS", "Charge Re-Submited Successfully", "success");
        });
    } else {
      Swal.fire(
        "SOMETHING WRONG",
        "Charge can not be Re-Submitted,First Submit the Charge",
        "error"
      );
    }
  }

  //Previous Visit
  async previousVisit() {
    if (this.currentIndex - 1 < 0) {
      Swal.fire("No More Charges", "", "warning");
      return;
    }
    this.currentIndex = this.currentIndex - 1;
    var charge = this.state.chargesList[this.currentIndex];
    await this.setState({
      editId: charge.id,
      chargeModel: {
        ...this.state.chargeModel,
        id: 0,
      },
    });
    this.componentDidMount();
  }

  //NextVisit
  async nextVisit() {
    if (this.currentIndex + 1 >= this.state.chargesList.length) {
      Swal.fire("No More Charges", "", "warning");
      return;
    }
    this.currentIndex = this.currentIndex + 1;
    var charge = this.state.chargesList[this.currentIndex];
    await this.setState({
      editId: charge.id,
      chargeModel: {
        ...this.state.chargeModel,
        id: 0,
      },
    });
    this.componentDidMount();
  }

  render() {
    try {
      this.state.chargesList.filter((charge, index) => {
        if (charge.id == this.state.editId) {
          this.currentIndex = index;
        }
      });
    } catch {}

    if (this.props.userInfo.userPractices.length > 0) {
      if (this.state.practice.length == 0) {
        this.setState({
          visitModel: {
            ...this.state.visitModel,
            practiceID: this.props.userInfo.practiceID,
          },
          practice: this.props.userInfo.userPractices,
          location: this.props.userInfo.userLocations,
          provider: this.props.userInfo.userProviders,
          refProvider: this.props.userInfo.userRefProviders,
        });
      }
    }

    var dosFrom = this.state.chargeModel.dateOfServiceFrom
      ? this.state.chargeModel.dateOfServiceFrom.slice(0, 10)
      : "";
    var dosTo = this.state.chargeModel.dateOfServiceTo
      ? this.state.chargeModel.dateOfServiceTo.slice(0, 10)
      : "";
    var submittedDate = this.state.chargeModel.submittetdDate
      ? this.state.chargeModel.submittetdDate.slice(0, 10)
      : "";
    submittedDate = submittedDate
      ? submittedDate.slice(5, 7) +
        "/" +
        submittedDate.slice(8, 10) +
        "/" +
        submittedDate.slice(0, 4)
      : "";

      let primaryStatus = [];
      try{
        if(this.state.chargeModel.primaryStatus  == "Pending"){
          primaryStatus=[
            { value: "N", display: "New Charge" },
          { value: "Pending", display: "Pending" },
          ]
        }else{
          primaryStatus=[
          { value: "N", display: "New Charge" },
          { value: "S", display: "Submitted" },
          { value: "K", display: "999 Accepted" },
          { value: "W", display: "Write Off" },
          { value: "D", display: "999 Denied" },
          { value: "E", display: "999 has Errors" },
          { value: "P", display: "Paid" },
          { value: "PT_P", display: "Patient Paid" },
          { value: "PPTS", display: "Paid-Transferred To Sec" },
          { value: "PPTT", display: "Paid-Transferred To Ter" },
          { value: "PPTP", display: "Paid-Transferred To Patient" },
          { value: "SPTP", display: "Paid-Transferred To Patient" },
          { value: "SPTT", display: "Paid-Transferred To Ter" },
          { value: "PR_TP", display: "Pat. Resp. Transferred to Pat" },
          { value: "DN", display: "Denied" },
          { value: "PPTM", display: "Paid - Medigaped" },
          { value: "M", display: "Medigaped " },
          { value: "R", display: "Rejected" },
          { value: "A1AY", display: "Received By Clearing House" },
          { value: "A0PR", display: "Farwarded to Payer" },
          { value: "A1PR", display: "Received By Payer" },
          { value: "A2PR", display: "Accepted By Payer" },
          { value: "TS", display: "Transferred to Secondary" },
          { value: "TT", display: "Accepted By Tertiary" },
          { value: "PTPT", display: "Plan to Patient Transfer" },
          { value: "PAT_T_PT", display: "Patient to Plan Transfer" },
        ];
      }
      }catch{
        primaryStatus=[]
      }


    const status = [
      { value: "N", display: "New Charge" },
      { value: "S", display: "Submitted" },
      { value: "K", display: "999 Accepted" },
      { value: "W", display: "Write Off" },
      { value: "D", display: "999 Denied" },
      { value: "E", display: "999 has Errors" },
      { value: "P", display: "Paid" },
      { value: "DN", display: "Denied" },
      { value: "PT_P", display: "Patient Paid" },
      { value: "PPTS", display: "Paid-Transfered To Sec" },
      { value: "PPTT", display: "Paid-Transfered To Ter" },
      { value: "PPTP", display: "Paid-Transfered To Patient" },
      { value: "SPTP", display: "Paid-Transfered To Patient" },
      { value: "SPTT", display: "Paid-Transfered To Ter" },
      { value: "PR_TP", display: "Pat. Resp. Transferred to Pat" },
      { value: "PPTM", display: "Paid - Medigaped" },
      { value: "M", display: "Medigaped " },
      { value: "R", display: "Rejected" },
      { value: "A1AY", display: "Received By Clearing House" },
      { value: "A0PR", display: "Farwarded to Payer" },
      { value: "A1PR", display: "Received By Payer" },
      { value: "A2PR", display: "Accepted By Payer" },
      { value: "TS", display: "Transferred to Secendary" },
      { value: "TT", display: "Accepted By Tertiary" },
      { value: "PTPT", display: "Plan to Patient Transfer" },
      { value: "PAT_T_PT", display: "Patient to Plan Transfer" },
    ];

    const headers = ["Payment Ledger", "Submit", "Re-Submit", "Audit"];

    const insuranceInfoHeaders = ["Primary Plan", "Secondary Plan"];

    const submitdata = {
      columns: [
        {
          label: "DATE",
          field: "date",
          sort: "asc",
          width: 150,
        },
        {
          label: "SUBMIT TYPE",
          field: "submitType",
          sort: "asc",
          width: 150,
        },
        {
          label: "RECEIVER ",
          field: "receiver",
          sort: "asc",
          width: 150,
        },
        {
          label: "FORM TYPE",
          field: "formType",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN",
          field: "Plan",
          sort: "asc",
          width: 150,
        },
        {
          label: "COVERAGE",
          field: "coverage",
          sort: "asc",
          width: 150,
        },
        {
          label: "USER",
          field: "user",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.submitdata,
    };

    const resubmitdata = {
      columns: [
        {
          label: "DATE",
          field: "date",
          sort: "asc",
          width: 150,
        },
        {
          label: "USER",
          field: "user",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.resubmitdata,
    };

    const auditdata = {
      columns: [
        {
          label: "DATE",
          field: "date",
          sort: "asc",
          width: 150,
        },
        {
          label: "FIELD",
          field: "field",
          sort: "asc",
          width: 150,
        },
        {
          label: "PREVIOUS VALUE",
          field: "previousValue",
          sort: "asc",
          width: 150,
        },
        {
          label: "NEW VALUE",
          field: "newValue",
          sort: "asc",
          width: 150,
        },
        {
          label: "USER",
          field: "user",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.auditdata,
    };

    const paymentLedgerdata = {
      columns: [
        {
          label: "LEDGER DATE",
          field: "ledgerDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "LEDGER BY",
          field: "ledgerBy",
          sort: "asc",
          width: 150,
        },
        {
          label: "LEDGER TYPE",
          field: "ledgerType",
          sort: "asc",
          width: 150,
        },
        {
          label: "LEDGER DESCRIPTION",
          field: "ledgerDescription",
          sort: "asc",
          width: 150,
        },
        {
          label: "CHECK NUM",
          field: "checkNumber",
          sort: "asc",
          width: 150,
        },

        {
          label: "AMOUNT",
          field: "amount",
          sort: "asc",
          width: 150,
        },
        {
          label: "COVERAGE",
          field: "covrage",
          sort: "asc",
          width: 150,
        },
        {
          label: "ADDED BY",
          field: "addedBy",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.paymentLedgerdata,
    };

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

    const ndcUnitOfMeasurement = [
      { value: "", display: "Select State" },
      { value: "F2", display: "International Unit " },
      { value: "GR", display: "Gram" },
      { value: "ML", display: "Milliliter" },
      { value: "UN", display: "Unit" },
    ];
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
            // style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "300px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h6>
                        <span class="h4 float-left">
                          CHARGE # {this.state.chargeModel.id}
                        </span>

                        <div class="col-md-5 pl-5 p-0 pt-1 m-0 w-20 text-center float-left">
                          {!(this.props.popupVisitId > 0) &&
                          this.state.editId > 0 ? (
                            <React.Fragment>
                              <img
                                src={backIcon}
                                style={{ width: "30px", height: "30px" }}
                                alt="backicon"
                                onClick={this.previousVisit}
                              />
                              <img
                                src={frontIcon}
                                style={{ width: "30px", height: "30px" }}
                                alt="backicon"
                                onClick={this.nextVisit}
                              />
                            </React.Fragment>
                          ) : null}
                        </div>

                        <div class="float-lg-right text-right">
                          <button
                            style={{ marginTop: "-5px" }}
                            class=" btn btn-primary mr-2"
                            type="button"
                            onClick={this.reSubmitCharge}
                          >
                            Re-Submit
                          </button>

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
                      </h6>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    {/* Main Content */}
                    <br></br>
                    <div class="row">
                      <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                        <div class="row">
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                CPT
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="CPT"
                                disabled="disabled"
                                value={this.state.cptLabel}
                                name="cptid"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.lastNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-8 mb-2 col-sm-8">
                            <div class="col-md-2 float-left">
                              <label for="firstName">
                                Service Desc
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-10 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="  Service Desc"
                                value={this.state.chargeModel.description}
                                onChange={this.handleChange}
                                max="30"
                                name="description"
                                id="description"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.firstNameValField} */}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                DOS From
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                disabled
                                name="dateOfServiceFrom"
                                id="dateOfServiceFrom"
                                value={dosFrom}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.lastNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                DOS To
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="date"
                                class="provider-form w-100 form-control-user"
                                placeholder="  Location"
                                disabled="disabled"
                                name="dateOfServiceTo"
                                id="dateOfServiceTo"
                                value={dosTo}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.chargeValidationModel.dosToValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Units</label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" Units"
                                disabled
                                value={this.state.chargeModel.units}
                                name="units"
                                id=""
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
                                ICD1
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ICD1"
                                disabled="disabled"
                                value={this.state.icd1Label}
                                name="icd1Id"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.lastNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                ICD2
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="  ICD2"
                                disabled="disabled"
                                value={this.state.icd2Label}
                                name="icd1Id"
                                id="ICD2"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.firstNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Modifiers</label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="  Modifiers"
                                disabled="disabled"
                                value={this.state.modifierLabel}
                                name="modifier1ID"
                                id="Modifiers"
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
                                ICD3
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="ICD3"
                                disabled="disabled"
                                value={this.state.icd3Label}
                                name="icd1Id"
                                id="ICD3"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.lastNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                ICD4
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="  ICD4"
                                disabled="disabled"
                                value={this.state.icd4Label}
                                name="icd1Id"
                                id="ICD4"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.firstNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Don't Print</label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                style={{ width: "20px", height: "20px" }}
                                type="checkbox"
                                // class="provider-form w-100 form-control-user"
                                id="isDontPrintCB"
                                name="isDontPrint"
                                checked={this.state.chargeModel.isDontPrint}
                                onClick={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.accountNumValField} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* NDC info starts here */}
                    <div class="row">
                      <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                        <div class="header pt-0">
                          <h6 class="heading">NDC Info</h6>
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
                                NDC #{/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NDC #"
                                value={this.state.chargeModel.ndcNumber}
                                onChange={this.handleChange}
                                name="ndcNumber"
                                maxLength="10"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.lastNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                NDC Units
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="  NDC Units"
                                value={this.state.chargeModel.ndcUnits}
                                onChange={this.handleNDCUnitsChange}
                                name="ndcUnits"
                                id="NDC Units"
                                maxLength="10"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.firstNameValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">NDC UOM</label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <select
                                name="ndcMeasurementUnit"
                                id="ndcMeasurementUnit"
                                value={
                                  this.state.chargeModel.ndcMeasurementUnit
                                }
                                onChange={this.handleChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {ndcUnitOfMeasurement.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.accountNumValField} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* NDC info ends here */}

                    {/* Submission Info Starts Here */}
                    <div class="row">
                      <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                        <div class="header pt-0">
                          <h6 class="heading">Submission Info</h6>
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
                              <label for="firstName">Submitted</label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                style={{ width: "20px", height: "20px" }}
                                type="checkbox"
                                // class="provider-form w-100 form-control-user"
                                checked={this.state.chargeModel.isSubmitted}
                                id="markInactive0"
                                disabled
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.accountNumValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Submitted Date
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Submitted Date"
                                disabled="disabled"
                                value={
                                  this.state.chargeModel.isSubmitted
                                    ? submittedDate
                                    : ""
                                }
                                name="submittetdDate"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.lastNameValField} */}
                            </div>
                          </div>
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Submission Batch
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 p-0 m-0 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="  Submission Batch"
                                disabled="disabled"
                                value={this.state.chargeModel.submissionLogID}
                                name="submissionLogID"
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.firstNameValField} */}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-11 mb-2">
                            <div class="col-md-1 float-left">
                              <label>Rejection Reason</label>
                            </div>
                            <div class="col-md-11 pl-5 float-left">
                              <textarea
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Rejection Reason"
                                disabled
                                value={this.state.chargeModel.rejectionReason}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Submission Info ends Here */}

                    {/* Insurance Info Starts here */}
                    <div class="row">
                      <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                        <div class="header pt-4">
                          <h6 class="heading">Insurance Info</h6>
                          <div
                            class="clearfix"
                            style={{ borderBottom: "1px solid #037592" }}
                          ></div>
                          <div class="clearfix"></div>
                        </div>
                        {/* <!-- Insurance Info tabs Start here --> */}
                        <Tabs
                          headers={insuranceInfoHeaders}
                          style={{ cursor: "default" }}
                        >
                          <Tab>
                            <div class="col-md-12 mt-3 order-md-1 provider-form">
                              <div class="row">
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-4 float-left">
                                    <label>Plan</label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      class="provider-form w-100 form-control-user"
                                      placeholder="Plan"
                                      disabled
                                      value={this.state.primaryPlanName}
                                      name="primaryPlanName"
                                      id="primaryPlanName"
                                    />
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-3 float-left">
                                    <label for="firstName">
                                      Billed / Allowed
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      style={{ width: "42%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Billed"
                                      disabled
                                      value={
                                        this.state.chargeModel
                                          .primaryBilledAmount
                                      }
                                      name="primaryBilledAmount"
                                      id="primaryBilledAmount"
                                    />
                                    <input
                                      type="text"
                                      style={{ width: "55%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Allowed"
                                      disabled
                                      value={
                                        this.state.chargeModel.primaryAllowed
                                      }
                                      name="primaryAllowed"
                                      id="primaryAllowed"
                                    />
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-3 float-left">
                                    <label for="firstName">
                                      WriteOff / Paid
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      style={{ width: "42%" }}
                                      class="provider-form form-control-user"
                                      placeholder="WriteOff "
                                      disabled
                                      value={
                                        this.state.chargeModel.primaryWriteOff
                                      }
                                      name="primaryWriteOff"
                                      id="primaryWriteOff"
                                      onChange={this.handleChange}
                                    />
                                    <input
                                      type="text"
                                      style={{ width: "55%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Paid"
                                      disabled
                                      value={this.state.chargeModel.primaryPaid}
                                      name="primaryPaid"
                                      id="primaryPaid"
                                    />
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-4 float-left">
                                    <label for="firstName">
                                      Plan Bal/Pat-Bal
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      style={{ width: "42%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Plan Bal"
                                      disabled
                                      value={this.state.chargeModel.primaryBal}
                                      name="primaryBal"
                                      id="primaryBal"
                                    />
                                    <input
                                      type="text"
                                      style={{ width: "55%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Pat Bal"
                                      disabled
                                      value={
                                        this.state.chargeModel.primaryPatientBal
                                      }
                                      name="primaryPatientBal"
                                      id="primaryPatientBal"
                                    />
                                  </div>
                                  <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-3 float-left">
                                    <label for="firstName">
                                      Pat Paid/Trans
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      style={{ width: "42%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Pat Paid"
                                      disabled
                                      value={this.state.chargeModel.patientPaid}
                                      name="patientPaid"
                                      id="patientPaid"
                                    />
                                    <input
                                      type="text"
                                      style={{ width: "55%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Transferred"
                                      disabled
                                      value={
                                        this.state.chargeModel
                                          .primaryTransferred
                                      }
                                      name="primaryTransferred"
                                      id="primaryTransferred"
                                    />
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-3 float-left">
                                    <label for="firstName">Status</label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                     <select
                                  disabled={this.state.chargeModel.primaryStatus == "Pending" ? false : true}
                                  name="primaryStatus"
                                  id="primaryStatus"
                                  value={this.state.chargeModel.primaryStatus}
                                  onChange={this.handleChange}
                                >
                                  {primaryStatus.map((s) => (
                                    <option key={s.value} value={s.value}>
                                      {" "}
                                      {s.display}{" "}
                                    </option>
                                  ))}{" "}
                                </select>
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                              </div>
                            </div>
                          </Tab>
                          <Tab>
                            <div class="col-md-12 mt-3 order-md-1 provider-form">
                              <div class="row">
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-4 float-left">
                                    <label>Plan</label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      class="provider-form w-100 form-control-user"
                                      placeholder="Plan"
                                      disabled
                                      value={this.state.secondaryPlanName}
                                      name="secondaryPlanName"
                                      id="secondaryPlanName"
                                    />
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-3 float-left">
                                    <label for="firstName">
                                      Billed / Allowed
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      style={{ width: "42%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Billed"
                                      disabled
                                      value={
                                        this.state.chargeModel
                                          .secondaryBilledAmount
                                      }
                                      name="secondaryBilledAmount"
                                      id="secondaryBilledAmount"
                                    />
                                    <input
                                      type="text"
                                      style={{ width: "55%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Allowed"
                                      disabled
                                      value={
                                        this.state.chargeModel.secondaryAllowed
                                      }
                                      name="secondaryAllowed"
                                      id="secondaryAllowed"
                                    />
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-3 float-left">
                                    <label for="firstName">
                                      WriteOff / Paid
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      style={{ width: "42%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Weiteoff"
                                      disabled
                                      value={
                                        this.state.chargeModel.secondaryWriteOff
                                      }
                                      name="secondaryWriteOff"
                                      id="secondaryWriteOff"
                                    />
                                    <input
                                      type="text"
                                      style={{ width: "55%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Paid"
                                      disabled
                                      value={
                                        this.state.chargeModel.secondaryPaid
                                      }
                                      name="secondaryPaid"
                                      id="secondaryPaid"
                                    />
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-4 float-left">
                                    <label for="firstName">
                                      Plan Bal/Pat-Bal
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      style={{ width: "42%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Plan Bal"
                                      disabled
                                      value={
                                        this.state.chargeModel.secondaryBal
                                      }
                                      name="secondaryBal"
                                      id="secondaryBal"
                                    />
                                    <input
                                      type="text"
                                      style={{ width: "55%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Pat Bal"
                                      disabled
                                      value={
                                        this.state.chargeModel.secondaryPatResp
                                      }
                                      name="secondaryPatResp"
                                      id="secondaryPatResp"
                                    />
                                  </div>
                                  <div class="invalid-feedback"></div>
                                </div>
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-3 float-left">
                                    <label for="firstName">
                                      Pat Paid/Trans
                                    </label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <input
                                      type="text"
                                      style={{ width: "42%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Pat Paid"
                                      disabled
                                      value={this.state.chargeModel.patientPaid}
                                      name="patientPaid"
                                      id="patientPaid"
                                    />
                                    <input
                                      type="text"
                                      style={{ width: "55%" }}
                                      class="provider-form form-control-user"
                                      placeholder="Transferred"
                                      disabled
                                      value={
                                        this.state.chargeModel
                                          .secondaryTransferred
                                      }
                                      name="secondaryTransferred"
                                      id="secondaryTransferred"
                                    />
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                                <div class="col-md-4 mb-4">
                                  <div class="col-md-3 float-left">
                                    <label for="firstName">Status</label>
                                  </div>
                                  <div class="col-md-8 float-left">
                                    <select
                                      style={{ width: "100%", padding: "5px" }}
                                      class="provider-form form-control-user"
                                      disabled
                                      name="secondaryStatus"
                                      id="secondaryStatus"
                                      value={
                                        this.state.chargeModel.secondaryStatus
                                      }
                                    >
                                      {status.map((s) => (
                                        <option key={s.value} value={s.value}>
                                          {" "}
                                          {s.display}{" "}
                                        </option>
                                      ))}{" "}
                                    </select>
                                  </div>
                                  <div class="invalid-feedback"> </div>
                                </div>
                              </div>
                            </div>
                          </Tab>
                        </Tabs>
                        {/* <!-- Insuranc einfo content starts here --> */}
                      </div>
                    </div>
                    {/* Insurance Info ends here */}

                    {/* Legel entities starts here */}
                    <div class="row">
                      <div class="col-md-12 col-sm-12 mt-1 provider-form ">
                        <div class="header pt-4">
                          <h6 class="heading">Legal Entities</h6>
                          <div
                            class="clearfix"
                            style={{ borderBottom: "1px solid #037592" }}
                          ></div>
                          <div class="clearfix"></div>
                        </div>
                        <br></br>

                        <div className="row">
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Practice</label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                disabled
                                name="practiceID"
                                id="practiceID"
                                value={this.state.chargeModel.practiceID}
                                onChange={this.handleChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.practice.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {" "}
                                    {s.description}{" "}
                                  </option>
                                ))}{" "}
                              </select>
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Location
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                disabled
                                name="locationID"
                                id="locationID"
                                value={this.state.chargeModel.locationID}
                                onChange={this.handleChange}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.location.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {" "}
                                    {s.description}{" "}
                                  </option>
                                ))}{" "}
                              </select>
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                POS
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                disabled
                                name="posid"
                                id="posid"
                                value={this.state.chargeModel.posid}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.props.posCodes.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {" "}
                                    {s.description}{" "}
                                  </option>
                                ))}{" "}
                              </select>
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                        </div>
                        <div className="row">
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Provider</label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                disabled
                                name="providerID"
                                id="providerID"
                                value={this.state.chargeModel.providerID}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.provider.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {" "}
                                    {s.description}{" "}
                                  </option>
                                ))}{" "}
                              </select>
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Ref. Provider
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                disabled
                                name="refProviderID"
                                id="refProviderID"
                                value={this.state.chargeModel.refProviderID}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.refProvider.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {" "}
                                    {s.description}{" "}
                                  </option>
                                ))}{" "}
                              </select>
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                          <div class="col-md-4 mb-2 col-sm-4">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                Supervising Provider
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8  p-0 m-0 float-left">
                              <select
                                disabled
                                name="supervisingProvID"
                                id="supervisingProvID"
                                value={this.state.chargeModel.supervisingProvID}
                                style={{ width: "100%", padding: "5px" }}
                                class="provider-form form-control-user"
                              >
                                {this.state.provider.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {" "}
                                    {s.description}{" "}
                                  </option>
                                ))}{" "}
                              </select>
                            </div>
                            <div class="invalid-feedback"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* //Charge and Notes TAb */}
                    <Tabs headers={headers} style={{ cursor: "default" }}>
                      <Tab>
                        <div class="card mb-4">
                          <div class="card-body">
                            <div class="table-responsive">
                              <div
                                style={{ overflowX: "hidden" }}
                                id="dataTable_wrapper"
                                class="dataTables_wrapper dt-bootstrap4"
                              >
                                <MDBDataTable
                                  responsive={true}
                                  striped
                                  bordered
                                  searching={false}
                                  data={paymentLedgerdata}
                                  displayEntries={false}
                                  sortable={true}
                                  scrollX={false}
                                  scrollY={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab>
                        <div class="card mb-4">
                          <div class="card-body">
                            <div class="table-responsive">
                              <div
                                style={{ overflowX: "hidden" }}
                                id="dataTable_wrapper"
                                class="dataTables_wrapper dt-bootstrap4"
                              >
                                <MDBDataTable
                                  responsive={true}
                                  striped
                                  bordered
                                  searching={false}
                                  data={submitdata}
                                  displayEntries={false}
                                  sortable={true}
                                  scrollX={false}
                                  scrollY={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab>
                        <div class="card mb-4">
                          <div class="card-body">
                            <div class="table-responsive">
                              <div
                                style={{ overflowX: "hidden" }}
                                id="dataTable_wrapper"
                                class="dataTables_wrapper dt-bootstrap4"
                              >
                                <MDBDataTable
                                  responsive={true}
                                  striped
                                  bordered
                                  searching={false}
                                  data={resubmitdata}
                                  displayEntries={false}
                                  sortable={true}
                                  scrollX={false}
                                  scrollY={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab>
                        <div class="card mb-4">
                          <div class="card-body">
                            <div class="table-responsive">
                              <div
                                style={{ overflowX: "hidden" }}
                                id="dataTable_wrapper"
                                class="dataTables_wrapper dt-bootstrap4"
                              >
                                <MDBDataTable
                                  responsive={true}
                                  striped
                                  bordered
                                  searching={false}
                                  data={auditdata}
                                  displayEntries={false}
                                  sortable={true}
                                  scrollX={false}
                                  scrollY={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>

                    {/* Legel entities starts here */}
                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="button"
                        onClick={this.saveCharge}
                      >
                        Save
                      </button>

                      <button
                        class="btn btn-primary mr-2"
                        type="button"
                        onClick={() => this.props.onClose()}
                      >
                        Cancel
                      </button>
                    </div>
                    {/* End of Main Content */}
                  </div>
                </div>

                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* {popup} */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    cptCodes: state.loginInfo
      ? state.loginInfo.cpt
        ? state.loginInfo.cpt
        : []
      : [],
    icdCodes: state.loginInfo
      ? state.loginInfo.icd
        ? state.loginInfo.icd
        : []
      : [],
    posCodes: state.loginInfo
      ? state.loginInfo.pos
        ? state.loginInfo.pos
        : []
      : [],
    modifiers: state.loginInfo
      ? state.loginInfo.modifier
        ? state.loginInfo.modifier
        : []
      : [],
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

export default connect(mapStateToProps, matchDispatchToProps)(EditCharge);

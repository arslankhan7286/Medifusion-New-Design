import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CountBarChart from "./CountBarChart";
import ChargeBarChart from "./ChargeBarChart";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import moment from "moment";
import momentTZ from "moment-timezone";
import { css } from "@emotion/core";
import DotLoader from "react-spinners/DotLoader";
import GridHeading from "./GridHeading";
import GPopup from "./GPopup";
import { isNullOrUndefined } from "util";
import $ from "jquery";
import VisitUsed from "./VisitUsed";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
  LabelList,
  Line,
  LineChart,
} from "recharts";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  withRouter,
} from "react-router-dom";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { userInfo } from "../actions/userInfo";
import { setICDAction } from "../actions/SetICDAction";
import { setCPTAction } from "../actions/SetCPTAction";
import { taxonomyCodeAction } from "../actions/TaxonomyAction";
import { setInsurancePlans } from "../actions/InsurancePlanAction";
import { setReceiverAction } from "../actions/ReceiverAction";
import { setRemarkCodeAction } from "../actions/RemarkCodeAction";
import { setAdjustmentCodeAction } from "../actions/AdjustmentCodeAction";

const COLORS = [
  "#0088FE",
  "#F8BD28",
  "#45B239",
  "#FF8042",
  "#6033aa",
  "#795548",
  "#000000",
  "#004b44",
  "#808080",
  "#00bcd4",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const renderCustomizedFollowupLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PaitData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Dashboard/";
    this.BillingUrl = process.env.REACT_APP_URL + "/BillingDashboard/";
    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    this.BatchUrl = process.env.REACT_APP_URL + "/PatientAuthorization/";
    this.patientPlanUrl = process.env.REACT_APP_URL + "/PatientPlan/";
    this.paymentCheckUrl = process.env.REACT_APP_URL + "/PaymentCheck/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
    this.dataLoaded = false;
    this.preToken = "";

    this.practiseGraph = {
      month: "",
      charges: "",
      payment: "",
      adjustment: "",
      balance: "",
      totalBalance: "",
    };
    this.AppointmentSummeryModel = {
      dateFrom: null,
      dateTo: null,
      value: "T",
    };
    this.DosModel = {
      dateFrom: null,
      dateTo: null,
      value: "DOS",
    };
    this.state = {
      DosModel: this.DosModel,
      AppointmentSummeryModel: this.AppointmentSummeryModel,
      practiseGraph: this.practiseGraph,
      PaiChartData: [],
      AccountAuth: [],
      cancelled: "",
      noShow: "",
      rescheduled: "",
      Scheduled: "",
      confirmed: "",
      visitSummeryData: [],
      precticeSummeryData: [],
      pageToLoad: false,
      landingPage: true,
      data: [],
      paperSubmission: 0,
      electronicSubmission: 0,
      systemReject: 0,
      clameReject: 0,
      clameDenied: 0,
      eraNeedPosting: 0,
      eraFailed: 0,
      planeFollowUp: 0,
      patientFollowUp: 0,
      claimSubmitedDaily: 0,
      paymentReceived: 0,
      checkPosted: 0,
      claimEntered: 0,
      planeFollowUpDaily: 0,
      patientFollowUpDaily: 0,
      eraFailedDaily: 0,
      agingData: [],
      FollowUpData: [],
      loading: false,
      chargePaymentData: [],
      patientAuthID: 0,
      value: "T",
      loader1: false,
      loader2: false,
      loader3: false,
      loader4: false,
      loader5: false,
      loader6: false,
      loader7: false,
      loader8: false,
      loader9: false,
      loader10: false,
      loader11: false,
      popupName: "",
      patientPopup: false,
      showVPopup: false,
    };
    this.openPatientPopup = this.openPatientPopup.bind(this);
    this.closePatientPopup = this.closePatientPopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.openVisitPopup = this.openVisitPopup.bind(this);
    // this.closeVisitPopUp = this.closeVisitPopUp.bind(this);
  }
  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }
  openPatientPopup(name, id) {
    this.setState({ popupName: name, patientPopup: true, id: id });
  }

  closePatientPopup() {
    this.setState({ popupName: "", patientPopup: false });
  }

  closevisitPopup = () => {
    $("#submittedVisitsModal").hide();
    this.setState({ showVPopup: false });
  };

  openvisitPopup = (id) => {
    console.log(id);
    this.setState({
      showVPopup: true,
      patientAuthID: id,
    });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };
  openPopup = (name, id) => {
    this.setState({ popupName: name, id: id });
  };

  getAppointmentSummaryData = () => {
    console.log("AppointmentSummeryModel", this.state.AppointmentSummeryModel);
    axios
      .post(
        this.url + "FindAppointmentData",
        this.state.AppointmentSummeryModel,
        this.config
      )
      .then((response) => {
        console.log("AppointmentSummeryModel Response", response.data);
        this.setState({
          cancelled: response.data.cancelled,
          noShow: response.data.noShow,
          rescheduled: response.data.rescheduled,
          scheduled: response.data.scheduled,
          confirmed: response.data.confirmed,
          checkOut: response.data.checkOut,
          checkIN: response.data.checkIN,
        });
      });
  };
  convertNumber =(Number)=>{
    var count
    count = Number.toLocaleString(undefined, {maximumFractionDigits:2})
    return count;
  }

  async componentWillMount() {
    this.preToken = this.props.loginObject.token;
    this.dataLoaded = true;

    await this.setState({
      loader1: true,
      loader2: true,
      loader3: true,
      loader4: true,
      loader5: true,
      loader6: true,
      loader7: true,
      loader8: true,
      loader9: true,
    });

    try {
      await this.setState({
        loading: true,
      });

      try {
        axios
          .post(
            this.BillingUrl + "GetPlanFollowUpGraph",
            this.state.DosModel,
            this.config
          )
          .then((response) => {
            let followUpArray = [];
            if (response.data) {
              response.data.map((row, i) => {
                followUpArray.push({
                  name: row.reasonName,
                  visitCount: row.visitCount,
                });
              });
            }
            this.setState({
              FollowUpChart: followUpArray,
              loader5: false,
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({ loader5: false });
          });
      } catch {
        this.setState({ loader5: false });
      }

      try {
        axios
          .post(
            this.BillingUrl + "GetChargePaymentGraph",
            this.state.DosModel,
            this.config
          )
          .then((response) => {
            let chargePaymentArray = [];
            this.setState({
              chargePaymentData: response.data,
              loader4: false,
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({ loader4: false });
          });
      } catch {
        this.setState({ loader4: false });
      }

      try {
        axios
          .post(
            this.url + "FindTopSubmissions",
            this.state.DosModel,
            this.config
          )
          .then((response) => {
            let arrayToPush = [];
            if (response.data) {
              response.data.map((row, i) => {
                arrayToPush.push({
                  name: row.payerName,
                  count: row.count,
                });
              });
            }
            this.setState({ PaiChartData: arrayToPush, loader3: false });
          })
          .catch((error) => {
            console.log("error : ", error);
            this.setState({ loader3: false });
          });
      } catch {
        this.setState({ loader3: false });
      }
      this.setState({ loading: true });
      //AppointmentData
      try {
        this.getAppointmentSummaryData();
      } catch {
        this.setState({ loading: false });
      }
      this.setState({ loading: true });
      try {
        axios
          .post(this.url + "GetAgingData", this.state.DosModel, this.config)
          .then((response) => {
            this.setState({ agingData: response.data, loader6: false });
          })
          .catch((error) => {
            this.setState({ loader6: false });
          });
      } catch {
        this.setState({ loader6: false });
      }

      try {
        axios
          .post(
            this.BillingUrl + "GetPlanFollowUpData",
            this.state.DosModel,
            this.config
          )
          .then((response) => {
            this.setState({ FollowUpData: response.data });
          })
          .catch((error) => {
            console.log("Error : ", error);
          });
      } catch {
        this.setState({ loading: false });
      }

      try {
        axios
          .get(this.BillingUrl + "BillingSummary", this.config)
          .then((response) => {
            this.setState({
              paperSubmission: response.data.paperSubmission,
              electronicSubmission: response.data.electronicSubmission,
              systemReject: response.data.systemReject,
              clameReject: response.data.clameReject,
              clameDenied: response.data.clameDenied,
              eraNeedPosting: response.data.eraNeedPosting,
              eraFailed: response.data.eraFailed,
              planeFollowUp: response.data.planeFollowUp,
              patientFollowUp: response.data.patientFollowUp,
              claimSubmitedDaily: response.data.claimSubmitedDaily,
              paymentReceived: response.data.paymentReceived,
              checkPosted: response.data.checkPosted,
              claimEntered: response.data.claimEntered,
              planeFollowUpDaily: response.data.planeFollowUpDaily,
              patientFollowUpDaily: response.data.patientFollowUpDaily,
              eraFailedDaily: response.data.eraFailedDaily,
              loader1: false,
            });
          });
      } catch {
        this.setState({ loader1: false });
      }
      try {
        axios
          .post(
            this.url + "FindVisitChargeData",
            this.state.DosModel,
            this.config
          )
          .then((response) => {
            let visitSummery = [];
            response.data.map((row, i) => {
              visitSummery.push({
                month: row.month,
                count: row.count,
                charges: row.charges,
                yearMonth: row.yearMonth,
              });
            });

            this.setState({ visitSummeryData: visitSummery, loader2: false });
          });
      } catch {
        this.setState({ loader2: false });
      }
    } catch {
      // await this.setState({ loading: false });
    }
    // await this.setState({ loading: false });

    try {
      axios
        .get(this.BatchUrl + "FindExpiringAuthorizations", this.config)
        .then((response) => {
          console.log("FindExpiringAuthorizations", response.data);
          let AccountSummeryList = [];
          response.data.map((row, i) => {
            AccountSummeryList.push({
              // id: row.id,
              accountNo: (
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() =>
                    this.openPatientPopup("patient", row.patiendID)
                  }
                >
                  {" "}
                  {this.val(row.accountNo)}
                </MDBBtn>
              ),

              authorizationNo: row.authorizationNo,
              visitsAllowed: row.visitsAllowed,

              visitsUsed: (
                <MDBBtn
                  className="gridBlueBtn"
                  onClick={() => this.openvisitPopup(row.patientAuthId)}
                >
                  {" "}
                  {this.val(row.visitsUsed)}
                </MDBBtn>
              ),

              visitsRemaining: row.visitsRemaining,
              startDate: row.startDate,
              expiryDate: row.expiryDate,
            });
          });

          this.setState({ AccountAuth: AccountSummeryList, loader11: false });
        });
    } catch {
      this.setState({ loader11: false });
    }

    // ==================================================== APIs for reducer data ===========================================

    //Get ICDs
    if (this.props.icdCodes.length > 0 == false) {
      axios(this.commonUrl + "GetICDS", this.config)
        .then((response) => {
          this.props.setICDAction(this.props, response.data, "SETICD", true);

          this.dataLoaded = true;
          this.setState({ loading: false });
        })
        .catch((error) => {
          console.log("Get ICDs Error Response : ", error);
        });
    }
    // } catch {}

    ///Get CPTs
    try {
      if (this.props.cptCodes.length > 0 == false) {
        axios(this.commonUrl + "GetCPTS", this.config)
          .then((response) => {
            this.props.setCPTAction(this.props, response.data, "SETCPT");
            this.dataLoaded = true;
          })
          .catch((error) => {
            console.log("Get CPTs Error Response : ", error);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch {}

    //Get Taxonomy Code
    try {
      if (this.props.taxonomyCode.length > 0 == false) {
        axios
          .get(this.commonUrl + "GetTaxonomy", this.config)
          .then((response) => {
            this.props.taxonomyCodeAction(
              this.props,
              response.data,
              "TAXONOMYCODES"
            );
            this.dataLoaded = true;
          })
          .catch((error) => {
            console.log(JSON.stringify(error));
          });
      }
    } catch {}

    //Get Insurance Plans
    try {
      axios
        .get(this.patientPlanUrl + "getprofiles", this.config)
        .then((response) => {
          this.props.setInsurancePlans(response.data);
        })
        .then((error) => {});
    } catch {}

    try {
      await axios
        .get(this.paymentCheckUrl + "GetProfiles", this.config)
        .then((response) => {
          this.props.setReceiver(response.data.receiver);
          this.props.setAdjustmentCode(response.data.adjustmentCodes);
          this.props.setRemarkCode(response.data.remarkCodes);
        })
        .catch((error) => {});
    } catch {}
  }

  componentWillReceiveProps() {
    if (this.props.loginObject.token != this.preToken) {
      this.preToken = this.props.loginObject.token;
      this.config.headers.Authorization =
        "Bearer  " + this.props.loginObject.token;
      if (this.dataLoaded == true) {
        this.componentWillMount();
        // this.dataLoaded=false
      } else {
        this.dataLoaded = false;
      }
    }
  }

  async handleChange(event) {
    await this.setState({
      AppointmentSummeryModel: {
        ...this.state.AppointmentSummeryModel,
        [event.target.name]: event.target.value,
      },
    });

    try {
      await this.getAppointmentSummaryData();
    } catch {}
  }

  DosHandleChange = async (event) => {
    this.setState({
      loader2: true,
      loader3: true,
      loader4: true,
      loader5: true,
      loader6: true,
      loader7: true,
      loader8: true,
      loader9: true,
    });

    this.setState({
      DosModel: {
        ...this.state.DosModel,
        [event.target.name]: event.target.value,
      },
    });

    try {
      axios
        .post(
          this.url + "FindVisitChargeData",
          { dateFrom: null, dateTo: null, value: event.target.value },
          this.config
        )
        .then((response) => {
          let visitSummery = [];
          response.data.map((row, i) => {
            visitSummery.push({
              month: row.month,
              count: row.count,
              charges: row.charges,
              yearMonth: row.yearMonth,
            });
          });
          this.setState({ visitSummeryData: visitSummery, loader2: false });
        })
        .catch({ loader: false });
    } catch {
      this.setState({ loader2: false });
    }

    try {
      axios
        .post(
          this.BillingUrl + "GetPlanFollowUpGraph",
          { dateFrom: null, dateTo: null, value: event.target.value },
          this.config
        )
        .then((response) => {
          let followUpArray = [];
          if (response.data) {
            response.data.map((row, i) => {
              followUpArray.push({
                name: row.reasonName,
                visitCount: row.visitCount,
              });
            });
          }
          this.setState({
            FollowUpChart: followUpArray,
            loader5: false,
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loader5: false });
        });
    } catch {
      this.setState({ loader5: false });
    }
    try {
      axios
        .post(
          this.BillingUrl + "GetChargePaymentGraph",
          { dateFrom: null, dateTo: null, value: event.target.value },
          this.config
        )
        .then((response) => {
          let chargePaymentArray = [];
          this.setState({
            chargePaymentData: response.data,
            loader4: false,
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loader4: false });
        });
    } catch {
      this.setState({ loader4: false });
    }
    try {
      axios
        .post(
          this.url + "FindTopSubmissions",
          { dateFrom: null, dateTo: null, value: event.target.value },
          this.config
        )
        .then((response) => {
          let arrayToPush = [];
          if (response.data) {
            response.data.map((row, i) => {
              arrayToPush.push({
                name: row.payerName,
                count: row.count,
              });
            });
          }
          this.setState({ PaiChartData: arrayToPush, loader3: false });
        })
        .catch((error) => {
          console.log("error : ", error);
          this.setState({ loader3: false });
        });
    } catch {
      this.setState({ loader3: false });
    }
    try {
      axios
        .post(
          this.url + "GetAgingData",
          { dateFrom: null, dateTo: null, value: event.target.value },
          this.config
        )
        .then((response) => {
          console.log("getAginngData", response.data);
          this.setState({ agingData: response.data, loader6: false });
        })
        .catch((error) => {
          this.setState({ loader6: false });
        });
    } catch {
      this.setState({ loader6: false });
    }
    try {
      axios
        .post(
          this.BillingUrl + "GetPlanFollowUpData",
          { dateFrom: null, dateTo: null, value: event.target.value },
          this.config
        )
        .then((response) => {
          this.setState({ FollowUpData: response.data, loading: false });
        })
        .catch((error) => {
          console.log("Error : ", error);
        });
    } catch {}
  };

  openVisitScreen(id) {
    this.props.history.push("/Submission");
  }

  handleCheckSubmission = () => {
    this.setState({
      pageToLoad: !this.state.pageToLoad,
    });
  };

  render() {
    let popup = "";

    if (this.state.showPopup) {
      // popup = (
      //   <NewPlanFollowupModal
      //     onClose={() => this.closePLanFollowupPopup}
      //     id={this.state.id}
      //   ></NewPlanFollowupModal>
      // );
    } else if (this.state.patientPopup) {
      popup = (
        <GPopup
          onClose={() => this.closePatientPopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.showVPopup) {
      popup = (
        <VisitUsed
          onClose={() => this.closevisitPopup}
          patientAuthID={this.state.patientAuthID}
        ></VisitUsed>
      );
    } else popup = <React.Fragment></React.Fragment>;
    const AccountAuth = {
      columns: [
        {
          label: "ACCOUNT #",
          field: "accountNo",
          sort: "asc",
          width: 100,
        },
        {
          label: "AUTHORIZATION",
          field: "authorizationNo",
          sort: "asc",
          width: 100,
        },

        {
          label: "VISITS ALLOWED",
          field: "visitsAllowed",
          sort: "asc",
          width: 100,
        },
        {
          label: "VISITS USED",
          field: "visitsUsed",
          sort: "asc",
          width: 100,
        },
        {
          label: "VISITS REMAINING",
          field: "visitsRemaining",
          sort: "asc",
          width: 100,
        },
        {
          label: "START DATE",
          field: "startDate",
          sort: "asc",
          width: 100,
        },

        {
          label: "END DATE",
          field: "expiryDate",
          sort: "asc",
          width: 100,
        },
      ],
      rows: this.state.AccountAuth,
    };
    var Range0_30 = this.state.agingData[0];
    //Loader Icon
    var loaderIcon = (
      <div class="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );

    let CpLoader = "";
    if (this.state.loading == true) {
      CpLoader = loaderIcon;
    }

    let loader1 = this.state.loader1 ? loaderIcon : null;
    let loader2 = this.state.loader2 ? loaderIcon : null;
    let loader3 = this.state.loader3 ? loaderIcon : null;
    let loader4 = this.state.loader4 ? loaderIcon : null;
    let loader5 = this.state.loader5 ? loaderIcon : null;
    let loader6 = this.state.loader6 ? loaderIcon : null;

    var payer1 = "";
    var payer2 = "";
    var payer3 = "";
    var payer4 = "";
    var payer5 = "";
    var payer6 = "";
    var payer7 = "";
    var payer8 = "";
    var payer9 = "";
    var payer10 = "";

    try {
      if (this.state.PaiChartData.length > 0) {
        payer1 = this.state.PaiChartData[0].name;
        payer2 = this.state.PaiChartData[1].name;
        payer3 = this.state.PaiChartData[2].name;
        payer4 = this.state.PaiChartData[3].name;
        payer5 = this.state.PaiChartData[4].name;
        payer6 = this.state.PaiChartData[5].name;
        payer7 = this.state.PaiChartData[6].name;
        payer8 = this.state.PaiChartData[7].name;
        payer9 = this.state.PaiChartData[8].name;
        payer10 = this.state.PaiChartData[9].name;
      }
    } catch {}
    var payer1Count = "";
    var payer2Count = "";
    var payer3Count = "";
    var payer4Count = "";
    var payer5Count = "";
    var payer6Count = "";
    var payer7Count = "";
    var payer8Count = "";
    var payer9Count = "";
    var payer10Count = "";
    try {
      if (this.state.PaiChartData.length > 0) {
        payer1Count = this.state.PaiChartData[0].count;
        payer2Count = this.state.PaiChartData[1].count;
        payer3Count = this.state.PaiChartData[2].count;
        payer4Count = this.state.PaiChartData[3].count;
        payer5Count = this.state.PaiChartData[4].count;
        payer6Count = this.state.PaiChartData[5].count;
        payer7Count = this.state.PaiChartData[6].count;
        payer8Count = this.state.PaiChartData[7].count;
        payer9Count = this.state.PaiChartData[8].count;
        payer10Count = this.state.PaiChartData[9].count;
      }
    } catch {}

    var reason1 = "";
    var reason2 = "";
    var reason3 = "";
    var reason4 = "";
    var reason5 = "";
    var reason6 = "";
    try {
      if (this.state.FollowUpChart.length > 0) {
        reason1 = this.state.FollowUpChart[0].name;
        reason2 = this.state.FollowUpChart[1].name;
        reason3 = this.state.FollowUpChart[2].name;
        reason4 = this.state.FollowUpChart[3].name;
        reason5 = this.state.FollowUpChart[4].name;
        reason6 = this.state.FollowUpChart[5].name;
      }
    } catch {}
    var reason1VisitCount = "";
    var reason2VisitCount = "";
    var reason3VisitCount = "";
    var reason4VisitCount = "";
    var reason5VisitCount = "";
    var reason6VisitCount = "";
    try {
      if (this.state.FollowUpChart.length > 0) {
        reason1VisitCount = this.state.FollowUpChart[0].visitCount;
        reason2VisitCount = this.state.FollowUpChart[1].visitCount;
        reason3VisitCount = this.state.FollowUpChart[2].visitCount;
        reason4VisitCount = this.state.FollowUpChart[3].visitCount;
        reason5VisitCount = this.state.FollowUpChart[4].visitCount;
        reason6VisitCount = this.state.FollowUpChart[5].visitCount;
      }
    } catch {}

    const data01 = [
      { name: "Group A", value: 400 },
      { name: "Group B", value: 300 },
      { name: "Group C", value: 300 },
      { name: "Group D", value: 200 },
      { name: "Group D", value: 200 },
      { name: "Group D", value: 200 },
      { name: "Group D", value: 200 },
      { name: "Group D", value: 200 },
      { name: "Group D", value: 200 },
    ];
    const data02 = [
      { name: "A1", count: 100 },
      { name: "A2", count: 300 },
      { name: "B1", count: 100 },
      { name: "B2", count: 80 },
      { name: "B3", count: 40 },
      { name: "B4", count: 30 },
      { name: "B5", count: 50 },
      { name: "C1", count: 100 },
      { name: "C2", count: 200 },
      { name: "D1", count: 150 },
      { name: "D2", count: 50 },
    ];

    const BiaAxialdata = [
      { name: "Page A", uv: 4000, pv: 2400, amt: 2400, bmt: 2000 },
      { name: "Page B", uv: 3000, pv: 1398, amt: 2210, bmt: 2100 },
      { name: "Page C", uv: 2000, pv: 9800, amt: 2290, bmt: 1800 },
      { name: "Page D", uv: 2780, pv: 3908, amt: 2000, bmt: 1500 },
      { name: "Page E", uv: 1890, pv: 4800, amt: 2181, bmt: 1000 },
      { name: "Page F", uv: 2390, pv: 3800, amt: 2500, bmt: 500 },
      { name: "Page G", uv: 3490, pv: 4300, amt: 2100, bmt: 2600 },
    ];

    const providerData = {
      columns: [
        {
          label: "ID",
          field: "Id",
          sort: "asc",
          width: 150,
        },
        {
          label: "",
          field: "name",
          sort: "asc",
          width: 150,
        },
        {
          label: "0-30",
          field: "30",
          sort: "asc",
          width: 150,
        },
        {
          label: "30+ ",
          field: "30+",
          sort: "asc",
          width: 150,
        },
        {
          label: "60+",
          field: "60+",
          sort: "asc",
          width: 150,
        },

        {
          label: "90+",
          field: "ssn",
          sort: "asc",
          width: 150,
        },
        {
          label: "120+",
          field: "texonomycode",
          sort: "asc",
          width: 150,
        },
        {
          label: "Total",
          field: "address",
          sort: "asc",
          width: 150,
        },
      ],
    };

    const data = [
      { name: "Page A", value: 4000 },
      { name: "Page B", value: 3000 },
      { name: "Page C", value: 2000 },
      { name: "Page C", value: 5000 },
      { name: "Page C", value: 3000 },
      { name: "Page C", value: 500 },
      { name: "Page C", value: 100 },
      { name: "Page C", value: 1000 },
    ];

    var ReasonData = [];
    this.state.FollowUpData.map((row) => {
      ReasonData.push(
        <tr>
          <td>{row.reasonName}</td>
          <td>{row.visitCount}</td>
          <td>{row.totalAmmount}</td>
        </tr>
      );
    });

    var newList = [];
    this.state.chargePaymentData.map((row) => {
      newList.push({
        MONTHL: row.yearMonth,
        CHARGES: row.yearMonth,
        PLANPAYMENT: row.planPayment,
        PTPAYMENT: row.patientPaid,
        ADJUSTMENT: row.adjustments,
        PLANBALANCE: row.planBal,
        PTBALANCE: row.patBal,
        TOTALBALANCE: row.totalBal,

        // <tr>
        //   <td>{row.yearMonth}</td>
        //   <td>${row.yearMonth}</td>
        //   <td>${row.planPayment}</td>
        //   <td>${row.patientPaid}</td>
        //   <td>${row.adjustments}</td>
        //   <td>${row.planBal}</td>
        //   <td>${row.patBal}</td>
        //   <td>${row.totalBal}</td>
        // </tr>
      });
    });

    const chargeTabledata = {
      columns: [
        {
          label: "MONTH",
          field: "MONTH",
          sort: "asc",
          width: 150,
        },
        {
          label: "CHARGES",
          field: "CHARGES",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN PAYMENT",
          field: "PLANPAYMENT",
          sort: "asc",
          width: 150,
        },
        {
          label: "PT PAYMENT",
          field: "PTPAYMENT",
          sort: "asc",
          width: 150,
        },

        {
          label: "ADJUSTMENT",
          field: "ADJUSTMENT",
          sort: "asc",
          width: 150,
        },
        {
          label: "PLAN BALANCE",
          field: "PLANBALANCE",
          sort: "asc",
          width: 150,
        },
        {
          label: "PT BALANCE",
          field: "PTBALANCE",
          sort: "asc",
          width: 150,
        },

        {
          label: " TOTAL BALANCE",
          field: " TOTALBALANCE",
          sort: "asc",
          width: 150,
        },
      ],
      rows: newList,
    };

    var tableDataList = [];
    this.state.agingData.map((row) => {
      tableDataList.push(
        <tr>
           <td></td>
          <td>{row.name}</td>
          <td>
            <b>$</b>
            {row.range0_30}
          </td>
          <td>
            <b>$</b>
            {row.range31_60}
          </td>
          <td>
            <b>$</b>
            {row.range61_90}
          </td>
          <td>
            <b>$</b>
            {row.range91_120}
          </td>
          <td>
            <b>$</b>
            {row.range120plus}
          </td>
          <td>
            <b>$</b>
            {row.total}
          </td>
        </tr>
      );
    });

    var submitDate = momentTZ().tz("America/Los_Angeles").format();
    submitDate = submitDate.slice(0, 10);

    var entryDateFrom = momentTZ().tz("America/Los_Angeles").format();
    entryDateFrom = entryDateFrom.slice(0, 10);

    return (
      <React.Fragment>
        <div id="page-top">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-12 pt-3 col-sm-12">
                <div class="row p-0 m-0" style={{ backgroundColor: "#bdd5e7" }}>
                  <div class="col-md-12">
                    <h6 class="h6 pl-0 pb-3 col-md-5 float-left pt-3 text-lg">
                      Appointments Summary
                    </h6>
                    <div class="col-md-4 pt-3 float-right">
                      <select
                        name="value"
                        class="TodayselectDropDown"
                        onChange={this.handleChange}
                        value={this.state.AppointmentSummeryModel.value}
                        class="TodayselectDropDown"
                        style={{ float: "right" }}
                      >
                        <option value="T">Today</option>
                        <option value="Y">Yesterday</option>
                        <option value="MTD">Month to Date</option>
                        <option value="YTD">Year to Date</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 col-sm-12 pt-2">
                {/* <!-- Schedule Card Code --> */}
                <div
                  class="col-md-0 p-2 mb-4"
                  style={{ width: "14.2%", display: "block", float: "left" }}
                >
                  <div class="p-2 border h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col-md-0 mr-2">
                          <div class="text-sm font-weight-bold text-primary text-uppercase mb-1">
                            SCHEDULED
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-primary">
                            {this.state.scheduled}
                          </div>
                        </div>
                        <div class="col-auto float-right">
                          {" "}
                          <i class="fas fa-calendar fa-2x green"></i>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Earnings (Monthly) Card Example --> */}
                <div
                  class="col-md-1.5 p-2 mb-4"
                  style={{ width: "14.2%", display: "block", float: "left" }}
                >
                  <div class="p-2 border h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-sm font-weight-bold orange text-uppercase mb-1">
                            CHECK IN
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">
                            {this.state.checkIN ? this.state.checkIN : "0"}
                          </div>
                        </div>
                        <div class="col-auto">
                          {" "}
                          <i class="fas fa-calendar-check fa-2x orange"></i>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Earnings (Monthly) Card Example --> */}
                <div
                  class="border-1 col-md-1.5 p-2 mb-4"
                  style={{ width: "14.2%", display: "block", float: "left" }}
                >
                  <div class="p-2 border h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-sm font-weight-bold red text-uppercase mb-1">
                            CHECK OUT
                          </div>
                          <div class="row no-gutters align-items-center">
                            <div class="col-auto">
                              <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                {this.state.checkOut
                                  ? this.state.checkOut
                                  : "0"}
                              </div>
                            </div>
                            <div class="col"> </div>
                          </div>
                        </div>
                        <div class="col-auto">
                          {" "}
                          <i class="fas fa-clipboard-list red fa-2x"></i>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- CONFIRMED BOX --> */}
                <div
                  class="col-md-1.5 p-2 mb-4"
                  style={{ width: "14.2%", display: "block", float: "left" }}
                >
                  <div class="p-2 h-100 border py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-sm font-weight-bold blue text-uppercase mb-1">
                            CONFIRMED
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">
                            {this.state.confirmed}
                          </div>
                        </div>
                        <div class="col-auto">
                          {" "}
                          <i class="fas fa-check fa-2x blue"></i>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- NO SHOW BOX --> */}
                <div
                  class="col-md-1.5 p-2 mb-4"
                  style={{ width: "14.2%", display: "block", float: "left" }}
                >
                  <div class="p-2 border h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-sm font-weight-bold gray text-uppercase mb-1">
                            NO SHOW
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">
                            {this.state.noShow}
                          </div>
                        </div>
                        <div class="col-auto">
                          {" "}
                          <i class="fas fas fa-eye-slash fa-2x gray-300"></i>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- CANCELLED BOX --> */}
                <div
                  class="col-md-0 p-2 mb-4"
                  style={{ width: "14.2%", display: "block", float: "left" }}
                >
                  <div class="p-2 h-100 border py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-sm font-weight-bold pink text-uppercase mb-1">
                            CANCELLED
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">
                            {this.state.cancelled}
                          </div>
                        </div>
                        <div class="col-auto">
                          {" "}
                          <i class="fas fa-ban fa-2x pink"></i>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- RESCHEDULED BOX --> */}
                <div
                  class="col-md-2 p-2 mb-4"
                  style={{ width: "14.2%", display: "block", float: "left" }}
                >
                  <div class="p-2 border h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-sm font-weight-bold orange-light text-uppercase mb-1">
                            RESCHEDULED
                          </div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">
                            {this.state.rescheduled}
                          </div>
                        </div>
                        <div class="col-auto">
                          {" "}
                          <i class="fas fa-retweet fa-2x orange-light"></i>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 col-sm-12 pt-2">
                {/* <!-- Content Column --> */}
                <div class="col-lg-4 float-left mb-4">
                  {/* <!-- Project Card Example --> */}
                  <div
                    class="card shadow mb-4"
                    style={{ backgroundColor: "#8facc2" }}
                  >
                    <div
                      class="row card-header bg-none py-2"
                      style={{ marginRight: "0px", marginLeft: "0px" }}
                    >
                      <h5 class="m-0 font-weight-normal text-primary">
                        Claims & ERAs
                        <div className="float-right">{loader1}</div>
                      </h5>
                    </div>
                    <div class="card-body p-1">
                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Ready for Submission{" "}
                        <Link
                          to={{
                            pathname: `/Electronic Submission`,
                            query: {
                              receiverID: "1",
                            },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.electronicSubmission}E
                          </span>
                        </Link>
                        <Link
                          to={{
                            pathname: `/Paper Submission`,
                            query: {
                              formType: "HCFA 1500",
                            },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.paperSubmission}P/
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Claims Rejected{" "}
                        <Link
                          to={{
                            pathname: `/charges`,
                            query: { status: "R" },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.clameReject}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        System Rejected
                        <Link
                          to={{
                            pathname: `/charges`,
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.systemReject}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Claims Denied
                        <Link
                          to={{
                            pathname: `/charges`,
                            query: { status: "DN" },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.clameDenied}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        ERAs Need Posting
                        <Link
                          to={{
                            pathname: `/Payments`,
                            query: { status: "NP" },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.eraNeedPosting}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        ERAs Failed
                        <Link
                          to={{
                            pathname: `/Payments`,
                            query: { status: "F" },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.eraFailed}
                          </span>
                        </Link>
                      </h4>
                    </div>
                  </div>
                </div>

                <div class="col-lg-4 float-left mb-4" style={{height:"100%"}}>
                  {/* <!-- Project Card Example --> */}
                  <div
                    class="card shadow mb-4"
                    style={{ backgroundColor: "#8facc2" , height:"100%" }}
                  >
                    <div
                      class="row card-header bg-none py-2"
                      style={{ marginRight: "0px", marginLeft: "0px" }}
                    >
                      <h5 class="m-0 font-weight-normal text-primary">
                        Followup &amp; Others
                        <div className="float-right">{loader1}</div>
                      </h5>
                    </div>
                    <div class="card-body p-1">
                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Plan Followup
                        <Link
                          to={{
                            pathname: `/Plan Follow Up`,
                            query: { status: true },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.planeFollowUp}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Patients Followup
                        <Link
                          to={{
                            pathname: `/Patient Follow Up`,
                            query: { status: true },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {" "}
                            {this.state.patientFollowUp}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Patient Statement
                        <Link
                          to={{
                            pathname: `/Patient Follow Up`,
                            query: { status: true },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {0}
                          </span>
                        </Link>
                      </h4>
                    </div>
                  </div>
                </div>

                <div class="col-lg-4 float-left mb-4">
                  {/* <!-- Project Card Example --> */}
                  <div
                    class="card shadow mb-4"
                    style={{ backgroundColor: "#8facc2" }}
                  >
                    <div
                      class="row card-header bg-none py-2"
                      style={{ marginRight: "0px", marginLeft: "0px" }}
                    >
                      <h5 class="m-0 font-weight-normal text-primary">
                        Daily Summary
                      </h5>
                      <div className="float-right">{loader1}</div>
                    </div>
                    <div class="card-body p-1">
                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Claims Submitted
                        <Link
                          to={{
                            pathname: `/Submission Log`,
                            query: {
                              submitDate: submitDate,
                            },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.claimSubmitedDaily}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Payments Recieved
                        <Link
                          to={{
                            pathname: `Payments`,
                            query: {
                              status: "A",
                              entryDateFrom: entryDateFrom,
                            },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.paymentReceived}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Checks Posted
                        <Link
                          to={{
                            pathname: `Payments`,
                            query: {
                              status: "P",
                              entryDateFrom: entryDateFrom,
                            },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.checkPosted}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Claims Entered
                        <Link
                          to={{
                            pathname: `/charges`,
                            query: {
                              isSubmitted: "Y",
                              entryDateFrom: entryDateFrom,
                            },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.claimEntered}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Followup Created
                        <Link
                          to={{
                            pathname: `/Plan Follow Up`,
                            query: {
                              submitDate: submitDate,
                            },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {" "}
                            {this.state.planeFollowUpDaily}
                          </span>
                        </Link>
                      </h4>

                      <h4 class="small bg-white p-2 blue font-weight-bold">
                        Failed ERAs
                        <Link
                          to={{
                            pathname: `/Payments`,
                            query: {
                              status: "F",
                              entryDateFrom: entryDateFrom,
                            },
                          }}
                        >
                          <span class="float-right font-weight-normal pink">
                            {this.state.eraFailedDaily}
                          </span>
                        </Link>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 pr-4 pl-4 pb-3 mt-3">
                <select
                  class="DOSselectDropDown float-right text-right"
                  name="value"
                  onChange={this.DosHandleChange}
                  value={this.state.DosModel.value}
                >
                  <option value="DOS">Date of Service</option>
                  <option value="AD">Entry Date</option>
                  <option value="SD">Submit Date</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 col-sm-12">
                {/* <!-- Content Column --> */}

                <div
                  class="col-lg-6 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                    <div
                      class="row card-header py-3"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <h5 class="col-md-8 m-0 font-weight-bold text-primary">
                        Visit & Charges Summary Graph
                      </h5>
                      <div className="col-md-4 ">
                        <div class="float-lg-right text-right">
                          <input
                            class="checkbox"
                            id="visitsCheckbox"
                            type="checkbox"
                            checked={this.state.pageToLoad}
                            onChange={this.handleCheckSubmission}
                          />
                          {this.state.pageToLoad == false
                            ? "Visits"
                            : "Charges"}
                          <div class="float-lg-right text-right">{loader2}</div>
                        </div>
                      </div>
                    </div>
                    <p class="p-2">
                      {this.state.pageToLoad == false ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart
                            data={this.state.visitSummeryData}
                            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                          >
                            <XAxis dataKey="yearMonth" interval={0} />
                            <YAxis interval="preserveStart" dataKey="count" />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="count"
                              stackId="count"
                              fill="#3367d6"
                              barSize={20}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart
                            data={this.state.visitSummeryData}
                            margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
                          >
                            <XAxis dataKey="yearMonth" interval={0} />
                            <YAxis interval={1} dataKey="charges" />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="charges"
                              // stackId="charges"
                              fill="#3367d6"
                              barSize={20}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </p>
                  </div>
                </div>

                <div
                  class="col-lg-6 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                    <div
                      class="row card-header py-3"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <h5 class="m-0 font-weight-bold text-primary">
                        Top Payers
                      </h5>
                      <div className="float-right">{loader3}</div>
                    </div>
                    <p class="p-2">
                      <div className="row">
                        <div className="col-md-7">
                          <div className="PayerSummery">
                            {payer1.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="blueBox"></div>

                                <span style={{ width: "60%" }}>{payer1}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {payer1Count}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer2.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="yellowBox"></div>
                                <span style={{ width: "60%" }}>{payer2}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {payer2Count}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer3.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="GreenBox"></div>
                                <span style={{ width: "60%" }}>{payer3}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {payer3Count}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer4.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="orangeBox"></div>
                                <span style={{ width: "60%" }}>{payer4}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {payer4Count}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer5.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="purpleBox"></div>
                                <span style={{ width: "60%" }}>{payer5}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {payer5Count}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer6.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="brownBox"></div>
                                <span style={{ width: "60%" }}>{payer6}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {payer6Count}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer7.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="blackBox"></div>
                                <span style={{ width: "60%" }}>{payer7}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {payer7Count}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer8.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="DarkGreenBox"></div>
                                <span style={{ width: "60%" }}>{payer8}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {payer8Count}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer9.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="lightBrown"></div>
                                <span style={{ width: "60%" }}>{payer9}</span>
                              </div>
                            ) : (
                              ""
                            )}
                            {payer10.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="gradientBox"></div>
                                <span style={{ width: "60%" }}>{payer10}</span>
                              </div>
                            ) : (
                              ""
                            )}
                            <br />
                          </div>
                        </div>
                        <div className="col-md-5" style={{alignSelf:"center"}}>
                          <ResponsiveContainer
                            width="100%"
                            height={200}
                            // style={{ marginTop: "60px" }}
                            className="paiChartContainer"
                          >
                            <PieChart>
                              <Pie
                                dataKey="count"
                                data={this.state.PaiChartData}
                                cx="30%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={0}
                                intervals={0}
                                labelLine={false}
                                label={renderCustomizedLabel}
                              >
                                {data.map((entry, index) => (
                                  <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>

                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 mt-4 col-sm-12">
                {/* <!-- Content Column --> */}

                <div
                  class="col-lg-6 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                  <div
                      class="row card-header py-3"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <h5 class="m-0 font-weight-bold text-primary">
                        Practice Analysis Record Graph
                        <h6>Last 6 Months</h6>
                      </h5>
                      <div className="float-right">{loader4}</div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={this.state.chargePaymentData}
                        margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
                        offset="6"
                      >
                        <XAxis dataKey="yearMonth" interval={0} />
                        <YAxis interval={0} dataKey="charge" />

                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="charge" fill="#4081FE" barSize={20} />
                        <Bar dataKey="payment" fill="#ffc658" barSize={20} />
                        <Bar
                          dataKey="adjustments"
                          fill="#008890"
                          barSize={20}
                        />
                        <Bar dataKey="planBal" fill="#ED9331" barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div
                  class="col-lg-6 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                  <div
                      class="row card-header py-3"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <h5 class="m-0 font-weight-bold text-primary">
                        Practice Analysis Record Table
                      </h5>
                      <div className="float-right">{loader4}</div>
                    </div>
                    <p style={{ marginBottom: "0px" }}>
                      <div className="card mb-4" style={{ width: "100%" }}>
                        <div className="card-body">
                          <div className="table-responsive">
                            <div
                              style={{ overflowX: "hidden" }}
                              id="dataTable_wrapper"
                              className="dataTables_wrapper dt-bootstrap4"
                            >
                              <MDBDataTable
                                striped
                                searching={false}
                                data={chargeTabledata}
                                displayEntries={false}
                                sortable={true}
                                scrollX={false}
                                scrollY={false}
                                responsive={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 mt-4 col-sm-12">
                {/* <!-- Content Column --> */}

                <div
                  class="col-lg-6 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                  <div
                      class="row card-header py-3"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <h5 class="m-0 font-weight-bold text-primary">
                        Plan Follow up
                      </h5>
                      <div className="float-right">{loader5}</div>
                    </div>
                    <p class="p-3">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="PayerSummery">
                            {reason1.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="blueBox"></div>

                                <span style={{ width: "40%" }}>{reason1}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {reason1VisitCount}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {reason2.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="yellowBox"></div>
                                <span style={{ width: "40%" }}>{reason2}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {reason2VisitCount}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {reason3.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="GreenBox"></div>
                                <span style={{ width: "40%" }}>{reason3}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {reason3VisitCount}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {reason4.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="orangeBox"></div>
                                <span style={{ width: "40%" }}>{reason4}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {reason4VisitCount}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {reason5.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="purpleBox"></div>
                                <span style={{ width: "40%" }}>{reason5}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {reason5VisitCount}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {reason6.length > 0 ? (
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <div className="brownBox"></div>
                                <span style={{ width: "40%" }}>{reason6}</span>
                                <span style={{ fontWeight: "bold" }}>
                                  {reason6VisitCount}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            <br />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <ResponsiveContainer
                            width="100%"
                            height={200}
                            // style={{ marginTop: "60px" }}
                            className="paiChartContainer"
                          >
                            <PieChart>
                              <Pie
                                dataKey="visitCount"
                                data={this.state.FollowUpChart}
                                cx="35%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={0}
                                // fill="#3367d6"
                                labelLine={false}
                                label={renderCustomizedFollowupLabel}
                              >
                                {data.map((entry, index) => (
                                  <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>

                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </p>
                  </div>
                </div>
                <div
                  class="col-lg-6 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                  <div
                      class="row card-header py-3"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <h5 class="m-0 font-weight-bold text-primary">
                        Plan Follow up Table
                      </h5>
                      {/* <div className="float-right">{loader6}</div> */}
                    </div>
                    <p>
                      <div>
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr role="row">
                              <th className="" style={{ width: "98px" }}>
                                {" "}
                                REASON
                              </th>
                              <th className="" style={{ width: "98px" }}>
                                {" "}
                                VISIT
                              </th>
                              <th className="" style={{ width: "98px" }}>
                                {" "}
                                AMOUNT
                              </th>
                            </tr>
                          </thead>
                          <tbody>{ReasonData}</tbody>
                        </table>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12 mt-4 col-sm-12">
                {/* <!-- Content Column --> */}

                
                <div
                  class="col-lg-6 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                  <div
                      class="row card-header py-3"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <h5 class="m-0 font-weight-bold text-primary">
                      Aging Summary
                      </h5>
                      <div className="float-right">{loader6}</div>
                    </div>
                    <p style={{ marginBottom: "0px" }}>
                    <table className="table table-striped table-bordered text-nowrap">
                      <thead>
                        <tr role="row">
                          <th
                            className="sorting_asc"
                            style={{ width: "110px" }}
                          >
                            &nbsp;{" "}
                          </th>
                          <th className="sorting" style={{ width: "98px" }}>
                            {" "}
                            CURRRENT
                          </th>
                          <th className="sorting" style={{ width: "133px" }}>
                            31-60
                          </th>
                          <th className="sorting" style={{ width: "133px" }}>
                            61-90
                          </th>
                          <th className="sorting" style={{ width: "133px" }}>
                            {" "}
                            91-120
                          </th>
                          <th className="sorting" style={{ width: "144px" }}>
                            {" "}
                            120+
                          </th>
                          <th className="sorting" style={{ width: "119px" }}>
                            TOTAL
                          </th>
                        </tr>
                      </thead>
                      <tbody>{tableDataList}</tbody>
                    </table>
                    </p>
                  </div>
                </div>



                <div
                  class="col-lg-6 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                  <div
                      class="row card-header py-3"
                      style={{ marginLeft: "0px", marginRight: "0px" }}
                    >
                      <h5 class="m-0 font-weight-bold text-primary">
                      Aging Summary Graph
                      </h5>
                      <div className="float-right">{loader6}</div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={this.state.agingData}
                        margin={{ top: 10, right: 0, left: 10, bottom: 0 }}
                        offset="6"
                      >
                        <XAxis interval={0} dataKey="name" />
                        <YAxis interval={0} dataKey="total" />

                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="range0_30" fill="#4081FE" barSize={20} />
                        <Bar dataKey="range31_60" fill="#ffc658" barSize={20} />
                        <Bar dataKey="range61_90" fill="#008890" barSize={20} />
                        <Bar
                          dataKey="range91_120"
                          fill="#ED9331"
                          barSize={20}
                        />
                        <Bar
                          dataKey="range120plus"
                          fill="#00bcd4"
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>



            <div class="row">
              <div class="col-md-12 mt-4 col-sm-12">
                {/* <!-- Content Column --> */}

                <div
                  class="col-lg-12 float-left mb-4"
                  style={{ height: "100%" }}
                >
                  {/* <!-- Project Card Example --> */}
                  <div class="card shadow mb-4" style={{ height: "100%" }}>
                    {/* <div class="card-header py-3">
                      <h5 class="m-0 font-weight-bold text-primary">
                        Expiring Patient Authorizations
                      </h5>
                    </div> */}
                    <div className="card mb-4" style={{ width: "100%" }}>
                      <GridHeading
                        Heading="Expiring Patient Authorizations"
                        dataObj={this.state.searchModel}
                        url={this.url}
                        methodName="ExportSimple"
                        methodNamePdf="ExportSimplePdf"
                        length={this.state.data.length}
                      ></GridHeading>
                      <div className="card-body">
                        <div className="table-responsive">
                          <div
                            style={{ overflowX: "hidden" }}
                            id="dataTable_wrapper"
                            className="dataTables_wrapper dt-bootstrap4"
                          >
                            <MDBDataTable
                              striped
                              searching={false}
                              data={AccountAuth}
                              displayEntries={false}
                              sortable={true}
                              scrollX={false}
                              scrollY={false}
                              responsive={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
  return {
    // cptCodes : state.loginInfo ? (state.loginInfo.cpt ? state.loginInfo.cpt : []):[],
    // icdCodes : state.loginInfo ? (state.loginInfo.icd ? state.loginInfo.icd : []):[],
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
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    taxonomyCode: state.loginInfo
      ? state.loginInfo.taxonomy
        ? state.loginInfo.taxonomy
        : []
      : [],
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
      userInfo: userInfo,
      setICDAction: setICDAction,
      setCPTAction: setCPTAction,
      taxonomyCodeAction: taxonomyCodeAction,
      setInsurancePlans: setInsurancePlans,
      setReceiver: setReceiverAction,
      setAdjustmentCode: setAdjustmentCodeAction,
      setRemarkCode: setRemarkCodeAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Dashboard);

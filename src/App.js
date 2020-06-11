import React from "react";

import "./css/style.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";

import Swal from "sweetalert2";

//User Components
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Client from "./components/Client";
import User from "./components/User";
import ChargesSheet from "./components/ChargesSheet";
import PatientSheet from "./components/PatientSheet";
import Team from "./components/Team";
import PatientAuthReport from "./components/PatientAuthReport";
import Practice from "./components/Practice";
import Location from "./components/Location";
import Provider from "./components/Provider";
import ReferringProvider from "./components/ReferringProvider";
import Insurance from "./components/Insurance";
import InsurancePlan from "./components/InsurancePlan";
import InsurancePlanAddress from "./components/InsurancePlanAddress";
import EDISubmitPayer from "./components/EDISubmitPayer";
import EDIEligibilityPayer from "./components/EDIEligibilityPayer";
import EDIStatusPayer from "./components/EDIStatusPayer";
import ICD from "./components/ICD";
import CPT from "./components/CPT";
import Modifier from "./components/Modifier";
import POS from "./components/POS";
import RemarkCode from "./components/RemarkCode";
import Receiver from "./components/Receiver";
import Submitter from "./components/Submitter";
import AdjustmentCode from "./components/AdjustmentCode";
import UnitReport from "./components/UnitReport";
import PlanFollowup from "./components/PlanFollowup";
import PatientFollowup from "./components/PatientFollowUp";

import StatementLog from "./components/StatmentLog";

import Group from "./components/Group";
import Action from "./components/Action";
import Reason from "./components/Reason";
import PaymentSearch from "./components/PaymentSearch";
import ManualPosting from "./components/ManualPosting";
import ElectronicSubmission from "./components/ElectronicSubmission";
import PaperSubmission from "./components/PaperSubmission";
import SubmissionLog from "./components/SubmissionLog";
import ReportsLog from "./components/ReportsLog";
import NewBatchDocLeftMenu from "./components/NewBatchDocLeftMenu";
import BatchDocument from "./components/BatchDocument";
import DocumentType from "./components/DocumentType";
import ChargeSearch from "./components/ChargeSearch";
import NewCharge from "./components/NewCharge";
import HCFA1500 from "./components/HCFA1500";
import CreateFollowup from "./components/CreateFollowup";
import PatientSearch from "./components/Patient";
import NewPatient from "./components/NewPatient";
import PatientPlan from "./components/PatientPlan";
import PatientPayment from "./components/PatientPayment";
import ProviderScheduler from "./components/ProviderScheduler";
import CalenderScheduler from "./components/CalenderScheduler";
import DaySheet from "./components/DaySheet";
import InsuranceMapping from "./components/InsuranceMapping";
import InsurancePortal from './components/InsurancePortal'

//Left Navigation
import Setup from "./components/Setup";
import Submissions from "./components/Submissions";
import PatientLeftMenu from "./components/PatientLeftMenu";
import NewChargeLeftMenu from "./components/NewChargeLeftMenu";
import NewPaymentLeftMenu from "./components/NewPaymentLeftMenu";
import NewManualPostingMenu from "./components/NewManualPostingMenu";
import DummyLeftMenu from "./components/DummyLeftMenu";
import ReportsLeftMenu from "./components/ReportsLeftMenu";
import FollowupLeftMenu from "./components/Followup";
import SchedulerLeftMenu from "./components/Scheduler";
import CollectionReport from "./components/CollectionReport";
import Patient from "./components/Patient";
import AgingReport1 from "./components/AgingReport1";
import PatientVisitReport from "./components/PatientVisitReport";
import PatientAppointmentStatus from "./components/PatientAppointmentStatus";
import PatientpendingClaim from "./components/PatientpendingClaim";
import PatientByRefphysician from "./components/PatientByRefphysician";
import AgingDetailReport from "./components/AgingDetailReport";
import Copaycollection from "./components/Copaycollection";
import Calendar from "./components/Calendar"

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "./actions/selectTabAction";
import { loginAction } from "./actions/LoginAction";
import * as serviceWorker from "./serviceWorker";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }

  close = () => {

    Swal.fire({
      title: "Are you sure, you want to Logout?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout"
    }).then(result => {
      if (result.value) {
        // this.setState({ loading: true });
        // if (result.value == true) {
        //   this.props.userInfo(null);
        //   this.props.loginAction("", false);
        //   this.props.history.push("/");
        // }
        window.location.reload(true);
      }
    });

  }
  componentWillMount() {


    // window.addEventListener("beforeunload", function (e) {

    //   var confirmationMessage = "Are you sure you want to leave this page without placing the order ?";
    //   (e || window.event).returnValue = confirmationMessage;
    //   return confirmationMessage;

    // });

  }
  componentWillUnmount() {
    alert("Unmounr Component");
    window.location.reload(true);
  }
  render() {
    let mainPage = "";

    mainPage = (
      <Switch>
        <Route path="/" exact component={Login}></Route>
        <Route path="/Login" exact component={Login}></Route>


        {/**********************************CUSTOM ROUTE**************************************/}
        <Route path="/Calendar" exact>
          <div className="row" id="body-row">
            <div className="col-12 py-2">
              <div className="col-md-12">
                <Calendar />
              </div>
            </div>
          </div>
        </Route>

        {/* Dashboard Routes */}
        <Route path="/Dashboard" exact>
          <div className="row" id="body-row">
            <div className="col-12 py-2">
              <div className="col-md-12">
                <Dashboard></Dashboard>
              </div>
            </div>
          </div>
        </Route>

        {/* Schduler Routes */}
        <Route path="/Scheduler" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <SchedulerLeftMenu></SchedulerLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ProviderScheduler></ProviderScheduler>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Provider Schedule" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <SchedulerLeftMenu></SchedulerLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ProviderScheduler></ProviderScheduler>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Day Sheet" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <SchedulerLeftMenu></SchedulerLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <DaySheet></DaySheet>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/CalendarScheduler" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <SchedulerLeftMenu></SchedulerLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <CalenderScheduler></CalenderScheduler>
              </div>
            </div>
          </div>
        </Route>

        {/* Patietn Routes */}
        <Route path="/Patient" exact>
          <div className="row" id="body-row">
            {/* <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <SchedulerLeftMenu></SchedulerLeftMenu>
              </ul>
            </div> */}
            <div className="col-12 py-2">
              <div className="col-md-12">
                <Patient></Patient>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/NewPatient" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <PatientLeftMenu></PatientLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <NewPatient></NewPatient>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/NewPatient/:id" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <PatientLeftMenu></PatientLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <NewPatient></NewPatient>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Demographics" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <PatientLeftMenu></PatientLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <NewPatient></NewPatient>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Plan" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <PatientLeftMenu></PatientLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientPlan></PatientPlan>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/PatientPayment" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <PatientLeftMenu></PatientLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientPayment></PatientPayment>
              </div>
            </div>
          </div>
        </Route>

        {/* Charges Routes */}
        <Route path="/Charges/:id" exact>
          <div className="row" id="body-row">
            <div className="col-12 py-2">
              <div className="col-md-12">
                <ChargeSearch></ChargeSearch>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Charges" exact>
          <div className="row" id="body-row">
            <div className="col-12 py-2">
              <div className="col-md-12">
                <ChargeSearch></ChargeSearch>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/NewCharge" exact>
        <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewChargeLeftMenu></NewChargeLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
              <NewCharge></NewCharge>
              </div>
            </div>
          </div>
        
        </Route>
        <Route path="/NewCharge/:id" exact>
        <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewChargeLeftMenu></NewChargeLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
              <NewCharge></NewCharge>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Charge" exact>
        <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewChargeLeftMenu></NewChargeLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
              <NewCharge></NewCharge>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/HCFA1500" exact>
        <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewChargeLeftMenu></NewChargeLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
              <HCFA1500></HCFA1500>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/ChargePayment" exact>
        <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewChargeLeftMenu></NewChargeLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
             <h1>Payment</h1>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/History" exact>
        <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewChargeLeftMenu></NewChargeLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
              <h1>History</h1>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/ChargeFollowup" exact>
        <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewChargeLeftMenu></NewChargeLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
              <CreateFollowup></CreateFollowup>
              </div>
            </div>
          </div>
        </Route>

        {/* Batch Document Routes */}
        <Route path="/Documents" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewBatchDocLeftMenu></NewBatchDocLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <BatchDocument></BatchDocument>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/BatchDocument" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewBatchDocLeftMenu></NewBatchDocLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <BatchDocument></BatchDocument>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/DocumentType" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewBatchDocLeftMenu></NewBatchDocLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <DocumentType></DocumentType>
              </div>
            </div>
          </div>
        </Route>

        {/* Submissions Routes */}
        <Route path="/Submissions" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Submissions></Submissions>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ElectronicSubmission></ElectronicSubmission>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Paper Submission" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Submissions></Submissions>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PaperSubmission></PaperSubmission>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Electronic Submission" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Submissions></Submissions>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ElectronicSubmission></ElectronicSubmission>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Submission Log" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Submissions></Submissions>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <SubmissionLog></SubmissionLog>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Reports Log" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Submissions></Submissions>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ReportsLog></ReportsLog>
              </div>
            </div>
          </div>
        </Route>

        {/* Payment Routes */}
        <Route path="/Payments" exact>
          <div className="row" id="body-row">
            <div className="col-12 py-2">
              <div className="col-md-12">
                <PaymentSearch></PaymentSearch>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/ManualPosting" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewPaymentLeftMenu></NewPaymentLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ManualPosting></ManualPosting>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/ManualPosting/:id" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewPaymentLeftMenu></NewPaymentLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ManualPosting></ManualPosting>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Manual Posting" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <NewPaymentLeftMenu></NewPaymentLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ManualPosting></ManualPosting>
              </div>
            </div>
          </div>
        </Route>

        {/* Plan Followup  Routes */}
        <Route path="/Followup" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <FollowupLeftMenu></FollowupLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PlanFollowup></PlanFollowup>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Plan Follow Up" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <FollowupLeftMenu></FollowupLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PlanFollowup></PlanFollowup>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Patient Follow Up" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <FollowupLeftMenu></FollowupLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientFollowup></PatientFollowup>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Statement Log" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <FollowupLeftMenu></FollowupLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <StatementLog></StatementLog>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Group" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <FollowupLeftMenu></FollowupLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Group></Group>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Reason" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <FollowupLeftMenu></FollowupLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Reason></Reason>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Action" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <FollowupLeftMenu></FollowupLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Action></Action>
              </div>
            </div>
          </div>
        </Route>

        {/* Reports Routes */}
        <Route path="/Reports" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <UnitReport></UnitReport>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Unit Report" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <UnitReport></UnitReport>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Aging Report" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <AgingReport1></AgingReport1>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Collection Report" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <CollectionReport></CollectionReport>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Patient Visit Report" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientVisitReport></PatientVisitReport>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Patient auth Report" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientAuthReport></PatientAuthReport>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Patient Appointment Status" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientAppointmentStatus></PatientAppointmentStatus>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Patient Pending Claims" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientpendingClaim></PatientpendingClaim>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Patient By Referal Physician" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientByRefphysician></PatientByRefphysician>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Aging Detail Report" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <AgingDetailReport></AgingDetailReport>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Copay Collection" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <ReportsLeftMenu></ReportsLeftMenu>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Copaycollection></Copaycollection>
              </div>
            </div>
          </div>
        </Route>

        {/* Setup Routes */}
        <Route path="/Setup" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Client></Client>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Client" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Client></Client>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/User" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <User></User>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Team" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Team></Team>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Practice" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Practice></Practice>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Location" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Location></Location>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Provider" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Provider></Provider>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Referring Provider" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ReferringProvider></ReferringProvider>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Insurance" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Insurance></Insurance>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Insurance Plan" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <InsurancePlan></InsurancePlan>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Insurance Portal" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <InsurancePortal></InsurancePortal>
              </div>
            </div>
          </div>
        </Route>

        <Route path="/Insurance Plan Address" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <InsurancePlanAddress></InsurancePlanAddress>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/EDI Submit Payer" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <EDISubmitPayer></EDISubmitPayer>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/EDI Eligibility Payer" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <EDIEligibilityPayer></EDIEligibilityPayer>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/EDI Status Payer" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <EDIStatusPayer></EDIStatusPayer>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/ICD" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ICD></ICD>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/CPT" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <CPT></CPT>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Modifiers" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Modifier></Modifier>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/POS" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <POS></POS>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Claim Status Category Codes" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <h1>Claim Status Category Codes</h1>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Claim Status Codes" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <h1>Claim Status Codes</h1>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Adjustment Codes" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <AdjustmentCode></AdjustmentCode>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Remark Codes" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <RemarkCode></RemarkCode>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Receiver" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Receiver></Receiver>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Submitter" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <Submitter></Submitter>
              </div>
            </div>
          </div>
        </Route>
        <Route path="/PatientSheet" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <PatientSheet />
              </div>
            </div>
          </div>
        </Route>
        <Route path="/ChargesSheet" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <ChargesSheet />
              </div>
            </div>
          </div>
        </Route>
        <Route path="/InsuranceMapping" exact>
          <div className="row" id="body-row">
            <div
              id="sidebar-container"
              className="sidebar-expanded d-none d-md-block col-2"
            >
              <ul className="list-group sticky-top sticky-offset">
                <Setup></Setup>
              </ul>
            </div>
            <div className="col-10 py-2">
              <div className="col-md-12">
                <InsuranceMapping />
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    );

    return (
      <Router>
        <div>
          {this.props.loginObject.isLogin == false ? (
            <Login></Login>
          ) : (
              <div className="App" style={{ marginTop: "-5px" }}>
                <Header></Header>
                {mainPage}
              </div>
            )}
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  console.log("state from App Page", state);
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false }
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectTabPageAction: selectTabPageAction, loginAction, loginAction },
    dispatch
  );
}
export default connect(mapStateToProps, matchDispatchToProps)(App);

serviceWorker.unregister();
// {/* <div className="row" id="body-row">
//                 <div
//                   id="sidebar-container"
//                   className="sidebar-expanded d-none d-md-block col-2"
//                 >
//                   <ul className="list-group sticky-top sticky-offset">
//                     <Switch>
//                       <Route path="/Dashboard" exact>
//                         <DummyLeftMenu></DummyLeftMenu>
//                       </Route>
//                       <Route path="/Scheduler" exact>
//                         <SchedulerLeftMenu></SchedulerLeftMenu>
//                       </Route>
//                       <Route path="/Provider Schedule" exact>
//                         <SchedulerLeftMenu></SchedulerLeftMenu>
//                       </Route>
//                       <Route path="/Day Sheet" exact>
//                         <SchedulerLeftMenu></SchedulerLeftMenu>
//                       </Route>
//                       <Route path="/CalendarScheduler" exact>
//                         <SchedulerLeftMenu></SchedulerLeftMenu>
//                       </Route>

//                       {/* Patient Left Menu Routes */}
//                       <Route path="/Patient" exact>
//                         <DummyLeftMenu></DummyLeftMenu>
//                       </Route>
//                       <Route path="/NewPatient" exact>
//                       <PatientLeftMenu></PatientLeftMenu>
//                       </Route>
//                       <Route path="/NewPatient/:id" exact>
//                       <PatientLeftMenu></PatientLeftMenu>
//                       </Route>
//                       <Route path="/Demographics" exact>
//                       <PatientLeftMenu></PatientLeftMenu>
//                       </Route>
//                       <Route path="/Plan" exact>
//                       <PatientLeftMenu></PatientLeftMenu>
//                       </Route>
//                       <Route path="/Payment" exact>
//                       <PatientLeftMenu></PatientLeftMenu>
//                       </Route>

//                       {/* Charge Left Menu Routes */}
//                       <Route path="/Charges" exact>
//                         <DummyLeftMenu></DummyLeftMenu>
//                       </Route>
//                       <Route path="/NewCharge" exact>
//                         <NewChargeLeftMenu></NewChargeLeftMenu>
//                       </Route>
//                       <Route path="/NewCharge/:id" exact>
//                         <NewChargeLeftMenu></NewChargeLeftMenu>
//                       </Route>
//                       <Route path="/Charge" exact>
//                         <NewChargeLeftMenu></NewChargeLeftMenu>
//                       </Route>
//                       <Route path="/HCFA1500" exact>
//                         <NewChargeLeftMenu></NewChargeLeftMenu>
//                       </Route>
//                       <Route path="/Payment" exact>
//                         <NewChargeLeftMenu></NewChargeLeftMenu>
//                       </Route>
//                       <Route path="/History" exact>
//                         <NewChargeLeftMenu></NewChargeLeftMenu>
//                       </Route>
//                       <Route path="/ChargeFollowup" exact>
//                         <NewChargeLeftMenu></NewChargeLeftMenu>
//                       </Route>

//                       {/* Batch Document Left Menu Routes */}
//                       <Route path="/Documents" exact>
//                         <NewBatchDocLeftMenu></NewBatchDocLeftMenu>
//                       </Route>
//                       <Route path="/BatchDocument" exact>
//                         <NewBatchDocLeftMenu></NewBatchDocLeftMenu>
//                       </Route>
//                       <Route path="/DocumentType" exact>
//                         <NewBatchDocLeftMenu></NewBatchDocLeftMenu>
//                       </Route>

//                       {/* Submissions Left Menu Routes */}
//                       <Route path="/Submissions" exact>
//                         <Submissions></Submissions>
//                       </Route>
//                       <Route path="/Paper Submission" exact>
//                       <Submissions></Submissions>
//                       </Route>
//                       <Route path="/Electronic Submission" exact>
//                       <Submissions></Submissions>
//                       </Route>
//                       <Route path="/Submission Log" exact>
//                       <Submissions></Submissions>
//                       </Route>
//                       <Route path="/Reports Log" exact>
//                       <Submissions></Submissions>
//                       </Route>

//                       {/* Payment Left Menu Routes */}
//                       <Route path="/Payments" exact>
//                         <DummyLeftMenu></DummyLeftMenu>
//                       </Route>
//                       <Route path="/ManualPosting" exact>
//                         <NewManualPostingMenu></NewManualPostingMenu>
//                       </Route>
//                       <Route path="/ManualPosting/:id" exact>
//                       <NewManualPostingMenu></NewManualPostingMenu>
//                       </Route>
//                       <Route path="/Manual Posting" exact>
//                         <NewManualPostingMenu></NewManualPostingMenu>
//                       </Route>

//                          {/* Followup Left Menu Routes */}

//                       <Route path="/Followup" exact>
//                         <FollowupLeftMenu></FollowupLeftMenu>
//                       </Route>
//                       <Route path="/Plan Follow Up" exact>
//                         <FollowupLeftMenu></FollowupLeftMenu>
//                       </Route>
//                       <Route path="/Patient Follow Up" exact>
//                         <FollowupLeftMenu></FollowupLeftMenu>
//                       </Route>

//                       <Route path="/Group" exact>
//                         <FollowupLeftMenu></FollowupLeftMenu>
//                       </Route>

//                       <Route path="/Reason" exact>
//                         <FollowupLeftMenu></FollowupLeftMenu>
//                       </Route>

//                       <Route path="/Action" exact>
//                         <FollowupLeftMenu></FollowupLeftMenu>
//                       </Route>

//                       {/* Reports Left Menu Routes */}
//                       <Route path="/Reports" exact>
//                         <ReportsLeftMenu></ReportsLeftMenu>
//                       </Route>
//                       <Route path="/Unit Report" exact>
//                         <ReportsLeftMenu></ReportsLeftMenu>
//                       </Route>

//                       {/* Setup Tab Left Navigation Routes  */}
//                       <Route path="/Setup" exact>
//                         <Setup></Setup>
//                       </Route>
//                       <Route path="/Client" exact component={Setup}></Route>
//                       <Route path="/User" exact component={Setup}></Route>
//                       <Route path="/Team" exact component={Setup}></Route>
//                       <Route path="/Practice" exact component={Setup}></Route>
//                       <Route path="/Location" exact component={Setup}></Route>
//                       <Route path="/Provider" exact component={Setup}></Route>
//                       <Route
//                         path="/Referring Provider"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route path="/Insurance" exact component={Setup}></Route>
//                       <Route
//                         path="/Insurance Plan"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route
//                         path="/Insurance Plan Address"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route
//                         path="/EDI Submit Payer"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route
//                         path="/EDI Eligibility Payer"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route
//                         path="/EDI Status Payer"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route path="/ICD" exact component={Setup}></Route>
//                       <Route path="/CPT" exact component={Setup}></Route>
//                       <Route path="/Modifiers" exact component={Setup}></Route>
//                       <Route path="/POS" exact component={Setup}></Route>
//                       <Route
//                         path="/Claim Status Category Codes"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route
//                         path="/Claim Status Codes"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route
//                         path="/Adjustment Codes"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route
//                         path="/Remark Codes"
//                         exact
//                         component={Setup}
//                       ></Route>
//                       <Route path="/Receiver" exact component={Setup}></Route>
//                       <Route path="/Submitter" exact component={Setup}></Route>
//                     </Switch>
//                   </ul>
//                 </div>
//                 <div className="col-10 py-2">
//                   <div className="col-md-12">
//                     <Switch>

//                     <Route path="/Dashboard" exact>
//                         <Dashboard></Dashboard>
//                       </Route>

//                     {/* Scheduler Main Content Routes */}
//                     <Route path="/Scheduler" exact>
//                     <ProviderScheduler></ProviderScheduler>
//                       </Route>
//                     <Route path="/Provider Schedule" exact>
//                         <ProviderScheduler></ProviderScheduler>
//                       </Route>
//                       <Route path="/Day Sheet" exact>
//                         <DaySheet></DaySheet>
//                       </Route>
//                       <Route path="/CalendarScheduler" exact>
//                         <CalenderScheduler></CalenderScheduler>
//                       </Route>

//                     {/* Patient Main Content Routes */}
//                       <Route path="/Patient" exact>
//                         <PatientSearch></PatientSearch>
//                       </Route>
//                       <Route path="/NewPatient" exact>
//                       <NewPatient></NewPatient>
//                       </Route>
//                       <Route path="/NewPatient/:id" exact>
//                       <NewPatient></NewPatient>
//                       </Route>
//                       <Route path="/Demographics" exact>
//                       <NewPatient></NewPatient>
//                       </Route>
//                       <Route path="/Plan" exact>
//                       <PatientPlan></PatientPlan>
//                       </Route>
//                       <Route path="/Payment" exact>
//                       <PatientPlan></PatientPlan>
//                       </Route>

//                       {/* Charge Main Content Routes */}
//                       <Route path="/Charges" exact>
//                         <ChargeSearch></ChargeSearch>
//                       </Route>
//                       <Route path="/NewCharge" exact>
//                         <NewCharge></NewCharge>
//                       </Route>
//                       <Route path="/NewCharge/:id" exact>
//                         <NewCharge></NewCharge>
//                       </Route>
//                       <Route path="/Charge" exact>
//                       <NewCharge></NewCharge>
//                       </Route>
//                       <Route path="/HCFA1500" exact>
//                       <HCFA1500></HCFA1500>
//                       </Route>
//                       <Route path="/Payment" exact>
//                       <NewCharge></NewCharge>
//                       </Route>
//                       <Route path="/History" exact>
//                       <NewCharge></NewCharge>
//                       </Route>
//                       <Route path="/ChargeFollowup" exact>
//                       <CreateFollowup></CreateFollowup>
//                       </Route>

//                       {/* Batch Document Main Content Routes */}
//                       <Route path="/Documents" exact>
//                       <BatchDocument></BatchDocument>
//                       </Route>
//                       <Route path="/BatchDocument" exact>
//                         <BatchDocument></BatchDocument>
//                       </Route>
//                       <Route path="/DocumentType" exact>
//                         <DocumentType></DocumentType>
//                       </Route>

//                       {/* Submissions Main Content Routes */}
//                       <Route path="/Submissions" exact>
//                       <PaperSubmission></PaperSubmission>
//                       </Route>
//                       <Route path="/Paper Submission" exact>
//                         <PaperSubmission></PaperSubmission>
//                       </Route>
//                       <Route path="/Electronic Submission" exact>
//                         <ElectronicSubmission></ElectronicSubmission>
//                       </Route>
//                       <Route path="/Submission Log" exact>
//                         <SubmissionLog></SubmissionLog>
//                       </Route>
//                       <Route path="/Reports Log" exact>
//                         <ReportsLog></ReportsLog>
//                       </Route>

//                       {/* Payment Main Content Routes */}
//                       <Route path="/Payments" exact>
//                         <PaymentSearch></PaymentSearch>
//                       </Route>

//                       <Route path="/ManualPosting" exact>
//                         <ManualPosting></ManualPosting>
//                       </Route>
//                       <Route path="/ManualPosting/:id" exact>
//                         <ManualPosting></ManualPosting>
//                       </Route>

//                       <Route path="/Manual Posting" exact>
//                         <ManualPosting></ManualPosting>
//                       </Route>

//                       {/* Followup Main Content Routes */}
//                       <Route path="/Followup" exact>
//                       <PlanFollowup></PlanFollowup>
//                       </Route>
//                       <Route path="/Plan Follow Up" exact>
//                         <PlanFollowup></PlanFollowup>
//                       </Route>
//                       <Route path="/Patient Follow Up" exact>
//                         <PatientFollowup></PatientFollowup>
//                       </Route>

//                       <Route path="/Group" exact>
//                         <Group></Group>
//                       </Route>

//                       <Route path="/Reason" exact>
//                         <Reason></Reason>
//                       </Route>

//                       <Route path="/Action" exact>
//                         <Action></Action>
//                       </Route>

//                       {/* Reports Main Content Routes  */}
//                       <Route path="/Reports" exact>
//                       <UnitReport></UnitReport>
//                       </Route>
//                       <Route path="/Unit Report" exact>
//                         <UnitReport></UnitReport>
//                       </Route>

//                       {/* Setup Main Content Routes */}
//                       <Route path="/Setup" exact>
//                         <Client></Client>
//                       </Route>
//                       <Route path="/Client" exact component={Client}></Route>
//                       <Route path="/User" exact component={User}></Route>
//                       <Route path="/Team" exact component={Team}></Route>
//                       <Route
//                         path="/Practice"
//                         exact
//                         component={Practice}
//                       ></Route>
//                       <Route
//                         path="/Location"
//                         exact
//                         component={Location}
//                       ></Route>
//                       <Route
//                         path="/Provider"
//                         exact
//                         component={Provider}
//                       ></Route>
//                       <Route
//                         path="/Referring Provider"
//                         exact
//                         component={ReferringProvider}
//                       ></Route>
//                       <Route
//                         path="/Insurance"
//                         exact
//                         component={Insurance}
//                       ></Route>
//                       <Route
//                         path="/Insurance Plan"
//                         exact
//                         component={InsurancePlan}
//                       ></Route>
//                       <Route
//                         path="/Insurance Plan Address"
//                         exact
//                         component={InsurancePlanAddress}
//                       ></Route>
//                       <Route
//                         path="/EDI Submit Payer"
//                         exact
//                         component={EDISubmitPayer}
//                       ></Route>
//                       <Route
//                         path="/EDI Eligibility Payer"
//                         exact
//                         component={EDIEligibilityPayer}
//                       ></Route>
//                       <Route
//                         path="/EDI Status Payer"
//                         exact
//                         component={EDIStatusPayer}
//                       ></Route>
//                       <Route path="/ICD" exact component={ICD}></Route>
//                       <Route path="/CPT" exact component={CPT}></Route>
//                       <Route
//                         path="/Modifiers"
//                         exact
//                         component={Modifier}
//                       ></Route>
//                       <Route path="/POS" exact component={POS}></Route>
//                       <Route
//                         path="/Claim Status Category Codes"
//                         exact
//                         component={POS}
//                       ></Route>
//                       <Route
//                         path="/Claim Status Codes"
//                         exact
//                         component={POS}
//                       ></Route>
//                       <Route
//                         path="/Adjustment Codes"
//                         exact
//                         component={AdjustmentCode}
//                       ></Route>
//                       <Route
//                         path="/Remark Codes"
//                         exact
//                         component={RemarkCode}
//                       ></Route>
//                       <Route
//                         path="/Receiver"
//                         exact
//                         component={Receiver}
//                       ></Route>
//                       <Route
//                         path="/Submitter"
//                         exact
//                         component={Submitter}
//                       ></Route>
//                     </Switch>
//                   </div>
//                 </div>
//               </div> */}

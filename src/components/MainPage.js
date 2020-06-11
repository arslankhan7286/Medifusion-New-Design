import React, { Component } from "react";
import LeftMenuItem from "./LeftMenuItem";

import Setup from "./Setup";
import Practice from "./Practice";
import Provider from "./Provider";
import ReferringProvider from "./ReferringProvider";
import Insurance from "./Insurance";
import Location from "./Location";

import InsurancePlan from "./InsurancePlan";
import CPT from "./CPT";
import leftNavMenusReducer from "../reducers/leftNavMenusReducer";
import Patient from "./Patient";
import PatientPlan from "./PatientPlan";
import ChargeSearch from "./ChargeSearch";
import PatientPayment from "./PatientPayment";
import Receiver from "./Receiver";
import Submitter from "./Submitter";
import InsurancePortal from "./components/InsurancePortal";

import PatientLeftMenu from "./PatientLeftMenu";
import NewPatient from "./NewPatient";
import Submissions from "./Submissions";
import ICD from "./ICD";
import Modifier from "./Modifier";
import POS from "./POS";
import InsurancePlanAddress from "./InsurancePlanAddress";
import EDISubmitPayer from "./EDISubmitPayer";
import EDIEligibilityPayer from "./EDIEligibilityPayer";
import EDIStatusPayer from "./EDIStatusPayer";
import NewCharge from "./NewCharge";
import PaymentSearch from "./PaymentSearch";
import NewChargeLeftMenu from "./NewChargeLeftMenu";

import ElectronicSubmission from "./ElectronicSubmission";
import PaperSubmission from "./PaperSubmission";
import SubmissionLog from "./SubmissionLog";

import NewPaymentLeftMenu from "./NewPaymentLeftMenu";
import NewManualPostingMenu from "./NewManualPostingMenu";
import ManualPosting from "./ManualPosting";
import NewPayment from "./NewPayment";

import AdjustmentCode from "./AdjustmentCode";
import RemarkCode from "./RemarkCode";
import HCFA1500 from "./HCFA1500";
import NewBatchDocLeftMenu from "./NewBatchDocLeftMenu";
import BatchDocument from "./BatchDocument";
import DocumentType from "./DocumentType";
import PlanFollowup from "./PlanFollowup";
import Followup from "./Followup";
import PatientFollowUp from "./PatientFollowUp";
import Group from "./Group";
import Reason from "./Reason";
import Action from "./Action";
import Client from "./Client";
import User from "./User";
import Team from "./Team";
import Scheduler from "./Scheduler";
import DaySheet from "./DaySheet";
import ProviderScheduler from "./ProviderScheduler";
import Dashboard from "./Dashboard";
import CalenderScheduler from "./CalenderScheduler";
import HACFA1500 from "./HCFA1500";
import ReportsLeftMenu from "./ReportsLeftMenu";
import UnitReport from "./UnitReport";
// import PatientVisitReport from './PatientVisitReport'
import ReportsLog from "./ReportsLog";
import CreateFollowup from "./CreateFollowup";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class MainPage extends Component {
  render() {
    let leftNavigation = "";
    let mainContent = "";

    let selectedTab = this.props.selectedTab;
    let selectedTabPage = this.props.selectedTabPage;

    console.log("Selected Tab : ", selectedTab);
    console.log("Selected Tab Page : ", selectedTabPage);


    return (
      <React.Fragment></React.Fragment>
    );
  }
}

function mapStateToProps(state) {

  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "Dashboard",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null }
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(MainPage);

import React, { Component } from "react";
import VitalWidgets from "../VitalWidget/VitalWidget";
import ClinicalNotes from "../ClinicalNotes/ClinicalNotes";
import DetailedNotes from "../DetailedNotes/ClinicalNotesDetail";
import TopFrom from "../TopForm/TopForm";
import DetailHeader from "../DetailedNotes/DetailHeader";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../../actions/selectTabAction";
import { loginAction } from "../../actions/LoginAction";
import { selectTabAction } from "../../actions/selectTabAction";

class NotesSummary extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div>
          <TopFrom patientID={this.props.id} />
          <VitalWidgets newID={this.props.id} />
        </div>
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
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.patientPaymentSearch,
          add: state.loginInfo.rights.patientPaymentCreate,
          update: state.loginInfo.rights.patientPaymentUpdate,
          delete: state.loginInfo.rights.patientPaymentDelete,
          export: state.loginInfo.rights.patientPaymentExport,
          import: state.loginInfo.rights.patientPaymentImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(NotesSummary);

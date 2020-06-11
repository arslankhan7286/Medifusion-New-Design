import React, { Component } from "react";



import practiceIcon from "../images/icons/practice.png";
import practiceHIocn from "../images/icons/practiceh.png";
import providerIocn from "../images/provider.png";
import providerHIcon from "../images/icons/providerh.png";
import refProviderIcon from "../images/icons/refProvider.png";
import refProviderHIcon from "../images/icons/refProviderh.png";
import insuranceIcon from "../images/icons/insurance.png";
import insuranceHIocn from "../images/icons/insuranceh.png";
import insurancePlanIcon from "../images/icons/insurancePlan.png";
import insurancePlanHIcon from "../images/icons/insurancePlanh.png";
import insurancePlanAddressIcon from "../images/icons/insurancePlanAddress.png";
import insurancePlanAddressHIcon from "../images/icons/insurancePlanAddressh.png";
// import submitIocn from "../images/icons/submit.png";
// import submitHIcon from "../images/icons/submith.png";
// import eligibilityIcon from "../images/icons/eligibility.png";
// import eligibilityHIcon from "../images/icons/eligibilityh.png";
// import statusIcon from "../images/icons/status.png";
// import statusHIcon from "../images/icons/statush.png";
import icdIcon from "../images/icons/icd.png";
import icdHIcon from "../images/icons/icdh.png";
import cptIcon from "../images/icons/cpt.png";
import cptHIcon from "../images/icons/cpth.png";
import modifierIcon from "../images/icons/modifier.png";
import modifierHIcon from "../images/icons/modifierh.png";
import posIcon from "../images/icons/pos.png";
import posHIcon from "../images/icons/posh.png";
// import adjustmentIcon from "../images/icons/adjustment.png";
// import adjustmentHIcon from "../images/icons/adjustmenth.png";
// import remarkIocn from "../images/icons/remark.png";
// import remarkHIcon from "../images/icons/remarkh.png";
// import receiverIcon from "../images/icons/receiver.png";
// import receiverHIcon from "../images/icons/receiverh.png";

import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/icons/location.png";
import locationHIcon from "../images/icons/locationh.png";
import provIcon from "../images/provider-icon.png";
import provHIcon from "../images/provider-icon-hover.png";
import refprovIcon from "../images/referring-icon.png";
import refprovHIcon from "../images/referring-icon-hover.png";

import LeftMenuItem from "./LeftMenuItem";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class ReportsLeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      setupLeftMenu: {},
    };
  }

  render() {
    let setupLeftMenuR = [{
        Category: "Account Report",
        id:"Report",
        index:0,
        Icon: "facilityIcon",
        hIcon: "",
        expanded: true,
        SubCategories: [
          {
            SubCategory: "Unit Report",
            id:"Report",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            to: "/Unit Report",
            selectTabPageAction : "UNIT REPORT",
            selected: this.props.selectedTabPage == "UNIT REPORT" ? true : false
          },
          {
            SubCategory: "Aging Summary Report",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "AGING SUMMARY REPORT",
            to: "/Aging Report",
            selected:
              this.props.selectedTabPage == "AGING SUMMARY REPORT"
                ? true
                : false
          },
          {
            SubCategory: "Aging Detail Report",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "AGING DETAIL REPORT",
            to: "/Aging Detail Report",
            selected:
              this.props.selectedTabPage == "AGING DETAIL REPORT" ? true : false
          },
          {
            SubCategory: "Collection Report",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "COLLECTION REPORT",
            to: "/Collection Report",
            selected:
              this.props.selectedTabPage == "COLLECTION REPORT" ? true : false
          }
        ]
      },
      {
        Category: "Patient Report",
        id :"patientR",
        index:1,
        Icon: "",
        hIcon: "",
        expanded: true,
        SubCategories: [
          {
            SubCategory: "Patient Visit Report",
            id :"patientR",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "PATIENT VISIT REPORT",
            to: "/Patient Visit Report",
            selected:
              this.props.selectedTabPage == "PATIENT VISIT REPORT"
                ? true
                : false
          },
          {
            SubCategory: "Appointment Status",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "APPOINTMENT STATUS",
            to: "/Patient Appointment Status",
            selected:
              this.props.selectedTabPage == "APPOINTMENT STATUS" ? true : false
          },
          {
            SubCategory: "Pending Claims",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "PENDING CLAIMS",
            to: "/Patient Pending Claims",
            selected:
              this.props.selectedTabPage == "PENDING CLAIMS" ? true : false
          },
          {
            SubCategory: "Referral Physician",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "REFERRAL PHYSICIAN",
            to: "/Patient By Referal Physician",
            selected:
              this.props.selectedTabPage == "REFERRAL PHYSICIAN" ? true : false
          },
          {
            SubCategory: "Copay Collection",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "COPAY COLLACTION",
            to: "/Copay Collection",
            selected:
              this.props.selectedTabPage == "COPAY COLLACTION" ? true : false
          },
          {
            SubCategory: "Patient Authorization",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            selectTabPageAction : "PATIENT AUTHORIZATION",
            to: "/Patient auth Report",
            selected:
              this.props.selectedTabPage == "PATIENT AUTHORIZATION" ? true : false
          },
        ]
      }
    ];

    let leftMenuElements = [];
    setupLeftMenuR.map((catogry, i) => {
      leftMenuElements.push(<LeftMenuItem data={catogry}></LeftMenuItem>);
    });

    return (
      <div id="wrapper">
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <div className="text-center d-md-inline">
          <hr className="sidebar-divider"></hr>
          <div>
        {leftMenuElements}
        {/* <select
          style={{
            background: "none",
            border: "none",
            width: "100%",
            color: "#fff",
            borderBottom: "1px solid #4f8897",
            padding: "10px",
          }}
        >
          <option style={{ background: "rgb(19, 71, 96)" }}>
            {this.props.LeftMenuDates.date}
          </option>
          {this.props.LeftMenuDates.otherDates
            ? this.props.LeftMenuDates.otherDates.map((date) => (
                <option style={{ background: "rgb(19, 71, 96)" }}>
                  {date.dos}
                </option>
              ))
            : null}
        </select> */}
      </div>
        </div>
      </ul>
    </div>

     
    );
  }
}

function mapStateToProps(state) {
  console.log(state.leftNavigationMenus);
  return {
    leftNavigationMenus: state.leftNavigationMenus,
    selectedTab: state.selectedTab,
    selectedTabPage: state.selectedTabPage
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectTabPageAction: selectTabPageAction },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(ReportsLeftMenu);

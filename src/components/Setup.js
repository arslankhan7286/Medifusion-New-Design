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

class Setup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const setupLeftMenu = [
      {
        Category: "CLIENT SETUP",
        id: "client",
        index:0,
        Icon: "",
        hIcon: "",
        expanded: true,
        SubCategories: [
          {
            SubCategory: "Client",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            to: "/Client",
            selectTabPageAction : "CLIENT",
            selected: this.props.selectedTabPage == "CLIENT" ? true : false
          },
          {
            SubCategory: "User",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to: "/User",
            selectTabPageAction :  "USER",
            selected: this.props.selectedTabPage == "USER" ? true : false
          },
          {
            SubCategory: "Team",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to: "/Team",
            selectTabPageAction :  "TEAM",
            selected: this.props.selectedTabPage == "TEAM" ? true : false
          }
        ]
      },
      {
        Category: "ADMIN",
        id: "admin",
        index:1,
        Icon: "",
        hIcon: "",
        expanded: false,
        SubCategories: [
          {
            SubCategory: "Practice",
            Icon: practiceIcon,
            hIcon: practiceHIocn,
            to: "/Practice",
            selectTabPageAction :  "PRACTICE",
            selected: this.props.selectedTabPage == "PRACTICE" ? true : false
          },
          {
            SubCategory: "Location",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to: "/Location",
            selectTabPageAction : "LOCATION",
            selected: this.props.selectedTabPage == "LOCATION" ? true : false
          },
          {
            SubCategory: "Provider",
            Icon: providerIocn,
            hIcon: providerHIcon,
            to: "/Provider",
            selectTabPageAction :  "PROVIDER",
            selected: this.props.selectedTabPage == "PROVIDER" ? true : false
          },
          {
            SubCategory: "Referring Provider",
            Icon: refProviderIcon,
            hIcon: refProviderHIcon,
            selected: false,
            to: "/Referring Provider",
            selectTabPageAction :  "REFERRING PROVIDER",
            selected:
              this.props.selectedTabPage == "REFERRING PROVIDER" ? true : false
          }
        ]
      },
      {
        Category: "INSURANCE",
        id: "insurance",
        index:2,
        Icon: "",
        handler: "",
        expanded: false,
        SubCategories: [
          {
            SubCategory: "Insurance",
            Icon: insuranceIcon,
            hIcon: insuranceHIocn,
            to: "/Insurance",
            selectTabPageAction : "INSURANCE",
            selected: this.props.selectedTabPage == "INSURANCE" ? true : false
          },
          {
            SubCategory: "Insurance Plan",
            Icon: insurancePlanIcon,
            hIcon: insurancePlanHIcon,
            to: "/Insurance Plan",
            selectTabPageAction : "INSURANCE PLAN",
            selected:
              this.props.selectedTabPage == "INSURANCE PLAN" ? true : false
          },
          {
            SubCategory: "Insurance Portal",
            Icon: insurancePlanIcon,
            hIcon: insurancePlanHIcon,
            to: "/Insurance Portal",
            selectTabPageAction : "INSURANCE PORTAL",
            selected:
              this.props.selectedTabPage == "INSURANCE PORTAL" ? true : false
          },
          {
            SubCategory: "Insurance Plan Address",
            Icon: insurancePlanAddressIcon,
            hIcon: insurancePlanAddressHIcon,
            to: "/Insurance Plan Address",
            selectTabPageAction:"INSURANCE PLAN ADDRESS",
            selected:
              this.props.selectedTabPage == "INSURANCE PLAN ADDRESS"
                ? true
                : false
          },
          {
            SubCategory: "EDI Submit Payer",
            Icon: provIcon,
            hIcon: provHIcon,
            to: "/EDI Submit Payer",
            selectTabPageAction : "EDI SUBMIT PAYER",
            selected:
              this.props.selectedTabPage == "EDI SUBMIT PAYER" ? true : false
          },
          {
            SubCategory: "EDI Eligibility Payer",
            Icon: provIcon,
            hIcon: provHIcon,
            to: "/EDI Eligibility Payer",
            selectTabPageAction:"EDI ELIGIBILITY PAYER",
            selected:
              this.props.selectedTabPage == "EDI ELIGIBILITY PAYER"
                ? true
                : false
          },
          {
            SubCategory: "EDI Status Payer",
            Icon: provIcon,
            hIcon: provHIcon,
            to: "/EDI Status Payer",
            selectTabPageAction : "EDI STATUS PAYER",
            selected:
              this.props.selectedTabPage == "EDI STATUS PAYER" ? true : false
          }
        ]
      },
      {
        Category: "CODING",
        id: "coding",
        index:3,
        Icon: "",
        handler: "",
        expanded: false,
        SubCategories: [
          {
            SubCategory: "ICD",
            Icon: icdIcon,
            hIcon: icdHIcon,
            to: "/ICD",
            selectTabPageAction : "ICD",
            selected: this.props.selectedTabPage == "ICD" ? true : false
          },
          {
            SubCategory: "CPT",
            Icon: cptIcon,
            hIcon: cptHIcon,
            to: "/CPT",
            selectTabPageAction : "CPT",
            selected: this.props.selectedTabPage == "CPT" ? true : false
          },
          {
            SubCategory: "Modifiers",
            Icon: modifierIcon,
            hIcon: modifierHIcon,
            to: "/Modifiers",
            selectTabPageAction : "MODIFIERS",
            selected: this.props.selectedTabPage == "MODIFIERS" ? true : false
          },
          {
            SubCategory: "POS",
            Icon: posIcon,
            hIcon: posHIcon,
            to: "/POS",
            selectTabPageAction : "POS",
            selected: this.props.selectedTabPage == "POS" ? true : false
          }
        ]
      },
      {
        Category: "EDI CODES",
        id: "edi",
        index:4,
        Icon: "",
        handler: "",
        expanded: false,
        SubCategories: [
          // {
          //   SubCategory: "Claim Status Category Codes",
          //   Icon: facilityIcon,
          //   hIcon: facilityHIcon,
          //   to: "/Claim Status Category Codes",
          //   handler: () =>
          //     this.props.selectTabPageAction("CLAIM STATUS CATEGORY CODES",
          //   selected:
          //     this.props.selectedTabPage == "CLAIM STATUS CATEGORY CODES"
          //       ? true
          //       : false
          // },
          // {
          //   SubCategory: "Claim Status Codes",
          //   Icon: locationIcon,
          //   hIcon: locationHIcon,
          //   to: "/Claim Status Codes",
          //   selectTabPageAction : "CLAIM STATUS CODES",
          //   selected:
          //     this.props.selectedTabPage == "CLAIM STATUS CODES" ? true : false
          // },
          {
            SubCategory: "Adjustment Codes",
            Icon: provIcon,
            hIcon: provHIcon,
            to: "/Adjustment Codes",
            selectTabPageAction : "ADJUSTMENT CODES",
            selected:
              this.props.selectedTabPage == "ADJUSTMENT CODES" ? true : false
          },
          {
            SubCategory: "Remark Codes",
            Icon: provIcon,
            hIcon: provHIcon,
            to: "/Remark Codes",
            selectTabPageAction : "REMARK CODES",
            selected:
              this.props.selectedTabPage == "REMARK CODES" ? true : false
          }
        ]
      },
      {
        Category: "RECEIVER SETUP",
        id: "receiver",
        index:5,
        Icon: "",
        handler: "",
        expanded: false,
        SubCategories: [
          {
            SubCategory: "Receiver",
            Icon: facilityHIcon,
            hIcon: facilityHIcon,
            to: "/Receiver",
            selectTabPageAction : "REMARK CODES",
            selected:
              this.props.selectedTabPage == "REMARK CODES" ? true : false
          },
          {
            SubCategory: "Submitter",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to: "/Submitter",
            selectTabPageAction : "SUBMITTER",
            selected: this.props.selectedTabPage == "SUBMITTER" ? true : false
          }
        ]
      }, /////////Khizer code
      {
        Category: "DATA MIGRATION",
        id: "datamigration",
        index:6,
        Icon: "",
        handler: "",
        expanded: false,
        SubCategories: [
          {
            SubCategory: "Patient Sheet",
            Icon: facilityHIcon,
            hIcon: facilityHIcon,
            to: "/PatientSheet",
            selectTabPageAction : "PATIENT SHEET",
            selected:
              this.props.selectedTabPage == "PATIENT SHEET" ? true : false
          },
          {
            SubCategory: "Charges Sheet",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to: "/ChargesSheet",
            selectTabPageAction : "CHARGES SHEET",
            selected:
              this.props.selectedTabPage == "CHARGES SHEET" ? true : false
          },
          {
            SubCategory: "Insurance Mapping",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to: "/InsuranceMapping",
            selectTabPageAction : "INSURANCE MAPPING",
            selected:
              this.props.selectedTabPage == "INSURANCE MAPPING" ? true : false
          }
        ]
      }
    ];

    let leftMenuElements = [];
    setupLeftMenu.map((catogry, i) => {
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
            {leftMenuElements}
          </div>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    leftNavigationMenus: state.leftNavigationMenus,
    selectedTab: state.selectedTab,
    selectedTabPage: state.selectedTabPage
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

export default connect(mapStateToProps, matchDispatchToProps)(Setup);

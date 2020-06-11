import React, { Component } from "react";

import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/location-icon.png";
import locationHIcon from "../images/location-icon-hover.png";
import ClinicalNotes from "../images/icons/clinical-notes.png";
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

class PatientLeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      setupLeftMenu: {},
    };
  }

  render() {
    let setupLeftMenu1 = [{
      Category: "PATIENT",
      id:"patient",
      index:0,
      Icon: facilityIcon,
      hIcon: "",
      expanded: true,
      SubCategories: [
        {
          SubCategory: "Demographics",
          id:"patient",
          Icon: facilityIcon,
          hIcon: facilityHIcon,
          to: "/Demographics",
          selectTabPageAction : "DEMOGRAPHICS",
          selected: this.props.selectedTabPage == "DEMOGRAPHICS" ? true : false,
        },
        {
          SubCategory: "Plan",
          Icon: locationIcon,
          hIcon: locationHIcon,
          to: "/Plan",
          selectTabPageAction : "PLAN",
          selected: this.props.selectedTabPage == "PLAN" ? true : false,
        },
        {
          SubCategory: "Payment",
          Icon: locationIcon,
          hIcon: locationHIcon,
          to: "/PatientPayment",
          selectTabPageAction : "PAYMENT",
          selected: this.props.selectedTabPage == "PAYMENT" ? true : false,
        },
        {
          SubCategory: "Clinical Notes",
          Icon: ClinicalNotes,
          hIcon: locationHIcon,
          to: "/ClinicalNotes",
          selectTabPageAction : "CLINICALNOTES",
          selected:
            this.props.selectedTabPage == "CLINICALNOTES" ? true : false,
        },
      ],
    }];

    let setupLeftMenu2 = [{
      Category: "PATIENT",
      id:"patient",
      index:0,
      Icon: facilityIcon,
      hIcon: "",
      expanded: true,
      SubCategories: [
        {
          SubCategory: "Demographics",
          Icon: facilityIcon,
          hIcon: facilityHIcon,
          to: "/Demographics",
          selectTabPageAction : "DEMOGRAPHICS",
          selected: this.props.selectedTabPage == "DEMOGRAPHICS" ? true : false,
        },
      ],
    }];

    let leftMenuElements = [];
    if (this.props.reduxID > 0) {
      setupLeftMenu1.map((catogry, i) => {
        leftMenuElements.push(<LeftMenuItem data={catogry}></LeftMenuItem>);
      });
    } else {
      setupLeftMenu2.map((catogry, i) => {
        leftMenuElements.push(<LeftMenuItem data={catogry}></LeftMenuItem>);
      });
    }

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
  console.log("Sate From Patient Left Menu : ", state);
  return {
    reduxID: state.selectedTab !== null ? state.selectedTab.id : 0,
    selectedTab: state.selectedTab,
    selectedTabPage: state.selectedTabPage,
    LeftMenuDates: state.LeftMenuDates
      ? state.LeftMenuDates
      : {
          date: "",
          otherDates: [],
        },
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectTabPageAction: selectTabPageAction },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(PatientLeftMenu);

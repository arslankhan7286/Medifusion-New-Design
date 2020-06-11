import React, { Component } from "react";

import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/location-icon.png";
import locationHIcon from "../images/location-icon-hover.png";
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

class NewChargeLeftMenu extends Component {
  constructor(props) {
    super(props); 
  }


  render() {
    let visitLeftMenu = [{
      Category: "Visit",
      id:"visit",
      index:0,
      Icon: facilityIcon,
      hIcon: "",
      expanded: true,
      SubCategories: [
        {
          SubCategory: "Charge",
          Icon: facilityIcon,
          hIcon: facilityHIcon,
          to:"/Charge",
          selectTabPageAction : "CHARGE",
          selected: this.props.selectedTabPage == "CHARGE" ? true : false
        },
        {
          SubCategory: "HCFA1500",
          Icon: locationIcon,
          hIcon: locationHIcon,
          to:"/HCFA1500",
          selectTabPageAction : "HCFA1500",
          selected: this.props.selectedTabPage == "HCFA1500" ? true : false
        },

        // {
        //   SubCategory: "Payment",
        //   Icon: locationIcon,
        //   hIcon: locationHIcon,
        //   to:"/ChargePayment",
        //   handler: () => this.props.selectTabPageAction("PAYMENT"),
        //   selected: this.props.selectedTabPage == "PAYMENT" ? true : false
        // },
        // {
        //   SubCategory: "History",
        //   Icon: locationIcon,
        //   hIcon: locationHIcon,
        //   to:"/History",
        //   handler: () => this.props.selectTabPageAction("HISTORY"),
        //   selected: this.props.selectedTabPage == "HISTORY" ? true : false
        // },
        {
          SubCategory: "Followup",
          Icon: locationIcon,
          hIcon: locationHIcon,
          to:"/ChargeFollowup",
          selectTabPageAction : "FOLLOWUP",
          selected: this.props.selectedTabPage == "FOLLOWUP" ? true : false
        }
      ],
    }];


   

    let leftMenuElements = [];
    visitLeftMenu.map((catogry, i) => {
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
      </div>
        </div>
      </ul>
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectedTab: state.selectedTab,
    selectedTabPage: state.selectedTabPage
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewChargeLeftMenu);

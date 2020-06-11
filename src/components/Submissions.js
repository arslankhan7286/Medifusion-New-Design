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

class Submissions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let setupLeftMenu = [
      {
        Category: "Submissions",
        id: "submissions",
        index:0,
        Icon: "",
        hIcon: "",
        expanded: true,
        SubCategories: [
          {
            SubCategory: "Electronic Submission",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            to: "/Electronic Submission",
            selectTabPageAction : "ELECTRONIC SUBMISSION",
            selected:
              this.props.selectedTabPage == "ELECTRONIC SUBMISSION"
                ? true
                : false,
          },
          {
            SubCategory: "Paper Submission",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to: "/Paper Submission",
            selectTabPageAction : "PAPER SUBMISSION",
            selected:
              this.props.selectedTabPage == "PAPER SUBMISSION" ? true : false,
          },
          {
            SubCategory: "Submission Log",
            Icon: provIcon,
            hIcon: provHIcon,
            to: "/Submission Log",
            selectTabPageAction : "SUBMISSION LOG",
            selected:
              this.props.selectedTabPage == "SUBMISSION LOG" ? true : false,
          },
          {
            SubCategory: "Reports Log",
            Icon: provIcon,
            hIcon: provHIcon,
            to: "/Reports Log",
            selectTabPageAction : "REPORTS LOG",
            selected:
              this.props.selectedTabPage == "REPORTS LOG" ? true : false,
          },
        ],
      },
    ];


    let leftMenuElements = [];
    setupLeftMenu.map((catogry, i) => {
      leftMenuElements.push(<LeftMenuItem data={catogry}></LeftMenuItem>);
    });


    // let leftMenuElements = [];
    // setupLeftMenu.map((catogry, i) => {
    //   leftMenuElements.push(<LeftMenuItem data={catogry}></LeftMenuItem>);
    // });
    // return leftMenuElements;

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
  console.log(state.leftNavigationMenus);
  return {
    leftNavigationMenus: state.leftNavigationMenus,
    selectedTab: state.selectedTab,
    selectedTabPage: state.selectedTabPage,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectTabPageAction: selectTabPageAction },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Submissions);

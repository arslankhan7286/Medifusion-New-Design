import React, { Component } from "react";
import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/location-icon.png";
import locationHIcon from "../images/location-icon-hover.png";

import LeftMenuItem from "./LeftMenuItem";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class Scheduler extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let setupLeftMenu = [
      {
        Category: "",
        Icon: "",
        hIcon: "",
        expanded: true,
        SubCategories: [
          {
            SubCategory: "Provider Schedule",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
           to:"/Provider Schedule",
           handler: () => this.props.selectTabPageAction("PROVIDER SCHEDULE"),
           selected: this.props.selectedTabPage == "PROVIDER SCHEDULE" ? true : false
          },
          {
            SubCategory: "Day Sheet",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to:"/Day Sheet",
            handler: () => this.props.selectTabPageAction("DAY SHEET"),
            selected: this.props.selectedTabPage == "DAY SHEET" ? true : false
          },
          {
            SubCategory: "CalendarScheduler",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to:"/CalendarScheduler",
            handler: () => this.props.selectTabPageAction("CALENDARSCHEDULER"),
            selected: this.props.selectedTabPage == "CALENDARSCHEDULER" ? true : false
          }
        ]
      }
    ];
    let leftMenuElements = [];
    setupLeftMenu.map((catogry, i) => {
      leftMenuElements.push(<LeftMenuItem data={catogry}></LeftMenuItem>);
    });

    return leftMenuElements;
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

export default connect(mapStateToProps, matchDispatchToProps)(Scheduler);

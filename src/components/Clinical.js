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

export class Clinical extends Component {
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
            SubCategory: "Clinical Form",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
           to:"/Clinical",
           handler: () => this.props.selectTabPageAction("CLINICAL"),
           selected: this.props.selectedTabPage == "CLINICAL" ? true : false
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

export default connect(mapStateToProps, matchDispatchToProps)(Clinical);

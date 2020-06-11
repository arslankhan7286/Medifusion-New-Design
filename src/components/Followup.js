import React, { Component } from "react";

import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/location-icon.png";
import locationHIcon from "../images/location-icon-hover.png";
import provIcon from "../images/provider-icon.png";
import provHIcon from "../images/provider-icon-hover.png";
import LeftMenuItem from "./LeftMenuItem";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class Followup extends Component {
  constructor(props) {
    super(props);

   
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.state = {
      setupLeftMenu: {}
    };
  }

  render() {
    console.log(this.props.leftNavigationMenus);

    let setupLeftMenu = [
      {
        Category: "Followup",
        Icon: facilityIcon,
        id:"Followup",
        index:0,
        hIcon: facilityHIcon,
        hIcon: "",
        expanded: true,
        SubCategories: [
          {
            SubCategory: "Plan Follow Up",
            Icon: facilityIcon,
            hIcon: facilityHIcon,
            id:"follow",
           to:"/Plan Follow Up",
           selectTabPageAction : "PLAN FOLLOW UP",
           selected: this.props.selectedTabPage == "PLAN FOLLOW UP" ? true : false
          },
          {
            SubCategory: "Patient Follow Up",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to:"/Patient Follow Up",
            selectTabPageAction : "PATIENT FOLLOW UP" ,
            selected: this.props.selectedTabPage == "PATIENT FOLLOW UP" ? true : false
          },
          {
            SubCategory: "Statement Log",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to: "/Statement Log",
            selectTabPageAction : "STATEMENT LOG",
            selected:this.props.selectedTabPage == "STATEMENT LOG" ? true : false,
          },
          {
            SubCategory: "Group",
            Icon: provIcon,
            hIcon: provHIcon,
            to:"/Group",
            selectTabPageAction : "GROUP",
            selected: this.props.selectedTabPage == "GROUP" ? true : false
          },
          {
            SubCategory: "Action",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to:"/Action",
            selectTabPageAction : "ACTION",
            selected: this.props.selectedTabPage == "ACTION" ? true : false
          },
          {
            SubCategory: "Reason",
            Icon: locationIcon,
            hIcon: locationHIcon,
            to:"/Reason",
            selectTabPageAction : "REASON",
            selected: this.props.selectedTabPage == "REASON" ? true : false
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

export default connect(mapStateToProps, matchDispatchToProps)(Followup);

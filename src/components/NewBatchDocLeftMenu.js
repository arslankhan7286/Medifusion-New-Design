import React, { Component } from "react";
import LeftMenuItem from "./LeftMenuItem";
import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/location-icon.png";
import locationHIcon from "../images/location-icon-hover.png";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction"

export class NewBatchDocLeftMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setupLeftMenu: {}
    };
  }
 



  render() {
    let NewBatchDocLeftMenu = {
      Category: "Documents",
      Icon: "facilityIcon",
      id:"DocumentFile",
      index:0,
      hIcon: "",
      expanded: true,
      SubCategories: [
        {
          SubCategory: "BatchDocument",
          Icon: facilityIcon,
          hIcon: facilityHIcon,
          to:"/BatchDocument",
          id:"Batchdocuments",
          selectTabPageAction : "BATCHDOCUMENT",
            selected: this.props.selectedTabPage == "BATCHDOCUMENT" ? true : false
        },
        {
          SubCategory: "DocumentType",
          Icon: facilityIcon,
          hIcon: facilityHIcon,
          to:"/DocumentType",
          selectTabPageAction : "DOCUMENTTYPE",
            selected: this.props.selectedTabPage == "DOCUMENTTYPE" ? true : false
        }
      ]
    };
    let leftMenuElements = (
      <LeftMenuItem data={NewBatchDocLeftMenu}></LeftMenuItem>
    );

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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewBatchDocLeftMenu);

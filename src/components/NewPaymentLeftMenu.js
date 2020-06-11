import React, { Component } from 'react'


import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/location-icon.png";
import locationHIcon from "../images/location-icon-hover.png";

import LeftMenuItem from "./LeftMenuItem";

//Redux Actions
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { selectTabPageAction } from '../actions/selectTabAction';
import {loginAction} from '../actions/LoginAction';
import {selectTabAction} from '../actions/selectTabAction'

export class NewPaymentLeftMenu extends Component {
    constructor(props) {
        super(props)

      
    }
    render() {

        let NewPaymentLeftMenu = [
            {
             Category: "PAYMENT",
             id:"payment",
             Icon: "",
             hIcon: "",
             expanded: true,
             SubCategories: [
                 {
                     SubCategory: "ManualPosting",
                     Icon: facilityIcon,
                     hIcon: facilityHIcon,
                     to:"/ManualPosting",
                     handler: () => this.props.selectTabPageAction("ManualPosting"),
                      selected: this.props.selectedTabPage == "ManualPosting" ? true : false
                 }
             ]
            }
         ]

        let leftMenuElements = [];
        NewPaymentLeftMenu.map((catogry, i) => {
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
    console.log("state from Header Page" , state);
    return {
        selectedTab: state.selectedTab !== null ? state.selectedTab.selectedTab : '',
        selectedTabPage: state.selectedTabPage,
        selectedPopup: state.selectedPopup,
        id: state.selectedTab !== null ? state.selectedTab.id : 0,
        setupLeftMenu: state.leftNavigationMenus,
        loginObject:state.loginToken ? state.loginToken : { toekn:"" , isLogin : false},
        userInfo : state.loginInfo ? state.loginInfo : {userPractices : [] , name : "",practiceID:null}
    };
  }
  function matchDispatchToProps(dispatch) {
    return bindActionCreators({ selectTabPageAction: selectTabPageAction , loginAction : loginAction  , selectTabAction : selectTabAction}, dispatch);
  }
  
  export default connect(mapStateToProps, matchDispatchToProps)(NewPaymentLeftMenu);
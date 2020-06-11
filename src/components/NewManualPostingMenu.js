import React, { Component } from 'react'


import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";


import LeftMenuItem from "./LeftMenuItem";




import facilityIcon from "../images/facility-icon.png";
import facilityHIcon from "../images/facility-icon-hover.png";
import locationIcon from "../images/location-icon.png";
import locationHIcon from "../images/location-icon-hover.png";




export class NewManualPostingMenu extends Component {
    constructor(props) {
        super(props)

       

        this.state = {
            NewPaymentLeftMenu: this.NewPaymentLeftMenu
        }
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
                     SubCategory: "Manual Posting",
                     Icon: facilityIcon,
                     hIcon: facilityHIcon,
                     to:"/Manual Posting",
                     handler: () => this.props.selectTabPageAction("Manual Posting"),
                      selected: this.props.selectedTabPage == "Manual Posting" ? true : false
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
    return {};
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        { selectTabPageAction: selectTabPageAction },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    matchDispatchToProps
)(NewManualPostingMenu)

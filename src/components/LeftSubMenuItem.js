import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";

export class LeftSubMenuItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: this.props.data.selected
        ? this.props.data.hIcon
        : this.props.data.Icon,
      expanded: this.props.expanded,
      selected: this.props.data.selected,
      mySelected: false
    };
  }

  mouseEnter = () => {
    if (this.props.data.selected == false) {
      this.setState({ image: this.props.data.Icon });
    } else {
      this.setState({ image: this.props.data.Icon });
    }
  };

  mouseLeave = () => {
    if (this.props.data.selected == false) {
      this.setState({ image: this.props.data.Icon });
    } else {
      this.setState({ image: this.props.data.hIcon });
    }
  };

  click = (event, to) => {
event.preventDefault()
    this.props.history.push(to);
    this.props.selectTabPageAction(this.props.data.selectTabPageAction);
  };

  render() {
    // var image = this.props.data.selected ? this.props.data.hIcon:this.state.image;

    console.log("Select Teb Page Action : " ,this.props.selectedTabPage)
    return (
      <React.Fragment>
        <a
        style={{marginLeft:"-5px"}}
         className={this.props.data.selectTabPageAction === this.props.selectedTabPage ? "activeTab collapse-item" : "collapse-item"}
          href="" onClick={(event) => this.click(event, this.props.data.to)}>
          <span>
            <img src={this.props.data.Icon} alt="" style={{ width: "32px" , marginRight:"10px" }} />
          </span>
          {this.props.data.SubCategory}
        </a>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    leftNavigationMenus: state.leftNavigationMenus,
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    { selectTabPageAction: selectTabPageAction },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(LeftSubMenuItem));

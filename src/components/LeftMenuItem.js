import React, { Component } from "react";
import LeftSubMenuItem from "./LeftSubMenuItem";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";

class LeftMenuItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //data: this.props.data,
            expanded: this.props.data.expanded
            // image: null
        };
    }

    SidebarCollapse = () => {
        this.setState(prevState => ({
            expanded: prevState.expanded ? false : true
        }));
    };

    LinkToFunc = componentName => {
        console.log("Component Name : ", componentName);
        var name = "/" + componentName;
        console.log("Props : ", this.props);
    };

    render() {
        let leftMenuElements = [];
        this.props.data.SubCategories.map((subCategory, i) => {
            leftMenuElements.push(<LeftSubMenuItem data={subCategory}></LeftSubMenuItem>);
        });

        return (
            <li class="nav-item">
                <a
                    className="nav-link collapsed"
                    href="#"
                    data-toggle="collapse"
                    data-target={`#${this.props.data.id}`}
                    // aria-expanded="true"
                    // aria-controls="collapsePages"
                >
                    <i className="fas"></i> <span>{this.props.data.Category}</span>
                </a>

                <div
                    id={this.props.data.id}
                    className={this.props.data.index == 0 ? "collapse show" : "collapse"}
                    // aria-labelledby="headingPages"
                    data-parent="#accordionSidebar"
                >
                    <div className="py-2 collapse-inner rounded">
                        {leftMenuElements}
                    </div>
                </div>
            </li>
        );
    }
}

function mapStateToProps(state) {
    // console.log('state from leftmenu item');
    // console.log(state);
    return {};
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        { selectTabPageAction: selectTabPageAction },
        dispatch
    );
}

export default connect(mapStateToProps, matchDispatchToProps)(LeftMenuItem);

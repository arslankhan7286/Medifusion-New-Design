import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class TopMenuItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: this.props.icon
    };
  }

  mouseEnter = () => {
    this.setState({ image: this.props.hoverIcon });
  };

  mouseLeave = () => {
    this.setState({ image: this.props.icon });
  };

  render() {
    return (
      <li
        className={this.props.liClassName}
        style={{
          backgroundImage: `url(${this.state.image})`
        }}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <NavLink to={this.props.to}>
          <span>
            <a className={this.props.aClassName} onClick={this.props.handler}>
              {this.props.Caption}
            </a>
          </span>
        </NavLink>
      </li>
    );
  }
}

export default TopMenuItem;

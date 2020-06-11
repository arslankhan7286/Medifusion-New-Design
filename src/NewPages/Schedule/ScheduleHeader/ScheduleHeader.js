import React, { Component } from "react";
import "../ScheduleHeader/ScheduleHeader.css";
import ReactToPrint from "react-to-print";
// import {
//   TabContent,
//   TabPane,
//   Nav,
//   NavItem,
//   NavLink,
//   Card,
//   Button,
//   CardTitle,
//   CardText,
//   Row,
//   Col
// } from "reactstrap";
import { Tabs, Tab } from "react-tab-view";
// import classnames from "classnames";
import ScheduleForm from "../ScheduleForm/ScheduleForm";
import Encounter from "../Encounter/Encounter";

class ScheduleHeader extends Component {
  constructor(props) {
    super(props);
    this.componentRef = React.createRef();
  }

  componentDidMount() {
    //Adding custom className for CSS
    Array.from(document.querySelectorAll(".iMnhxj")).forEach((tab) => {
      tab.className += " schedularTab";
    });

    Array.from(document.querySelectorAll(".content")).forEach((tab) => {
      tab.className += " schedularContent";
    });
  }
  render() {
    let headers = [];
    // console.log("Rendering Scedule Header");
    // const headers = ["Appointment", "Eligibility", "Encounter", "Vitals"];
    if (this.props.selectedEvent) {
      headers = ["Appointment", "Encounter"];
    } else headers = ["Appointment"];
    return (
      <div className="AppointmentTophead">
        <div>
          <strong className="Headerheader float-left w-100">
            Schedule Appointment
          </strong>
        </div>
        <div className="text-right">
          {/* <button className="headerlog">View log</button> */}
          <i
            onClick={this.props.onRequestClose}
            class="fas fa-times SchedularCross"
          ></i>
        </div>
        <div className="float-left w-100">
          <Tabs headers={headers} style={{ cursor: "default" }}>
            <Tab>
              <div style={{ height: "100%" }}>
                <ScheduleForm
                  args={this.props.args}
                  onRequestClose={this.props.onRequestClose}
                  selectedEvent={this.props.selectedEvent}
                  // patientNames={this.props.patientNames}
                  visitReason={this.props.visitReason}
                  rooms={this.props.rooms}
                  location={this.props.location}
                  eventArgs={this.props.eventArgs}
                  deleteAppointment={this.props.deleteAppointment}
                />
              </div>
            </Tab>
            {/* <Tab>Eligibility</Tab> */}
            {this.props.selectedEvent ? (
              <Tab>
                <div>
                  <ReactToPrint
                    trigger={() => (
                      <i
                        class="fas fa-print"
                        style={{ fontSize: "20px", float: "right" }}
                      ></i>
                    )}
                    content={() => this.componentRef.current}
                    copyStyles
                  />
                  <div ref={this.componentRef}>
                    <Encounter
                      args={this.props.args}
                      selectedEvent={this.props.selectedEvent}
                    />
                  </div>
                </div>
              </Tab>
            ) : null}
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ScheduleHeader;

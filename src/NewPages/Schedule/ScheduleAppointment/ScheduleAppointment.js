import React, { Component } from "react";
import "./ScheduleAppoinment.css";
import ScheduleHeader from "../ScheduleHeader/ScheduleHeader";
import ScheduleForm from "../ScheduleForm/ScheduleForm";

class ScheduleAppointment extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // console.log("Rendering Scedule Appointment");
    return (
      <div>
        <ScheduleHeader
          args={this.props.args}
          selectedEvent = {this.props.selectedEvent}
          onRequestClose={this.props.onRequestClose}
          // patientNames={this.props.patientNames}
          visitReason={this.props.visitReason}
          rooms={this.props.rooms}
          location={this.props.location}
          eventArgs = {this.props.eventArgs}
          deleteAppointment = {this.props.deleteAppointment}
        />
      </div>
    );
  }
}

export default ScheduleAppointment;

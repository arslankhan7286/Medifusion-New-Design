import React, { Component } from "react";

export default class MedicationDetails extends Component {
  render() {
    return (
      <div className="medication">
        <div className="row">
          <div className="col-12 mb-3">
            <span href="#" className="widget-heading">
              Medication
              <i class="fas fa-edit text-white ml-3"></i>
            </span>
          </div>
        </div>
        <h7>No Medication Found !</h7>
        {/* <ul
          className="fa-ul medication"
          style={{ listStyleType: "circle", marginTop: "10px" }}
        >
          <li>
            <span className="fa-li"></span>
            <strong>Aspirin</strong>
            81 mg Tablet Delayed Release 12/15/08
          </li>
          <li>
            <span className="fa-li"></span>
            <strong>azithromyzine (Zimthromax)</strong>
            250 mg oral tablet Start 12/15/08
          </li>
          <li>
            <span className="fa-li"></span>
            <strong>Dexlansoperazole (Dexilant)</strong>
            250 mg oral tablet Start 12/15/08
          </li>
          <li>
            <span className="fa-li"></span>
            <strong>Aspirin</strong>
            81 mg Tablet Delayed Release 12/15/08
          </li>
          <li>
            <span className="fa-li"></span>
            <strong>azithromyzine (Zimthromax)</strong>
            250 mg oral tablet Start 12/15/08
          </li>
          <li>
            <span className="fa-li"></span>
            <strong>Dexlansoperazole (Dexilant)</strong>
            250 mg oral tablet Start 12/15/08
          </li>
        </ul> */}
      </div>
    );
  }
}

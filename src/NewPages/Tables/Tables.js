import React, { Component } from "react";
import { Table } from "reactstrap";
import { FaBeer } from "react-icons/fa";

import "../Tables/Table.css";
import styles from "../Tables/Table.module.css";

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      edit: false,
    };
  }

  handleNumericCheck = (event) => {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  };

  enter = (e) => {
    if (e.keyCode == 13) {
      console.log("Pressed");
      this.setState({
        edit: false,
      });
    }
  };

  changeType = (e) => {
    this.setState({
      edit: true,
    });
  };

  render() {
    return (
      <div>
        <div className="row" style={{ marginTop: "10px" }}>
          <div className="col-lg-6 ">
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.tableHeadTname}>ICD-10 Codes</th>
                  <th className={styles.tableHead} colSpan="3">
                    <div id="parentICD" class="autocomplete">
                      <button
                        className="SchedularAppointmentButtons Schedulartablefields bil-button mr-2"
                        name="ICDpopup"
                        onClick={(e) => this.props.openPopups(e)}
                      >
                        Billing Pick List
                      </button>
                      <input
                        style={{ padding: "5px" }}
                        value={this.props.icdCode}
                        autocomplete="off"
                        onChange={(e) => this.props.addEventListener(e)}
                        // onKeyDown={e => this.props.KeyDown(e)}
                        id="ICDcode"
                        type="text"
                        name="icdCode"
                        className="Schedulartablefields search-icon border-0"
                        placeholder="Choose ICD 10"
                      />
                      {this.props.icdCode === "" ? (
                        <i class="Schedularsearch"></i>
                      ) : (
                        <i
                          onClick={(e) => this.props.clearField(e)}
                          id="Schedularcross"
                          class="fas fa-times icdSearch"
                        ></i>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.tableHeadings}>
                  <td className="font-weight-bold">#</td>
                  <td className="font-weight-bold">Code</td>
                  <td className="font-weight-bold">Description</td>
                  <td className="font-weight-bold">Delete</td>
                </tr>
                {this.props.icdRows
                  ? this.props.icdRows.map((row) =>
                      row.inactive == true ? null : (
                        <tr className={styles.tableRow}>
                          <td className={styles.tableData}>{row.srNo}</td>
                          <td className={styles.tableData}>
                            {row.icdCode ? row.icdCode : row.icdid}
                          </td>
                          <td className={styles.tableData}>
                            {row.description}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <i
                              onClick={(e) => this.props.deleteTableRow(e, row)}
                              id="SchedularcrossTable"
                              class="fas fa-times patientSearch"
                              title="ICD"
                            ></i>
                          </td>
                        </tr>
                      )
                    )
                  : null}
              </tbody>
            </table>
          </div>
          <div className="col-lg-6 pl-0">
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th className={styles.tableHeadTname} colSpan="2">
                    CPT-10 Codes
                  </th>
                  <th colSpan="6" className={styles.tableHead}>
                    <div id="parentCPT" class="autocomplete">
                      <button
                        className="SchedularAppointmentButtons Schedulartablefields bil-button mr-2"
                        name="CPTpopup"
                        onClick={(e) => this.props.openPopups(e)}
                      >
                        CPT Pick List
                      </button>
                      <input
                        style={{ padding: "5px" }}
                        value={this.props.cptCode}
                        autocomplete="off"
                        onChange={(e) => this.props.addEventListener(e)}
                        // onKeyDown={e => this.props.KeyDown(e)}
                        id="CPTcode"
                        type="text"
                        name="cptCode"
                        className="Schedulartablefields search-icon border-0 "
                        placeholder="Find CPT / HCPCS"
                      />
                      {this.props.cptCode === "" ? (
                        <i class="Schedularsearch"></i>
                      ) : (
                        <i
                          onClick={(e) => this.props.clearField(e)}
                          id="Schedularcross"
                          class="fas fa-times cptSearch"
                        ></i>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.tableHeadings}>
                  <td className="font-weight-bold">Code</td>
                  {/* <td className="font-weight-bold">Description</td> */}
                  {/* <td className="font-weight-bold">NDC Units</td> */}
                  <td className="font-weight-bold">Modifier1</td>
                  <td className="font-weight-bold">Pointers</td>
                  {/* <td className="font-weight-bold">Modifier2</td> */}
                  <td className="font-weight-bold">Units</td>
                  <td className="font-weight-bold">Amount($)</td>
                  <td className="font-weight-bold">Total Amount($)</td>
                  <td className="font-weight-bold">Delete</td>
                </tr>
                {this.props.cptRows
                  ? this.props.cptRows.map((row, i) =>
                      row.inactive == true ? null : (
                        <tr className={styles.tableRow}>
                          <td
                            // onMouseOver={() => this.setState({ hover: true })}
                            // onMouseLeave={() => this.setState({ hover: false })}
                            className={styles.tableData}
                          >
                            {/* {this.state.hover ? row.description : row.cptCode} */}
                            {row.cptCode}
                          </td>
                          {/* <td className={styles.tableData}>{row.description}</td> */}
                          {/* <td className={styles.tableData}>{row.ndcUnits}</td> */}
                          {/* <td className={styles.tableData}>{row.modifier1}</td> */}
                          {this.state.edit ? (
                            <td>
                              <input
                                style={{
                                  height: "30px",
                                  width: "70px",
                                  paddingLeft: "7px",
                                }}
                                name="modifier1"
                                type="text"
                                value={row.modifier1}
                                onChange={(e) =>
                                  this.props.changeCPTFieldHandler(e, row)
                                }
                                onKeyDown={(e) => this.enter(e)}
                              />
                            </td>
                          ) : (
                            <td
                              onDoubleClick={(e) => this.changeType(e)}
                              className={styles.tableData}
                            >
                              {row.modifier1}
                            </td>
                          )}
                          <td className={styles.tableData}>
                            <input
                              autoComplete="off"
                              type="text"
                              maxlength="2"
                              name="pointer1"
                              style={{ height: "20px", width: "25px" }}
                              className="text-center mr-1"
                              value={row.pointer1}
                              onChange={(e) =>
                                this.props.changeCPTFieldHandler(e, row)
                              }
                              onKeyPress={(e) => this.handleNumericCheck(e)}
                            />
                            <input
                              autoComplete="off"
                              type="text"
                              maxlength="2"
                              name="pointer2"
                              style={{ height: "20px", width: "25px" }}
                              className="text-center mr-1"
                              value={row.pointer2}
                              onChange={(e) =>
                                this.props.changeCPTFieldHandler(e, row)
                              }
                              onKeyPress={(e) => this.handleNumericCheck(e)}
                            />
                            <input
                              autoComplete="off"
                              type="text"
                              maxlength="2"
                              name="pointer3"
                              style={{ height: "20px", width: "25px" }}
                              className="text-center mr-1"
                              value={row.pointer3}
                              onChange={(e) =>
                                this.props.changeCPTFieldHandler(e, row)
                              }
                              onKeyPress={(e) => this.handleNumericCheck(e)}
                            />
                            <input
                              autoComplete="off"
                              type="text"
                              maxlength="2"
                              name="pointer4"
                              style={{ height: "20px", width: "25px" }}
                              className="text-center mr-1"
                              value={row.pointer4}
                              onChange={(e) =>
                                this.props.changeCPTFieldHandler(e, row)
                              }
                              onKeyPress={(e) => this.handleNumericCheck(e)}
                            />
                          </td>
                          {/* <td className={styles.tableData}>{row.modifier2}</td> */}
                          {/* <td className={styles.tableData}>{row.units}</td> */}
                          {this.state.edit ? (
                            <td>
                              <input
                                style={{
                                  height: "30px",
                                  width: "50px",
                                  paddingLeft: "7px",
                                }}
                                name="units"
                                type="number"
                                value={row.units}
                                onChange={(e) =>
                                  this.props.changeCPTFieldHandler(e, row)
                                }
                                onKeyDown={(e) => this.enter(e)}
                              />
                            </td>
                          ) : (
                            <td
                              onDoubleClick={(e) => this.changeType(e)}
                              className={styles.tableData}
                            >
                              {row.units}
                            </td>
                          )}
                          {this.state.edit ? (
                            <td>
                              <input
                                style={{
                                  height: "30px",
                                  width: "70px",
                                  paddingLeft: "7px",
                                }}
                                name="amount"
                                type="number"
                                value={row.amount}
                                onChange={(e) =>
                                  this.props.changeCPTFieldHandler(e, row)
                                }
                                onKeyDown={(e) => this.enter(e)}
                              />
                            </td>
                          ) : (
                            <td
                              onDoubleClick={(e) => this.changeType(e)}
                              className={styles.tableData}
                            >
                              ${row.amount}
                            </td>
                          )}
                          <td className={styles.tableData}>
                            ${row.totalAmount}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <i
                              onClick={(e) => this.props.deleteTableRow(e, row)}
                              id="SchedularcrossTable"
                              class="fas fa-times patientSearch"
                              title="CPT"
                            ></i>
                          </td>
                        </tr>
                      )
                    )
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Tables;

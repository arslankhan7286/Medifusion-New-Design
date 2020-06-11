import React, { Component } from "react";
import "../../Tables/Table.css";
import styles from "../../Tables/Table.module.css";

class EncounterCPTTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("DATA", this.props.data);
    console.log("types", this.props.types);
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            {this.props.types
              ? this.props.types.map((t, index) =>
                  this.props.even ? (
                    (index + 1) % 2 == 0 ? null : (
                      <table
                        className={styles.table}
                        style={{ marginTop: "10px" }}
                      >
                        <thead>
                          <tr className={styles.tableHeader}>
                            <th
                              style={{ textAlign: "center" }}
                              className={styles.tableHead}
                              colSpan="5"
                            >
                              <h5>{t ? t : "Other"}</h5>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={styles.tableHeadings}>
                            <td className="font-weight-bold"></td>
                            <td
                              className="font-weight-bold"
                              style={{ width: "60px" }}
                            >
                              Code
                            </td>
                            <td className="font-weight-bold">Description</td>
                            <td
                              className="font-weight-bold"
                              style={{ width: "60px" }}
                            >
                              Price
                            </td>
                            <td className="font-weight-bold"></td>
                          </tr>
                          {this.props.data.map((row) =>
                            t != row.type ? null : (
                              <tr className={styles.tableRow}>
                                <td className={styles.tableData}>
                                  <input
                                    checked={row.chk}
                                    className="schedularpicklistCHKS"
                                    id={row.id}
                                    // onChange={(e) => this.checkHandler(e)}
                                    type="checkbox"
                                    readOnly
                                  ></input>
                                </td>
                                <td className={styles.tableData}>
                                  {row.cptCode}
                                </td>
                                <td className={styles.tableData}>
                                  {row.description}
                                </td>
                                <td className={styles.tableData}>
                                  ${row.amount}
                                </td>
                                <td className={styles.tableData}></td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )
                  ) : (index + 1) % 2 != 0 ? null : (
                    <table
                      className={styles.table}
                      style={{ marginTop: "10px" }}
                    >
                      <thead>
                        <tr className={styles.tableHeader}>
                          <th
                            style={{ textAlign: "center" }}
                            className={styles.tableHead}
                            colSpan="5"
                          >
                            <h5>{t ? t : "Other"}</h5>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={styles.tableHeadings}>
                          <td className="font-weight-bold"></td>
                          <td
                            className="font-weight-bold"
                            style={{ width: "60px" }}
                          >
                            Code
                          </td>
                          <td className="font-weight-bold">Description</td>
                          <td
                            className="font-weight-bold"
                            style={{ width: "60px" }}
                          >
                            Price
                          </td>
                          <td className="font-weight-bold"></td>
                        </tr>
                        {this.props.data.map((row) =>
                          t != row.type ? null : (
                            <tr className={styles.tableRow}>
                              <td className={styles.tableData}>
                                <input
                                  checked={row.chk}
                                  className="schedularpicklistCHKS"
                                  id={row.id}
                                  // onChange={(e) => this.checkHandler(e)}
                                  type="checkbox"
                                  readOnly
                                ></input>
                              </td>
                              <td className={styles.tableData}>
                                {row.cptCode}
                              </td>
                              <td className={styles.tableData}>
                                {row.description}
                              </td>
                              <td className={styles.tableData}>
                                ${row.amount}
                              </td>
                              <td className={styles.tableData}></td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  )
                )
              : null}
          </div>
        </div>
      </div>
    );
  }
}

export default EncounterCPTTable;

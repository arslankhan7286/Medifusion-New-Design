import React, { Component } from 'react'

export class viewHCFAFile extends Component {
    constructor(props) {
        super(props)

        alert("View HACFA File")
        this.type = "pdf";
        //   this.file = 'http://192.168.110.44/database/api/PaperSubmission/DownloadHCFAFile/' + this.props.data.logSubmitId

        this.file = "https://arxiv.org/pdf/quant-ph/0410100.pdf"

    }

    render() {
        return (
            <div>
                <h1>View HCFA 1500</h1>
                <iframe
                    class={this.type}
                    width="830"
                    height="700"
                    frameBorder="0"
                    src={`http://docs.google.com/gview?url=${this.file}&embedded=true`}
                >
                </iframe>
            </div>
        );
    }
}

export default viewHCFAFile

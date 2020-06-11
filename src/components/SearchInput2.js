import React from 'react'

import Label from './Label'
import Button from './Input'
import Input from './Input'

function SearchInput2(props) {
    return (
        <div className="row-form">
            <div className="mf-6">
                <Label name={props.name}></Label>
                <Input type={props.type} name={props.name} id={props.id} value={props.value} onChange={() => props.handleChange} />
            </div>
            {/* <div className="mf-6">
                <Label name={props.name}></Label>
                <Input type={props.type} name={props.name} id={props.id} value={props.name} onChange={() => props.handleChange} />
            </div> */}
        </div>
    )
}

export default SearchInput2

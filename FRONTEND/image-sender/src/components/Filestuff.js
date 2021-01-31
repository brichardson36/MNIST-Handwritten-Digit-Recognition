import React from "react"
import "../App.css"

export default function Filestuff (props){

    const [file, setFile] = React.useState()

    return(
        <div>
            <h1>Input Number Image:</h1>
            <input onChange = {(e) => handleFileChange(e)} type = "file" placeholder = "select file"/>
            {/* <button onClick = {showFile}>Show curr File</button> */}
        </div>
    );

    function handleFileChange(selected){
        setFile(selected)
    }

    // function showFile(){
    //     console.log(file)
    // }
}
import React, { useEffect, useState, useRef } from "react"
import "../App.css"
import axios, {post } from 'axios';

export default function Filestuff (props){

    const [file, setFile] = React.useState()
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth/2;
        canvas.height = window.innerHeight/2;
        canvas.style.width = '${window.innerWidth}px';
        canvas.style.height = '${window.innerHeight}px';

        const context = canvas.getContext("2d")
        // context.scale(2,2)
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 5
        contextRef.current = context
    }, [])

    return(
        <div>
            {/* <input onChange = {(e) => handleFileChange(e)} type = "file" placeholder = "select file"/> */}
            <canvas
            class = "canvasClass"
            id = "canvas"
            onMouseDown = {startDrawing}
            onMouseUp = {finishDrawing}
            onMouseMove = {draw}
            ref = {canvasRef}
            >
            </canvas>
            <p/>
            <button onClick = {sendFile}>Send Drawn Image</button>
        </div>
    );

    function handleFileChange(selected){
        setFile(selected.target.files[0])
    }

    function startDrawing({nativeEvent}){
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
    }

    function finishDrawing(){
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    function draw({nativeEvent}){
        if(!isDrawing){
            return
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }

    // function downloadImage(){
    //     let downloadLink = document.createElement('a');
    //     downloadLink.setAttribute('download', 'CanvasAsImage.png');
    //     let canvas = document.getElementById('canvas');
    //     let dataURL = canvas.toDataURL('image/png');
    //     let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    //     downloadLink.setAttribute('href', url);
    //     downloadLink.click();
    // }

    function sendFile(){
        // if(file !== null){
        //     let formData = new FormData()
        //     formData.append('file', file)

        //     console.log(formData)

        // }
        let canvas = document.getElementById('canvas');
        canvas.toBlob(function(blob) {
            const formData = new FormData();
            formData.append('file', blob, 'num.png');

            fetch('http://127.0.0.1:5000/predict/', 
            {
              method: 'POST',
              body: formData,
            })
            .then(response => response.json())
            .then(response => {
              console.log(response)
              this.setState({
                result: response.result,
              });
            });
        })
        // return post(url, formData, config)
    }
}
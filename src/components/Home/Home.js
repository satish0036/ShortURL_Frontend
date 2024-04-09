// App.js

import React, { useState } from 'react';
import styles from './Home.module.css';
import axios from "axios";
import { BASE_URL } from '../helper.js';
const Home = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [analysisUrl, setAnalysisUrl] = useState('');
    const [clickCount, setClickCount] = useState(0);
    const [clickLogs, setClickLogs] = useState([]);
    const [errorMessage,setErrormessage]=useState("")
    const [errorMessageinAlalytics,setErrorMessageinAlalytics]=useState("")


    const handleShortenUrl = async () => {
        setShortUrl("");
        setErrormessage("")
        if (originalUrl === "" || !originalUrl) {
            console.log("Please Enter url!")
            setErrormessage("Please Enter url!")
            return;
        }
        try {
            const data = {
                "url": originalUrl
            }
            // Making a POST request to the url endpoint
            const res = await axios.post(`${BASE_URL}/`, data, { withCredentials: true })
            setShortUrl(res.data.id);
        }
        catch (err) {
            // Handling errors and displaying the error message from the server
            setErrormessage(err.response.data.error)
            console.log(err.response.data.error)
        }
    };

    const handleAnalysisUrl = async () => {
        try {

            const parts = analysisUrl.split('/'); // Split the URL by '/'
            const lastPart = parts[parts.length - 1]; // Get the last part of the array

            console.log(lastPart);
            if (lastPart==="" || !lastPart){
                console.log("enter valid url")
                setErrorMessageinAlalytics("Enter a valid URL")
                return
            }
            // Making a POST request to the url endpoint
            const res = await axios.get(`${BASE_URL}/analytics/${lastPart}`, { withCredentials: true })
            setClickCount(res.data.totalClick)
            setClickLogs(res.data.analytics)
            // console.log(res)
        }
        catch (err) {
            // Handling errors and displaying the error message from the server
            console.log(err.response.data.error)
            setErrorMessageinAlalytics(err.response.data.error)
        }
       };

    return (
        <div className={styles.container}>
            <h1>URL Shortener</h1>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={originalUrl}
                    onChange={(e) => (setOriginalUrl(e.target.value),setErrormessage(""))}
                    placeholder="Enter URL to shorten"
                    required
                    className={styles.inputBox}
                />
                <button onClick={handleShortenUrl}>Shorten</button>
            </div>
            {errorMessage?<div className={styles.shortUrl}>{errorMessage}</div>:<div></div>}
            {shortUrl && (
                <div className={styles.shortUrl}>
                    Shortened URL: <a href={`https://shorturl-backend-rljj.onrender.com/url/${shortUrl}`} target="_blank" rel="noopener noreferrer">{`https://shorturl-backend-rljj.onrender.com/url/${shortUrl}`}</a>
                </div>
            )}
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={analysisUrl}
                    onChange={(e) => (setAnalysisUrl(e.target.value), setErrorMessageinAlalytics(""))}
                    placeholder="Enter URL to analyze"
                    required
                    className={styles.inputBox}
                />
                <button onClick={handleAnalysisUrl}>Analyze</button>
            </div>
            {errorMessageinAlalytics?<div>{errorMessageinAlalytics}</div>:""}
            <div className={styles.analysisResult}>
                <p>Total Clicks: {clickCount}</p>
                <ul className={styles.timeandDate}>
                    {clickLogs?.map((log, index) => (
                        <li key={index} className={styles.logItem} >
                            {new Date(log.timeStamp).toLocaleString()} 
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;

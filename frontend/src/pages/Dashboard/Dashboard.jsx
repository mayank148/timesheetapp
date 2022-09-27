import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'; 
import { MdOutlineModeEditOutline } from 'react-icons/md'; 
import { toast } from 'react-toastify';
import { base_url } from '../../constants';
import { useNavigate } from 'react-router-dom';
import TimeEditModal from '../../components/TimeEditModal/TimeEditModal';
import momentTz from 'moment-timezone';
import DateTimePicker from 'react-datetime-picker';
import './Dashboard.css'
import moment from 'moment-timezone';

function Dashboard() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoginTimeEditModalOpen, setIsLoginTimeEditModalOpen] = useState(false)
    const [isLogoutTimeEditModalOpen, setIsLogoutTimeEditModalOpen] = useState(false)
    const [timeInputApiLoading, setTimeInputApiLoading] = useState(false);
    const [timesheetData, setTimesheetData] = useState([]);
    const [timesheetApiLoading, setTimesheetApiLoading] = useState(false);
    
    const [timeAndDateValue, setTimeAndDateValue] = useState(new Date());
    const [timeAndDateMaxValue, setTimeAndDateMaxValue] = useState();
    const [timeAndDateMinValue, setTimeAndDateMinValue] = useState();
    const [timeAndDateId, setTimeAndDateId] = useState();

    const [createNewDate, setCreateNewDate] = useState(new Date());

    const navigate = useNavigate();

    // Api call using axios
    const timesheetDataApi = () => {
        setTimesheetApiLoading(true);
        axios({
            url: `${base_url}/timesheet`,
            method: 'GET',
            headers: { 
                "Content-Type": "application/json", 
                "x-access-tokens": localStorage.getItem("clock_access_token") 
            },
        })
        .then((responce) => {
            if(responce){
                setTimesheetApiLoading(false);
                let data = responce.data.Timesheet
                const sorted = data.sort((a,b)=>{
                    const dateA = new Date(`${a.date} ${a.time}`).valueOf();
                    const dateB = new Date(`${b.date} ${b.time}`).valueOf();
                    if(dateA > dateB){
                      return 1; // return -1 here for DESC order
                    }
                    return -1 // return 1 here for DESC Order
                });
                setTimesheetData(sorted)
                // console.log("timeinputDataApi", responce.data.Timesheet);
                toast.success( responce.data.message );
            }
        })
        .catch(err => {
            console.log(err);
            toast.error( err.message );
            setTimesheetApiLoading(false);
        })
    }

    useEffect(() => {
        timesheetDataApi();
    }, []);
    // console.log('timesheetData :', timesheetData)

    

    // Api call using axios
    const startTimeApi = ( startTimeData ) => {
        // setTimeInputApiLoading(true);
        axios({
            url: `${base_url}/starttime`,
            method: 'POST',
            data: {'start_date': moment(startTimeData).format('YYYY-MM-DD[T]HH:mm:ss')},
            headers: { 
                "Content-Type": "application/json", 
                "x-access-tokens": localStorage.getItem("clock_access_token") 
            },
        })
        .then((responce) => {
            if(responce){
                // setTimeInputApiLoading(false);
                // console.log("startTimeApi", responce.data);
                timesheetDataApi();
                setIsLogoutTimeEditModalOpen(false);
                toast.success( responce.data.message );
            }
        })
        .catch(err => {
            console.log(err);
            toast.error( err.message );
            // setTimeInputApiLoading(false);
        })
    }
    

    // Api call using axios
    const updateTimeApi = ( updateTimeData, timeAndDateId ) => {
        // setUpdateTimeApiLoading(true);
        axios({
            url: `${base_url}/updatetime`,
            method: 'POST',
            data: {
                "start_date": moment(updateTimeData).format('YYYY-MM-DD[T]HH:mm:ss'),
                "id": timeAndDateId
            },
            headers: { 
                "Content-Type": "application/json", 
                "x-access-tokens": localStorage.getItem("clock_access_token") 
            },
        })
        .then((responce) => {
            if(responce){
                // setUpdateTimeApiLoading(false);
                // console.log("updateTimeApi", responce.data);
                timesheetDataApi();
                setIsLogoutTimeEditModalOpen(false);
                toast.success( responce.data.message );
            }
        })
        .catch(err => {
            console.log(err);
            toast.error( err.message );
            // setUpdateTimeApiLoading(false);
        })
    }
    

    // Api call using axios
    const endTimeApi = ( endTimeData, timeAndDateId ) => {
        // setEndTimeApiLoading(true);
        axios({
            url: `${base_url}/endtime`,
            method: 'POST',
            data: {
                "end_date": moment(endTimeData).format('YYYY-MM-DD[T]HH:mm:ss'),
                "id": timeAndDateId
            },
            headers: { 
                "Content-Type": "application/json", 
                "x-access-tokens": localStorage.getItem("clock_access_token") 
            },
        })
        .then((responce) => {
            if(responce){
                // setEndTimeApiLoading(false);
                // console.log("endTimeApi", responce.data);
                timesheetDataApi();
                setIsLogoutTimeEditModalOpen(false);
                toast.success( responce.data.message );
            }
        })
        .catch(err => {
            console.log(err);
            toast.error( err.message );
            // setEndTimeApiLoading(false);
        })
    }

    const logoutHandler = () => {
        localStorage.removeItem("clock_access_token")
        navigate('/')
    }

    const dateFormetter = ( time ) => {
        var dateObj = new Date(time);
        var momentObj = moment(dateObj);
        
        return moment.utc(time).format('DD/MM/YYYY HH:mm:ss');
    }

    const dateFormetterAlt = ( time, timeAndDateId ) => {
        var dateObj = new Date(time);
        var momentObj = moment(dateObj);

        if(time && time != 'NA'){
            setTimeAndDateValue(momentObj);
        }else {
            setTimeAndDateValue(new Date());
        }

        setTimeAndDateId(timeAndDateId)
    }

    console.log("dateFormetterAlt timeAndDateId :", timeAndDateId)
    
    const endDateMinValueCalculator = ( startDateTime ) => {
        var dateObj = new Date(startDateTime);
        var momentObj = moment(dateObj);

        setTimeAndDateMinValue(momentObj)
    }
    
    const endDateMaxValueCalculator = ( startDateTime ) => {
        var dateObj = new Date(startDateTime);
        var momentObj = moment(dateObj);
        var momentObj24hrMoreTemp = moment(momentObj).add(23, 'hours');
        var momentObj24hrMore = moment(momentObj24hrMoreTemp).add(59, 'minutes');

        setTimeAndDateMaxValue(momentObj24hrMore)
    }

    // console.log('timeAndDateMaxValue :::',  timeAndDateMaxValue)

    const durationFormetter = ( duration ) => {
        var hour = duration.split(":")[0];
        var minute = duration.split(":")[1];

        return (
            <div className='d-flex justify-content-end'>
                {hour > 0 ?
                    <>
                        <text className="font-weight-bold">{hour}</text>hours
                        &nbsp;
                        <text className="font-weight-bold">{minute}</text>minutes
                    </>
                    :
                    <>
                        <text className="font-weight-bold">{minute}</text>minutes
                    </>
                }                
            </div>
        )
    }

    return (
        <div className='dashboard '>
            <div className="dashboard-header d-flex justify-content-between align-items-center py-2 px-4">
                <h2 className="text-secondary text-uppercase">Dashboard</h2>
                <div 
                    className="user-icon cursor-pointer position-relative" 
                    onClick={() => {setIsDropdownOpen(!isDropdownOpen)}}
                >
                    <FaUserCircle size={36} color='#666666'/>
                    {isDropdownOpen && 
                        <div className="user-icon-dropdown py-2 px-4 position-absolute" onClick={() => {logoutHandler()}}>
                            logout
                        </div>
                    }
                </div>
            </div>
            <div className="create-new-row d-flex justify-content-end my-4">
                <div className="mx-2">
                <DateTimePicker 
                    value={createNewDate} 
                    onChange={(date) => setCreateNewDate(date)} 
                />
                </div>
                <button 
                    className="btn btn-success mx-2"
                    onClick={() => {
                        startTimeApi(createNewDate);
                    }}
                >
                    Add new duration
                </button>
            </div>
            <div className="user-data mt-2">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">User name</th>
                            <th scope="col">Login time</th>
                            <th scope="col">Logout time</th>
                            <th scope="col" className='d-flex justify-content-end'>Total login duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timesheetData.length > 0 ?
                            timesheetData?.map((interval, i) => {
                                return(
                                    <tr key={i}>
                                        <th scope="row">{i+1}</th>
                                        <td>{interval.name}</td>
                                        <td>
                                            <div className="d-flex justify-content-between">
                                            {interval.start_date ? dateFormetter(interval.start_date) : "NA"}
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => {
                                                        setIsLoginTimeEditModalOpen(true)
                                                        dateFormetterAlt(interval.start_date, interval.id)
                                                        setTimeAndDateMaxValue()
                                                        setTimeAndDateMinValue()
                                                    }}
                                                >
                                                    <MdOutlineModeEditOutline className="mb-1" />
                                                    &nbsp;
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-between">
                                            {interval.end_date && interval.end_date !== "NA" ? dateFormetter(interval.end_date) : "NA"}
                                                <button 
                                                    className="btn btn-sm btn-outline-primary" 
                                                    onClick={() => {
                                                        setIsLogoutTimeEditModalOpen(true)
                                                        dateFormetterAlt(interval.end_date, interval.id)
                                                        endDateMaxValueCalculator(interval.start_date)
                                                        endDateMinValueCalculator(interval.start_date)
                                                    }}
                                                >
                                                    <MdOutlineModeEditOutline className="mb-1" />
                                                    &nbsp;
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            {interval.duration && interval.duration !== "NA" ? durationFormetter(interval.duration) : "NA"}
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td colSpan={5} className='text-center'>
                                    No Data Available
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            {isLoginTimeEditModalOpen &&
                <TimeEditModal 
                    setIsTimeEditModalOpen={setIsLoginTimeEditModalOpen} 
                    timeAndDateValue={timeAndDateValue}
                    timeAndDateId={timeAndDateId}
                    timeAndDateMinValue={timeAndDateValue}
                    clockTimeApi={updateTimeApi}
                />
                }
            {isLogoutTimeEditModalOpen &&
                <TimeEditModal 
                    setIsTimeEditModalOpen={setIsLogoutTimeEditModalOpen} 
                    timeAndDateValue={timeAndDateValue}
                    timeAndDateId={timeAndDateId}
                    timeAndDateMinValue={timeAndDateMinValue}
                    timeAndDateMaxValue={timeAndDateMaxValue}
                    clockTimeApi={endTimeApi}
                />
            }
        </div>
    )
}

export default Dashboard
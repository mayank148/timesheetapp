import React, { useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr'
import DateTimePicker from 'react-datetime-picker';
import momentTz from 'moment-timezone';
import moment from 'moment/moment';
import './TimeEditModal.css';

function TimeEditModal({ setIsTimeEditModalOpen, clockTimeApi, timeAndDateValue, timeAndDateId, timeAndDateMinValue, timeAndDateMaxValue }) {
    const [newTimeAndDate, setNewTimeAndDate] = useState();

    
    const utcDateFormetter = ( time ) => {
        var dateObj = new Date(time);
        var momentObj = moment(dateObj);

        return momentObj
    }

    useEffect(() => {
        if(timeAndDateMaxValue){
            setNewTimeAndDate(new Date(timeAndDateMaxValue));
        }else {
            setNewTimeAndDate(new Date(timeAndDateValue));
        }
    }, [timeAndDateValue, timeAndDateMaxValue]);
    

    // console.log('timeAndDateValue :', timeAndDateValue)
    // console.log('new Date(timeAndDateValue) :', new Date(timeAndDateValue))
    // console.log('newTimeAndDate :', newTimeAndDate)
    // console.log('timeAndDateMaxValue :', timeAndDateMaxValue)
    console.log('timeAndDateId :', timeAndDateId)
    console.log('newTimeAndDate :', newTimeAndDate)
    return (
        <div className='time-edit-modal-wrapper d-flex justify-content-center align-items-center position-fixed'>
            <div className="time-edit-modal d-flex flex-column justify-content-between align-items-center p-4">
                <div className="time-edit-modal-header d-flex justify-content-between align-items-start w-100">
                    <div className="d-flex flex-column align-items-start">
                        <h3 className="m-0">Edit time and date</h3>
                    </div>
                    <div 
                        className="time-edit-modal-close-btn cursor-pointer" 
                        onClick={() => {setIsTimeEditModalOpen(false)}}
                    >
                        <GrClose size={28}/>
                    </div>
                </div>
                <div className="modal-body noselect w-100 pt-5 pb-4">
                    <div className="d-flex justify-content-start align-items-center mb-3">
                        <h4 className="">Enter new time :</h4>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <DateTimePicker 
                            value={newTimeAndDate} 
                            onChange={(date) => setNewTimeAndDate(date)} 
                            minDate={timeAndDateMinValue && new Date(timeAndDateMinValue)}
                            maxDate={timeAndDateMaxValue && new Date(timeAndDateMaxValue)}
                        />
                    </div>
                    <div className="d-flex justify-content-center align-items-center pt-3">
                        <button 
                            className="btn btn-primary "
                            onClick={() => {clockTimeApi(newTimeAndDate, timeAndDateId)}}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimeEditModal
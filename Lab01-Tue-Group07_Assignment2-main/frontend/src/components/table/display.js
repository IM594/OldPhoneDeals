import React, { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import service from "../../utils/request";

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export const CellDisplay = ({ phoneId, hidden, reviewId }) => {

    const [checked, setChecked] = useState(false);

    const isOpen = (v)=>{
        return v ==='true'
    }


    const onChangeDisplay = (ev) => {
        let current = ev.target.checked;
        let last = checked;
        ev.stopPropagation()
        const data = { phoneId: phoneId, reviewId }
        data.disabled = current ? 'true' : 'false'
        service.put('/api/phones/enableOrDisablePhone', data)
            .then((resp) => {
                console.log('resp', resp.data);
                setChecked(current)
            })
            .catch(e => {
                setChecked(last)
                console.log('change error', e);
                alert(e.message || 'change display fail')
            })
    }

    useEffect(() => {
        setChecked(isOpen(hidden))
    }, [phoneId,hidden])


    return (
        <Switch className='display-switch' 
        checked={checked} 
        inputProps={{ 'aria-label': 'controlled' }}
        onChange={(v) => onChangeDisplay(v)} />
    )
}
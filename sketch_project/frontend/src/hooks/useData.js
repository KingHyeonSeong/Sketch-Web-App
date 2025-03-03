// This is subscribe APIs.
import {useEffect, useRef, useState} from 'react';
import LS2Request from '@enact/webos/LS2Request';

var webOSBridge = new LS2Request();

// example:
//  luna://com.webos.memorymanager/getProcStat '{"subscribe":true}'

export const useProcStat = () => {
   const [value, setValue] = useState({ returnValue: false });
   var parms = {
      "subscribe": true
   }

   return [
      value,
      event => {
         var lsRequest = {
            "service": "luna://com.webos.memorymanager",
            "method": "getProcStat",
            "parameters": parms,
            "onSuccess": res => {
               setValue(res);
            },
            "onFailure": res => {
               setValue("error" + JSON.stringify(res));
            }
         };
         webOSBridge.send(lsRequest);
      }]
}



export const useUnitList = () => {
   const [value, setValue] = useState({ returnValue: false });
   var parms = {
      "subscribe": true
   }

   return [
      value,
      event => {
         var lsRequest = {
            "service": "luna://com.webos.memorymanager",
            "method": "getUnitList",
            "parameters": parms,
            "onSuccess": res => {
               setValue(res);
            },
            "onFailure": res => {
               setValue("error" + JSON.stringify(res));
            }
         };
         webOSBridge.send(lsRequest);
      }]
}
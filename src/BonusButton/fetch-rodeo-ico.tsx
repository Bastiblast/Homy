import React from 'react'
import {GM} from '$'

export default async function fetchRodeoIco() {
fetch("https://rodeo-dub.amazon.com/resources/images/rodeo-favicon.gif", {
  "headers": {
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
  },
  "referrer": "https://rodeo-dub.amazon.com/MRS1/ExSD?yAxis=WORK_POOL&zAxis=PROCESS_PATH&shipmentTypes=CUSTOMER_SHIPMENTS&exSDRange.quickRange=TODAY&exSDRange.dailyStart=00%3A00&exSDRange.dailyEnd=00%3A00&giftOption=ALL&fulfillmentServiceClass=ALL&fracs=NON_FRACS&isEulerExSDMiss=ALL&isEulerPromiseMiss=ALL&isEulerUpgraded=ALL&isReactiveTransfer=ALL&workPool=PredictedCharge&workPool=PlannedShipment&_workPool=on&workPool=ReadyToPick&workPool=ReadyToPickHardCapped&workPool=ReadyToPickUnconstrained&workPool=PickingNotYetPicked&workPool=PickingNotYetPickedPrioritized&workPool=PickingNotYetPickedNotPrioritized&workPool=PickingNotYetPickedHardCapped&workPool=CrossdockNotYetPicked&_workPool=on&workPool=PickingPicked&workPool=PickingPickedInProgress&workPool=PickingPickedInTransit&workPool=PickingPickedRouting&workPool=PickingPickedAtDestination&workPool=Inducted&workPool=RebinBuffered&workPool=Sorted&workPool=GiftWrap&workPool=Packing&workPool=Scanned&workPool=ProblemSolving&workPool=ProcessPartial&workPool=SoftwareException&workPool=Crossdock&workPool=PreSort&workPool=TransshipSorted&workPool=Palletized&_workPool=on&workPool=ManifestPending&workPool=ManifestPendingVerification&workPool=Manifested&workPool=Loaded&workPool=TransshipManifested&_workPool=on&processPath=&minPickPriority=MIN_PRIORITY&shipMethod=&shipOption=&sortCode=&fnSku=",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});
    const ico = await GM.xmlHttpRequest({
        method: 'GET',
        url: "https://rodeo-dub.amazon.com/resources/images/rodeo-favicon.gif",
        headers: {
            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
    })

    return ico
}

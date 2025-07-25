import {GM} from '$'

interface plan {         
    "fc": string,
        "sent_timestamp": string,
        "refresh_timestamp": string,
        "hour": number,
        "row": string,
        "rootcause": string,
        "category": string,
        "ops_feedback": string,
        "plan_type": string,
        "plan_promoted": string,
        "plan_length": number
    }
type planList = plan[]

export default async function fetchPlanList (): Promise<typeof planListTemplate> {

    const date = new Date(Date.now())
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1).toString()).slice(-2)
    const day = ('0' + date.getDate().toString()).slice(-2)
    const formatedDate = `${year}-${month}-${day}`

    const URL = `https://ecft.fulfillment.a2z.com/api/nssp/get_nssp_big_table_new?dashboard=true&fcSelected=MRS1&region=EU&startDate=${formatedDate}&startTime=00%3A00%3A01`

    const query = await GM.xmlHttpRequest({
        method: 'GET',
        url: URL
    }).then(response => response.responseText)

    try {
        const json: planList = JSON.parse(query)
        const dataValidation = typeof json === typeof planListTemplate
        if (dataValidation) {
           // console.log("data receive accepted",dataValidation)
            return json
        } else {
            throw new Error("fetchPlanList receive wrong datas.")
        }
    } catch(error) {
        //console.error("fetchPlanList get wrong data...")
    }
}

const planListTemplate = [
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T00:51:23.000Z",
        "refresh_timestamp": "2025-07-23T00:49:45.000Z",
        "hour": 0,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "00:51",
        "plan_length": 40
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T01:14:16.000Z",
        "refresh_timestamp": "2025-07-23T01:11:08.000Z",
        "hour": 1,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "01:14",
        "plan_length": 20
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T02:16:06.000Z",
        "refresh_timestamp": "2025-07-23T01:55:50.000Z",
        "hour": 2,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "02:16",
        "plan_length": 50
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T06:06:32.000Z",
        "refresh_timestamp": "2025-07-23T05:56:44.000Z",
        "hour": 6,
        "row": "1",
        "rootcause": "   Plan with short term risk          ",
        "category": "Red",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "06:06",
        "plan_length": 185
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T07:30:15.000Z",
        "refresh_timestamp": "2025-07-23T07:27:05.000Z",
        "hour": 7,
        "row": "1",
        "rootcause": "   Plan with short term risk          ",
        "category": "Red",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "07:30",
        "plan_length": 110
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T08:20:05.000Z",
        "refresh_timestamp": "2025-07-23T08:17:17.000Z",
        "hour": 8,
        "row": "1",
        "rootcause": "   Plan with short term risk          ",
        "category": "Red",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "08:20",
        "plan_length": 60
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T09:41:17.000Z",
        "refresh_timestamp": "2025-07-23T09:37:26.000Z",
        "hour": 9,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "09:41",
        "plan_length": 215
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T09:59:34.000Z",
        "refresh_timestamp": "2025-07-23T09:57:01.000Z",
        "hour": 9,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "09:59",
        "plan_length": 205
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T10:49:07.000Z",
        "refresh_timestamp": "2025-07-23T10:46:41.000Z",
        "hour": 10,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "10:49",
        "plan_length": 155
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T11:35:30.000Z",
        "refresh_timestamp": "2025-07-23T11:33:34.000Z",
        "hour": 11,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "11:35",
        "plan_length": 105
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T12:21:52.000Z",
        "refresh_timestamp": "2025-07-23T12:19:54.000Z",
        "hour": 12,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "12:21",
        "plan_length": 60
    },
    {
        "fc": "MRS1",
        "sent_timestamp": "2025-07-23T13:23:02.000Z",
        "refresh_timestamp": "2025-07-23T13:20:08.000Z",
        "hour": 13,
        "row": "1",
        "rootcause": "             ",
        "category": "Green",
        "ops_feedback": "Promoted",
        "plan_type": "PLAN 1",
        "plan_promoted": "13:23",
        "plan_length": 210
    }
]
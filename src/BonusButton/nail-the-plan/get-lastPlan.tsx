import fetchPlanList from './fetch-planList'
import fetchThePlan from './fetch-thePlan'

export default async function getLastPlan(): Promise<typeof lastPlanTemplate> {

    const list = await fetchPlanList()
    const lastSentStamp = list.splice(-1)[0]['sent_timestamp']
    const lastPlan = await fetchThePlan(lastSentStamp)

 
    return lastPlan
}

const lastPlanTemplate = [
    {
        "id": 1014869997,
        "login": "MRS1 user",
        "sent_timestamp": "2025-07-23T13:49:31.000Z",
        "pack_station": "G1: MultiMerge",
        "planned_hc": 7,
        "actual_wip": 1798,
        "actual_wip_eoq": 1601.63499999297,
        "target_buffer": 1600,
        "actual_wip_sorted": 904,
        "actual_wip_eoq_sorted": 937.540000001201,
        "target_buffer_sorted": 1000,
        "max_ce_risk": 16281.5451410439,
        "cpt_max_ce_risk": "2025-07-23T23:30:00.000Z",
        "fc": "MRS1",
        "plan_type": "PLAN 1",
        "buffer_date": "2025-07-23T17:05:00.000Z",
        "last_update_date": "2025-07-23T12:01:22.997Z",
        "dw_create_date": "2025-07-23T12:01:22.997Z",
        "dw_update_date": "2025-07-23T12:01:22.997Z",
        "pick_tur": 1589.58,
        "wrangle_tur": 0,
        "rebin_tur": 1650,
        "pack_tur": 1639.68
    },
    {
        "id": 1014870025,
        "login": "MRS1 user",
        "sent_timestamp": "2025-07-23T13:49:31.000Z",
        "pack_station": "G2: MultiWrap",
        "planned_hc": 0.5,
        "actual_wip": 0,
        "actual_wip_eoq": 40.0389147286822,
        "target_buffer": 0,
        "actual_wip_sorted": 0,
        "actual_wip_eoq_sorted": 0,
        "target_buffer_sorted": 0,
        "max_ce_risk": 283.371492806014,
        "cpt_max_ce_risk": "2025-07-23T23:30:00.000Z",
        "fc": "MRS1",
        "plan_type": "PLAN 1",
        "buffer_date": "2025-07-23T17:05:00.000Z",
        "last_update_date": "2025-07-23T12:01:22.997Z",
        "dw_create_date": "2025-07-23T12:01:22.997Z",
        "dw_update_date": "2025-07-23T12:01:22.997Z",
        "pick_tur": 75,
        "wrangle_tur": 0,
        "rebin_tur": 0,
        "pack_tur": 75
    },
    {
        "id": 1014870053,
        "login": "MRS1 user",
        "sent_timestamp": "2025-07-23T13:49:31.000Z",
        "pack_station": "G4: SingleMedium",
        "planned_hc": 12,
        "actual_wip": 1407,
        "actual_wip_eoq": 1118.36749998966,
        "target_buffer": 1200,
        "actual_wip_sorted": 0,
        "actual_wip_eoq_sorted": 0,
        "target_buffer_sorted": 0,
        "max_ce_risk": 15173.0507196436,
        "cpt_max_ce_risk": "2025-07-23T23:30:00.000Z",
        "fc": "MRS1",
        "plan_type": "PLAN 1",
        "buffer_date": "2025-07-23T17:05:00.000Z",
        "last_update_date": "2025-07-23T12:01:22.997Z",
        "dw_create_date": "2025-07-23T12:01:22.997Z",
        "dw_update_date": "2025-07-23T12:01:22.997Z",
        "pick_tur": 1933.07,
        "wrangle_tur": 0,
        "rebin_tur": 0,
        "pack_tur": 2021.88
    },
    {
        "id": 1014870081,
        "login": "MRS1 user",
        "sent_timestamp": "2025-07-23T13:49:31.000Z",
        "pack_station": "G5: MCF",
        "planned_hc": 1,
        "actual_wip": 0,
        "actual_wip_eoq": 11,
        "target_buffer": 0,
        "actual_wip_sorted": 0,
        "actual_wip_eoq_sorted": 0,
        "target_buffer_sorted": 0,
        "max_ce_risk": 503.847235322331,
        "cpt_max_ce_risk": "2025-07-23T23:30:00.000Z",
        "fc": "MRS1",
        "plan_type": "PLAN 1",
        "buffer_date": "2025-07-23T17:05:00.000Z",
        "last_update_date": "2025-07-23T12:01:22.997Z",
        "dw_create_date": "2025-07-23T12:01:22.997Z",
        "dw_update_date": "2025-07-23T12:01:22.997Z",
        "pick_tur": 150,
        "wrangle_tur": 0,
        "rebin_tur": 0,
        "pack_tur": 150
    }
]
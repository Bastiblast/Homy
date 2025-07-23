import fetchPlanList from './fetch-planList'
import fetchThePlan from './fetch-thePlan'
import getLastPlan from './get-lastPlan'

export async function getLastPlanSingle(): Promise<typeof singlePlanTemplate> {

    const lastPlan = await getLastPlan()
    const singlePlan = lastPlan.filter(process => process['pack_station'] ==="G4: SingleMedium")
    return singlePlan
}

export const singlePlanTemplate = [
    {
        "id": 1014994743,
        "login": "MRS1 user",
        "sent_timestamp": "2025-07-23T14:32:08.000Z",
        "pack_station": "G4: SingleMedium",
        "planned_hc": 12,
        "actual_wip": 1398,
        "actual_wip_eoq": 1973.36000000864,
        "target_buffer": 2072,
        "actual_wip_sorted": 0,
        "actual_wip_eoq_sorted": 0,
        "target_buffer_sorted": 0,
        "max_ce_risk": 16589.6991872078,
        "cpt_max_ce_risk": "2025-07-23T23:30:00.000Z",
        "fc": "MRS1",
        "plan_type": "PLAN 1",
        "buffer_date": "2025-07-23T17:05:00.000Z",
        "last_update_date": "2025-07-23T12:45:57.844Z",
        "dw_create_date": "2025-07-23T12:45:57.844Z",
        "dw_update_date": "2025-07-23T12:45:57.844Z",
        "pick_tur": 2499.84,
        "wrangle_tur": 0,
        "rebin_tur": 0,
        "pack_tur": 2277.12
    }
]
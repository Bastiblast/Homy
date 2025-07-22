import {GM} from '$'

export default function searchOnRodeo (find: string) {

    const url = `https://rodeo-dub.amazon.com/MRS1/Search?_enabledColumns=on&enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&searchKey=${find}`
    GM.openInTab( url, false )
}
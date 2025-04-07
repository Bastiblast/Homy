/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
//// <reference types="vite-plugin-monkey/global" />

interface rodeoJsonElement {
    "Shipment ID": string,
    "FN SKU": string,
    "Title": string,
    "Expected Ship Date": Date,
    "Scannable ID": string,
    "Outer Scannable ID": string,
    "Condition": string,
    "Ship Method": string,
    "Ship Option": string,
    "Process Path": string,
    "Pick Priority": string,
    "Sort Code": string,
    "Demand ID": string,
    "Pick Batch ID": string,
    "Quantity": number,
    "Work Pool": string,
    "Dwell Time (hours)": number
}

type rodeoJsonList = rodeoJsonElement[]
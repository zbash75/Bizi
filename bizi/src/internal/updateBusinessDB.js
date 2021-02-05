// Tool used to push custom business data to amplify
// Only uncomment when doing this in Footer.js
import React from 'react'
import { API } from 'aws-amplify'
import * as mutations from '../graphql/mutations.js'
import data from '../internal/businessInfo.json';

async function updateDB(data) {
    for (var business in data) {
        const business_obj = {
            businessName: business,
            businessDescription: data[business]?.['Description'],
            initiatives: data[business]?.['Initiatives'],
            policyList: data[business]?.['Policies'],
            businessPhone: data[business]?.['Phone Number'],
            businessURL: data[business]?.['Website'],
            deliveryURL: data[business]?.['Delivery'],
            reservationURL: data[business]?.['Reservations'],
            address: data[business]?.['Address'],
            priceRange: data[business]?.['Price Range'],
            schedule: data[business]?.['Schedule'],
            imgPath: data[business]?.['Business Photo'],
            discounts: data[business]?.["Discounts"],
            approved: data[business]?.['Approved']
        };

        try {
            const newBusiness = await API.graphql({
                query: mutations.createBusiness,
                variables: {input: business_obj}
            });
            console.log(newBusiness);
        }
        catch(error) {
            console.log(error);
        }
        console.log(business_obj);
    }
}

export function InternalDBTool(props) {
    return (
        <button onClick={() => updateDB(data)}>
            Sync DB
        </button>
    );
}
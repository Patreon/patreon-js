const constants = {
    attributes: {
        amount_cents: 'amount_cents',
        total_historical_amount_cents: 'total_historical_amount_cents',
        declined_since: 'declined_since',
        created_at: 'created_at',
        pledge_cap_cents: 'pledge_cap_cents',
        patron_pays_fees: 'patron_pays_fees',
        unread_count: 'unread_count'
    },
    relationships: {
        patron: 'patron',
        reward: 'reward',
        creator: 'creator',
        address: 'address',
        card: 'card',
        pledge_vat_location: 'pledge_vat_location'
    }
}

export default {
    ...constants,
    default_attributes: [
        constants.attributes.amount_cents,
        constants.attributes.declined_since,
        constants.attributes.created_at,
        constants.attributes.pledge_cap_cents,
        constants.attributes.patron_pays_fees
    ],
    default_relationships: [
        constants.relationships.patron,
        constants.relationships.reward,
        constants.relationships.creator,
        constants.relationships.address,
        constants.relationships.pledge_vat_location
    ]
}

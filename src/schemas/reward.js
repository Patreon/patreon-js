const constants = {
    attributes: {
        amount_cents: 'amount_cents',
        user_limit: 'user_limit',
        remaining: 'remaining',
        description: 'description',
        requires_shipping: 'requires_shipping',
        created_at: 'created_at',
        url: 'url',
        patron_count: 'patron_count'
    },
    relationships: {
        creator: 'creator'
    }
}

export default {
    ...constants,
    default_attributes: [
        constants.attributes.amount_cents,
        constants.attributes.user_limit,
        constants.attributes.remaining,
        constants.attributes.description,
        constants.attributes.requires_shipping,
        constants.attributes.created_at,
        constants.attributes.url,
        constants.attributes.patron_count
    ],
    default_relationships: [
        constants.relationships.creator
    ]
}

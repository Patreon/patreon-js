const constants = {
    attributes: {
        amount_cents: 'amount_cents',
        title: 'title',
        description: 'description',
        created_at: 'created_at',
        reached_at: 'reached_at'
    },
    relationships: {
    }
}

export default {
    ...constants,
    default_attributes: [
        constants.attributes.amount_cents,
        constants.attributes.title,
        constants.attributes.description,
        constants.attributes.created_at,
        constants.attributes.reached_at
    ],
    default_relationships: [
    ]
}

const constants = {
    attributes: {
        summary: 'summary',
        creation_name: 'creation_name',
        pay_per_name: 'pay_per_name',
        one_liner: 'one_liner',
        main_video_embed: 'main_video_embed',
        main_video_url: 'main_video_url',
        image_small_url: 'image_small_url',
        image_url: 'image_url',
        thanks_video_url: 'thanks_video_url',
        thanks_embed: 'thanks_embed',
        thanks_msg: 'thanks_msg',
        is_monthly: 'is_monthly',
        is_nsfw: 'is_nsfw',
        is_charged_immediately: 'is_charged_immediately',
        is_charge_upfront_eligible: 'is_charge_upfront_eligible',
        is_plural: 'is_plural',
        created_at: 'created_at',
        published_at: 'published_at',
        pledge_url: 'pledge_url',
        pledge_sum: 'pledge_sum',
        patron_count: 'patron_count',
        creation_count: 'creation_count',
        outstanding_payment_amount_cents: 'outstanding_payment_amount_cents'
    },
    relationships: {
        rewards: 'rewards',
        creator: 'creator',
        goals: 'goals',
        pledges: 'pledges',
        current_user_pledge: 'current_user_pledge',
        post_aggregation: 'post_aggregation',
        categories: 'categories',
        preview_token: 'preview_token'
    }
}

export default {
    ...constants,
    default_attributes: [
        constants.attributes.summary,
        constants.attributes.creation_name,
        constants.attributes.pay_per_name,
        constants.attributes.one_liner,
        constants.attributes.main_video_embed,
        constants.attributes.main_video_url,
        constants.attributes.image_small_url,
        constants.attributes.image_url,
        constants.attributes.thanks_video_url,
        constants.attributes.thanks_embed,
        constants.attributes.thanks_msg,
        constants.attributes.is_monthly,
        constants.attributes.is_nsfw,
        constants.attributes.is_charged_immediately,
        constants.attributes.is_plural,
        constants.attributes.created_at,
        constants.attributes.published_at,
        constants.attributes.pledge_url,
        constants.attributes.pledge_sum,
        constants.attributes.patron_count,
        constants.attributes.creation_count,
        constants.attributes.outstanding_payment_amount_cents
    ],
    default_relationships: [
        constants.relationships.rewards,
        constants.relationships.creator,
        constants.relationships.goals
    ]
}

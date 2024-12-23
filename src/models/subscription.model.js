import mongoose , {Schema} from "mongoose"

const SubscriptionSchema = new Schema({
    subscriber : {
        type : Schema.Type,ObjectId,
        ref : "User"
    },
    channel : {
        type : Schema.Type.ObjectId,
        ref : "User"
    }
} ,{})

export const Subscription = mongoose.model("Subscription",SubscriptionSchema)
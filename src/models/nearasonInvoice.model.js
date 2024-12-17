import { Schema, model } from "mongoose";

const nearasoninvoiceSchema = new Schema({
    rrn: {
        type: String,
    },
    customer_name: {
        type: String,
    },
    Date: {
        type: String,
    },
    description: {
        type: String,
    },
    reference_id: {
        type: String,
    },
    amount: {
        type: String,
    },
    customer_mobile: {
        type: String,
    },
    STATUS: {
        type: String,
    },
}, { timestamps: true });

export default new model("nearasoninvoice", nearasoninvoiceSchema);
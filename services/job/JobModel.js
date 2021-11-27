const mongoose = require('mongoose')
const Currency ={
    VND: 'VND',
    USD: 'USD'
}

const JobPostStatus = {
    Pending: 'Pending',
    Posted: 'Posted'
}

const Job = mongoose.model("Job",
    new mongoose.Schema({
        title: {type: String, required: true},
        companyId: {type: mongoose.Schema.Types.ObjectId, ref: "Company"},
        createdByUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        yearOfExp: {type: Number},
        salary: {
            from: {type: Number},
            to: {type: Number},
            isNegotiable: {type: Boolean},
            currency: {type: String}
        },
        skills: {
            type: [{type: String}], default: []
        },
        workAddress:{type: String, required: true},
        jobDescription:{ type: String, required: true},
        status: {type: String, required: true, default: JobPostStatus.Pending}
    })
)


module.exports = {Job, JobPostStatus ,Currency}
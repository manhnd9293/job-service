const CompanySize = Object.freeze({
    ONE_TO_NINE: '1-to-9',
    TEN_TO_NINETY_NINE: '10-to-99',
    ONE_HUNDRED_TO_LESS_FIVE_HUNDRED: '100-to-499',
    FIVE_HUNDRED_TO_LESS_ONE_THOUSANDS: '500-to-999',
    ONE_THOUSANDS_TO_LESS_TWO_TS: '1000-to-1999',
    MORE_THAN_TWO_TS: 'more-than-2000',
})

const City = Object.freeze({
    Hanoi: 'Hanoi',
    HoChiMinh: 'HoChiMinh',
    DaNang: 'DaNang',
    Other: 'Other',
})

const Industry = Object.freeze({
    Software: 'Software',
    Finance: 'Finance',
    Automobile: 'Automobile',
    Media: 'Media',
    Electrical: 'Electrical',
    Other: 'Other',
})

module.exports =  {CompanySize, City, Industry};

const  a= {a: 1}
const  b= {b: 2}
console.log({...a, ...b})

function Activity(amount) {
    this.amount = amount;
}

Activity.prototype.setAmount = function (value){
    if(value <= 0) return false;
    this.amout = value;
    return true;
}

Activity.prototype.getAmount = function(){
    return this.amount;
}

function Payment(amount, receiver) {
    Activity.call(this, amount);
    this.receiver = receiver;


    Payment.prototype.getReceiver = function (){
        return this.receiver;
    }

    Payment.prototype.setReceiver = function (receiver){
        this.receiver = receiver;
    }

}

Payment.prototype = Object.create(Activity.prototype);

const payment = new Payment(100, 'Manh');
console.log({payment})
console.log(payment.getAmount())
console.log(Payment.prototype)


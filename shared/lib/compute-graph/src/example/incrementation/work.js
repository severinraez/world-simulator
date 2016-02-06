// Define how the data is processed at each node.
let incrementer = (input) => {
    return input + 1
}
let printer = (input) => {
    console.log(input)
}

module.exports = {
    incrementer: incrementer,
    printer: printer
}

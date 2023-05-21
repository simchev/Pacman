// BitsUtils

var BU = {
    // Check if number contains the value
    contains: function(bits, value) {
        return (bits & value) == value;
    }
}
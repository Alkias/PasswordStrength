jQuery.fn.testList = function (userConfig) {

    // Create an array to store the attribute values of
    // the jQuery stack items.
    var arrValues = new Array();

    // Check to see if we were given a delimiter.
    // By default, we will use the comma.
    strDelimiter = (strDelimiter ? strDelimiter : ",");
    
    // Loop over each element in the jQuery stack and
    // add the given attribute to the value array.
    this.each(
        function (intI) {
            // Get a jQuery version of the current
            // stack element.
            var jNode = $(this);
            // Add the given attribute value to our
            // values array.
            arrValues[arrValues.length] = jNode.attr(
                strAttribute
            );
        }
    );
    // Return the value list by joining the array.
    return (
        arrValues.join(strDelimiter)
    );
}
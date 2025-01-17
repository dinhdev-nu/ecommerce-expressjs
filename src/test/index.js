const { pick } = require("lodash")

const a = {
    b: 1,
    c: 2,
    d: null,
    m: 1,
    e: undefined,
    o: {
        f: 3,
        g: null,
        h: undefined,
        i: {
            j: 4,
            k: null,
            l: undefined
        }
    }
}

const removeEmptyValuesForPayload = payload => {
    const result = {}
    Object.keys(payload).forEach(key => {
        if(payload[key] !== null && payload[key] !== undefined){
            if(typeof payload[key] === "object" && !Array.isArray(payload[key])){
                result[key] = removeEmptyValuesForPayload(payload[key])
            }
            else result[key] = payload[key]
        }
    })
    
    return result
}


const flattenNestedObject = (payload, result = {}, parentKey = null) => {
    Object.keys(payload).forEach((key) => {
        const newKey = parentKey ? `${parentKey}.${key}` : key
        if(payload[key] !== null && payload[key] !== undefined){
            if(typeof payload[key] === "object" && !Array.isArray(payload[key])){
                flattenNestedObject(payload[key], result , newKey)
            }
            else result[newKey] = payload[key]
        }
    })
    return result
}

console.log(Object.keys([1,2,3,4,5,6,7,8,9,0]))
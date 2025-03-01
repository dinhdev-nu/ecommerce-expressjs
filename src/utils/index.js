'use strict'

const _ = require('lodash')

const getInforData = (data, infor = [] ) => {
    return _.pick(data, infor)
}
const getUnSelect = (unSelect) => {
    return unSelect.map( item => `-${item}`).join(" ")
}

const getSelect = select => {
    return select.join(" ")
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

const joinArraysByIdByMap = (arr1, key1, arr2, key2) => {
    const map = new Map(arr2.map(item => [item[key2], item]))
    return arr1.map(item => {
        return {
            ...item,
            ...(map.get(item[key1]) || {})
        }   
    })
}
const joinArraysByIdByLodash = (arr1, key1, arr2, key2) => {
    const map = _.keyBy(arr2, key2)
    return arr1.map(item => {
        return {
            ...item,
            ...(map[item[key1]] || {})
        }
    })
}

module.exports = {
    getInforData,
    getUnSelect,
    getSelect,
    removeEmptyValuesForPayload,
    flattenNestedObject,
    joinArraysByIdByMap,
    joinArraysByIdByLodash
}
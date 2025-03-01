const a = [
    {
        id: 1,
        name: 'a',
    },
    {
        id:2,
        name: 'b'
    }
]
const b = [
    {
        idb: 1,
        age: 'a',
    },
    {
        idb:2,
        age: 'b'
    }
]


const mapB = new Map(b.map(item => [item.idb, item]))
console.log("Map:: ", mapB)
const c = a.map((item) => {
    return {
        ...item,
        ...(mapB.get(item.id) || {}) 
    }
})

console.log("C:: ", c)
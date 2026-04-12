import React from 'react'
import Card from '../ui/Card'


const data = [
    {
        id: 1,
        image: "https://images.pexels.com/photos/6433235/pexels-photo-6433235.jpeg?_gl=1*1ouam6b*_ga*MTQzMjI1MjAxMy4xNzY2MzI1MTA3*_ga_8JE65Q40S6*czE3NzU5MzAzNjAkbzckZzEkdDE3NzU5MzA0MjMkajU3JGwwJGgw",
        title: "Nike Air Max 270",
        category: "Men's Shoes",
        price: "$150",
        color: [ "#000000", "#FFFFFF", "#808080" ]
    },
    {
        id: 2,
        image: "https://images.pexels.com/photos/13524876/pexels-photo-13524876.jpeg?_gl=1*8ncwd7*_ga*MTQzMjI1MjAxMy4xNzY2MzI1MTA3*_ga_8JE65Q40S6*czE3NzU5MzAzNjAkbzckZzEkdDE3NzU5MzAzODYkajM0JGwwJGgw",
        title: "Adidas Ultraboost 21",
        category: "Men's Shoes",
        price: "$180",
        color: [ "#000000", "#FFFFFF", "#808080" ]
        
    },
]

function DayCollections() {
  return (
    <div className='container mx-auto grid grid-cols-3 gap-4'>
        {data.map((item) => (
            <Card
                key={item.id}
                data={item}
            />
        ))}
    </div>
  )
}

export default DayCollections
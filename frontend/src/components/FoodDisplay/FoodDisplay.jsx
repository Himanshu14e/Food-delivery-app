import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import './FoodDisplay.css'

const FoodDisplay = ({category}) => {

    const {food_list, searchTerm} = useContext(StoreContext)

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredFoods = food_list.filter((item) => {
      const matchesCategory = category === "All" || category === item.category;
      const matchesSearch = normalizedSearch === "" ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });

  return (
    <div className='food-display' id='food-display'>
       <h3>Top Dishes near you</h3>
       <div className="food-display-list">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="no-results">No dishes match your search.</p>
        )}
       </div>
    </div>
  )
}

export default FoodDisplay

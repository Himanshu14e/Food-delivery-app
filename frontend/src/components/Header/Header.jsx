import { useNavigate } from "react-router-dom";
import './Header.css'

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Fresh Food Delivered to Your Doorstep</h2>
            <p>Discover delicious meals from your favorite restaurants with lightning-fast delivery and exclusive discounts.</p>
            <button onClick={() => navigate("/explore-menu")}>
    View Menu
</button>
        </div>
    </div>
  )
}

export default Header
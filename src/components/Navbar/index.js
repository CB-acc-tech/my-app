import Cookies from 'js-cookie'

import {Link, useNavigate} from 'react-router-dom'

import './index.css'

const Navbar = () => {
  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')

    navigate('/login', {replace: true})
  }

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="brand-link"
        aria-label="Go to dashboard home"
      >
        Go Business
      </Link>

      <div className="nav-links-container">
        <button type="button" className="try-button">
            Try for free
        </button>

        <button
          type="button"
          className="logout-button"
          onClick={onClickLogout}
        >
          Log out
        </button>
      </div>
    </nav>
  )
}

export default Navbar
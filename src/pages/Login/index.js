import {useState} from 'react'

import Cookies from 'js-cookie'

import {Navigate, useNavigate} from 'react-router-dom'

import './index.css'

const loginApiUrl =
  'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [errorMsg, setErrorMsg] = useState('')

  const onSubmitForm = async event => {
    event.preventDefault()

    const userDetails = {
      email,
      password,
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginApiUrl, options)

    const responseData = await response.json()

    if (response.ok) {
      const jwtToken = responseData.data.token

      Cookies.set('jwt_token', jwtToken)

      navigate('/', {replace: true})
    } else {
      setErrorMsg(responseData.message)
    }
  }

  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="login-bg-container">
      <div className="login-card">
        <h1 className="login-brand-name">
          Go Business
        </h1>

        <p className="login-tagline">
          Sign in to open your referral dashboard.
        </p>

        <form
          className="login-form"
          onSubmit={onSubmitForm}
        >
          <div className="input-container">
            <label
              htmlFor="email"
              className="input-label"
            >
              Email
            </label>

            <input
              id="email"
              type="text"
              placeholder="you@example.com"
              className="input-field"
              value={email}
              onChange={event =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div className="input-container">
            <label
              htmlFor="password"
              className="input-label"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="********"
              className="input-field"
              value={password}
              onChange={event =>
                setPassword(event.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Sign in
          </button>

          {errorMsg !== '' && (
            <p className="error-message">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
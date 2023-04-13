import React, { useState, useEffect } from 'react'
import {
  Link,
  useFetcher,
  useParams,
  useLocation,
  Navigate,
} from 'react-router-dom'

import axios from 'axios'

import useFetch from 'hooks/useFetch'
import useLocalStorage from 'hooks/useLocalStorage'

const Authentication = (props) => {
  const location = useLocation()
  const params = useParams()
  const isLogin = location.pathname === '/login' // math.path проблема в коде ?
  const pageTitle = isLogin ? 'Sign In' : 'Sign Up'
  const descriptionLink = isLogin ? '/register' : '/login'
  const descriptionText = isLogin ? 'need an account?' : 'Have an account?'
  const apiUrl = isLogin ? '/users/login' : '/users' //не работает из за isLogin
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSuccessfullSubmit, setIsSuccessfullSubmit] = useState(false)
  const [{ response, isLoading, error }, doFetch] = useFetch(apiUrl)
  const [token, setToken] = useLocalStorage('token')

  console.log('token', token)

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('data', email, password)
    const user = isLogin ? { email, password } : { email, password, username }
    doFetch({
      method: 'post',
      data: {
        user,
      },
    })
  }
  useEffect(() => {
    if (!response) {
      return
    }
    setToken(response.user.token)
    setIsSuccessfullSubmit(true)
  }, [response])

  if (isSuccessfullSubmit) {
    return <Navigate to="/" />
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">{pageTitle}</h1>
            <p className="text-xs-center">
              <Link to={descriptionLink}>{descriptionText}</Link>
            </p>

            <form onSubmit={handleSubmit}>
              <fieldset>
                {!isLogin && (
                  <fieldset className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </fieldset>
                )}
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={isLoading}
                >
                  {pageTitle}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authentication

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../../../services/authService"
import styles from "./Register.module.css"

function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const card = document.querySelector(`.${styles.card}`)
    if (card) {
      card.classList.add(styles.showCard)
    }
  }, [])

  useEffect(() => {
    if (showPassword) {
      const timer = setTimeout(() => {
        setShowPassword(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await register(username, password)

    if (response.msg.includes("sucesso")) {
      setSuccess(true)
      setMessage(response.msg)
      setTimeout(() => {
        navigate("/acesso")
      }, 3000)
    } else {
      setMessage(response.msg)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  return (
    <div className={`${styles.gradiente} d-flex justify-content-center align-items-center vh-100`}>
      <div className={`${styles.card} col-4 card p-4 shadow`}>
        <h2 className="text-center mb-4">Registre-se Aqui</h2>
        {message && (
          <div className={success ? "alert alert-success text-center" : "alert alert-danger text-center"}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 form-floating">
            <input
              id="floatingEmail"
              type="email"
              placeholder="Email"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="email"
            />
            <label htmlFor="floatingEmail">Email</label>
          </div>
          <div className="mb-3">
            <div className="input-group form-floating">
              <input
                id="floatingPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="passwordHelpInline"
                autoComplete="new-password"
              />
              <label htmlFor="floatingPassword">Senha</label>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {showPassword && (
              <small className="text-muted d-block mt-1">A senha será ocultada automaticamente em 3 segundos</small>
            )}
            <span id="passwordHelpInLine" className="form-text">
              <ul className="text-muted small mt-2 p-1 pt-3">
                <li>• A senha deve ter pelo menos 8 caracteres.</li>
                <li>• Incluir letras maiúsculas e minúsculas.</li>
                <li>• Ter ao menos um número.</li>
                <li>• Incluir um caractere especial (!, @, #, etc).</li>
              </ul>
            </span>
          </div>
          <button type="submit" className="btn btn-dark w-100">
            Registrar
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
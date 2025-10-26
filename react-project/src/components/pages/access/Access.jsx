"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../../../services/authService"
import styles from "./Access.module.css"

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Access() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
    const response = await login(username, password)

    if (response.token) {
      toast.success(response.msg || "Login realizado com sucesso!")
      setTimeout(() => {
        navigate("/inicio")
      }, 3000)
    } else {
      toast.error(response.msg || "Erro ao efetuar login. Verifique suas credenciais.")
    }
  }

  return (
    <div className={`${styles.gradiente} d-flex justify-content-center align-items-center vh-100`}>
      <div className={`${styles.card} col-4 card p-4 shadow`}>
        <h2 className="text-center mb-4">Acesse já</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 form-floating">
            <input
              id="floatingEmail"
              type="email"
              placeholder="Email"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
                autoComplete="current-password"
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
            {showPassword && <small className="text-muted">A senha será ocultada automaticamente em 3 segundos</small>}
          </div>
          <button type="submit" className="btn btn-dark w-100">
            Entrar
          </button>
        </form>

        <div className="mt-5">
          <p className="text-center">Ainda não tem uma conta?</p>
          <Link to="/registro" className="btn btn-danger w-100">
            Criar Conta
          </Link>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2400}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  )
}

export default Access
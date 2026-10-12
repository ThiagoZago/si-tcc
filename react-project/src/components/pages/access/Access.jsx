"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
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
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.brand}>
          <span className={styles.eyebrow}>
            <span className={styles.dash}></span>
            ÁREA DE ACESSO
          </span>
          <h2 className={styles.brandTitle}>
            Sua agenda,
            <br />
            <span className={styles.brandAccent}>sempre à mão.</span>
          </h2>
          <p className={styles.brandText}>
            Entre para gerenciar horários, serviços e atendimentos em um só lugar.
          </p>
        </aside>

        <div className={styles.formPanel}>
          <h2 className={styles.formTitle}>Acesse já</h2>
          <p className={styles.formSubtitle}>Entre com seu email e senha.</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="floatingEmail" className={styles.label}>Email</label>
              <input
                id="floatingEmail"
                type="email"
                placeholder="seu@email.com"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="floatingPassword" className={styles.label}>Senha</label>
              <div className={styles.passwordWrap}>
                <input
                  id="floatingPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className={`${styles.input} ${styles.inputPassword}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.toggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {showPassword && (
                <small className={styles.hint}>
                  A senha será ocultada automaticamente em 3 segundos
                </small>
              )}
            </div>

            <button type="submit" className={styles.submit}>
              Entrar <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </form>

          <div className={styles.registerBox}>
            <p className={styles.registerText}>Ainda não tem uma conta?</p>
            <Link to="/registro" className={styles.registerLink}>
              Criar conta
            </Link>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2400}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnHover
        draggable
      />
    </div>
  )
}

export default Access
"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
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
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.brand}>
          <span className={styles.eyebrow}>
            <span className={styles.dash}></span>
            CRIAR CONTA
          </span>
          <h2 className={styles.brandTitle}>
            Seu negócio,
            <br />
            <span className={styles.brandAccent}>mais organizado.</span>
          </h2>
          <p className={styles.brandText}>
            Cadastre-se em poucos minutos e deixe os agendamentos com a gente.
          </p>
        </aside>

        <div className={styles.formPanel}>
          <h2 className={styles.formTitle}>Registre-se aqui</h2>
          <p className={styles.formSubtitle}>Crie seu acesso com email e senha.</p>

          {message && (
            <div className={`${styles.alert} ${success ? styles.alertSuccess : styles.alertError}`}>
              {success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message}</span>
            </div>
          )}

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
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="floatingPassword" className={styles.label}>Senha</label>
              <div className={styles.passwordWrap}>
                <input
                  id="floatingPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha"
                  className={`${styles.input} ${styles.inputPassword}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="passwordHelpInline"
                  autoComplete="new-password"
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

              <div id="passwordHelpInline" className={styles.rules}>
                <p className={styles.rulesTitle}>Sua senha deve ter:</p>
                <ul>
                  <li>Pelo menos 8 caracteres</li>
                  <li>Letras maiúsculas e minúsculas</li>
                  <li>Ao menos um número</li>
                  <li>Um caractere especial (!, @, #, etc)</li>
                </ul>
              </div>
            </div>

            <button type="submit" className={styles.submit}>
              Registrar <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </form>

          <div className={styles.loginBox}>
            <p className={styles.loginText}>Já tem uma conta?</p>
            <Link to="/acesso" className={styles.loginLink}>
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
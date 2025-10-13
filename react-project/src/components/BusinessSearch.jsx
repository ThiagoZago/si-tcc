"use client"

import { useState, useEffect, useRef } from "react"
import axiosInstance from "../utils/axiosInterceptor"

function BusinessSearch({ onSelect }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const wrapperRef = useRef(null)
  const abortRef = useRef(null)
  const debounceRef = useRef(null)

  // fechar quando clicar fora
  useEffect(() => {
    const handleDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleDocClick)
    return () => document.removeEventListener("mousedown", handleDocClick)
  }, [])

  // buscar com debounce e cancelamento
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setError("")
      setLoading(false)
      setIsOpen(false)
      if (abortRef.current) {
        try {
          abortRef.current.abort()
        } catch (e) {}
        abortRef.current = null
      }
      if (debounceRef.current) clearTimeout(debounceRef.current)
      return
    }

    setLoading(true)
    setError("")
    setIsOpen(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      // cancelar requisição anterior
      if (abortRef.current) {
        try {
          abortRef.current.abort()
        } catch (e) {}
      }
      abortRef.current = new AbortController()

      try {
        const resp = await axiosInstance.get("/business/search", {
          params: { q: query },
          signal: abortRef.current.signal,
        })

        setResults(Array.isArray(resp.data) ? resp.data : [])
        setError("")
      } catch (err) {
        const isCanceled = err?.code === "ERR_CANCELED" || err?.name === "CanceledError" || err?.message === "canceled"
        if (!isCanceled) {
          console.error("Erro ao buscar locais:", err)
          setError("Erro ao buscar locais")
          setResults([])
        }
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSelect = (business) => {
    setQuery("") // limpa o campo após selecionar
    setResults([])
    setIsOpen(false)
    onSelect && onSelect(business)
  }

  return (
    <div className="position-relative" ref={wrapperRef}>
      <input
        type="text"
        className="form-control"
        placeholder="Digite o nome do local..."
        value={query}
        onChange={handleChange}
        onFocus={() => {
          if (query.length >= 2) setIsOpen(true)
        }}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="business-listbox"
        role="combobox"
      />

      {isOpen && (
        <div
          id="business-listbox"
          role="listbox"
          className="list-group position-absolute w-100 shadow-sm"
          style={{ zIndex: 2000 }}
        >
          {loading ? (
            <div className="list-group-item text-muted">Carregando...</div>
          ) : error ? (
            <div className="list-group-item text-danger">{error}</div>
          ) : results.length > 0 ? (
            results.map((b) => (
              <button
                type="button"
                key={b.id}
                className="list-group-item list-group-item-action text-start"
                onMouseDown={(e) => e.preventDefault()} // evitar blur antes do click
                onClick={() => handleSelect(b)}
              >
                <div className="fw-bold">{b.name}</div>
                <small className="text-muted">{b.address}</small>
              </button>
            ))
          ) : (
            <div className="list-group-item text-muted">Nenhum local encontrado</div>
          )}
        </div>
      )}
    </div>
  )
}

export default BusinessSearch
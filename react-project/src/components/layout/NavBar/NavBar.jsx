import styles from'./NavBar.module.css';
import logo from '../../../img/logo_barbearia_favicon_2-removebg-preview.png';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-transparent">
        <div className="container">
            <Link className="navbar-brand" to="/">
                <img className={styles.logoNavBar} src={logo} alt="BarbApp" width="40" />
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto text-end">
                    <li className="nav-item">
                        <Link className="nav-link" aria-current="page" to="/">Início</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="sobre-nos">Sobre Nós</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="ajuda">Ajuda</Link>
                    </li>

                    <li className="nav-item divisor"></li>

                    <li className="nav-item">
                        <Link className="nav-link" to="agendar">Agendar</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="acesso">Acesso</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}

export default NavBar;
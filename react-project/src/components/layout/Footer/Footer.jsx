import {Link} from 'react-router-dom';
import styles from './Footer.module.css'

import logo from '../../../img/logo_barbearia_favicon_2-removebg-preview.png';
import youtube from '../../../img/youtube.png';
import instagram from '../../../img/instagram.png';
import telegram from '../../../img/telegram.png';

function Footer(){
    return(
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                        <Link to="/">
                            <img className={styles.logoFooter} src={logo} alt="BarbApp" width="40" />
                        </Link>
                    </div>
                    <div className="col-md-2">
                    <h4>NOSSA EMPRESA</h4>
                        <ul className="navbar-nav">
                            <li><Link to="sobre-nos">Sobre</Link></li>
                            <li><Link to="novidades">Novidades</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-2">
                    <h4>Comunidade</h4>
                        <ul className="navbar-nav">
                            <li><Link to="desenvolvedores">Desenvolvedores</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-2">
                    <h4>Links Úteis</h4>
                        <ul className="navbar-nav">
                            <li><Link to="ajuda">Ajuda</Link></li>
                            <li><Link to="agendar">Agendar</Link></li>
                            <li><Link to="acesso">Acessar Conta</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <ul>
                            <li><a href="https://www.instagram.com"><img className={styles.midiaFooter} src={instagram} alt="Instagram" width="40"  /></a></li>
                            <li><a href="https://web.telegram.org"><img className={styles.midiaFooter} src={telegram} alt="Telegram X" width="40"  /></a></li>
                            <li><a href="https://youtube.com.br"><img className={styles.midiaFooter} src={youtube} alt="Youtube" width="40"  /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <small className="text-muted mt-5 d-flex justify-content-center">© 2025 - Todos os direitos reservados.</small>
        </footer>
    );
}

export default Footer;
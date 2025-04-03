import {Link} from 'react-router-dom';
import styles from './Footer.module.css'

import logo from '../../../img/barbearia.png';
import facebook from '../../../img/facebook.png';
import instagram from '../../../img/instagram.png';
import twitter from '../../../img/twitter-x.png';

function Footer(){
    return(
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                        <img className={styles.logoFooter} src={logo} alt="BarbApp" width="36" />
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
                            <li><a href="https://www.facebook.com/?locale=pt_BR"><img className={styles.midiaFooter} src={twitter} alt="Twitter X" width="40"  /></a></li>
                            <li><a href="https://x.com/?lang=pt"><img className={styles.midiaFooter} src={facebook} alt="Facebook" width="40"  /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <small className="text-muted mt-5 d-flex justify-content-center">© 2025 - Todos os direitos reservados.</small>
        </footer>
    );
}

export default Footer;
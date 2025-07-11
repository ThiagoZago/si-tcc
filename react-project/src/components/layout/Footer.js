import { Link } from 'react-router-dom';
import Container from './Container';
import logo from '../../img/barbearia.png';
import facebook from '../../img/facebook.png';
import instagram from '../../img/instagram.png';
import twitter from '../../img/twitter-x.png';
import styles from './Footer.module.css';

const footerSections = [
  {
    title: 'NOSSA EMPRESA',
    links: [
      { to: '/sobre-nos', label: 'Sobre' },
      { to: '/novidades', label: 'Novidades' }
    ]
  },
  {
    title: 'Comunidade',
    links: [
      { to: '/desenvolvedores', label: 'Desenvolvedores' }
    ]
  },
  {
    title: 'Links Úteis',
    links: [
      { to: '/ajuda', label: 'Ajuda' },
      { to: '/agendar', label: 'Agendar' },
      { to: '/acesso', label: 'Acessar Conta' }
    ]
  }
];

const socialLinks = [
  { href: 'https://www.instagram.com', src: instagram, alt: 'Instagram' },
  { href: 'https://x.com/?lang=pt', src: twitter, alt: 'Twitter X' },
  { href: 'https://www.facebook.com/?locale=pt_BR', src: facebook, alt: 'Facebook' }
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className="row">
          <div className="col-md-2">
            <img 
              className={styles.logo} 
              src={logo} 
              alt="BarbApp" 
              width="36" 
            />
          </div>
          
          {footerSections.map((section) => (
            <div key={section.title} className="col-md-2">
              <h4>{section.title}</h4>
              <ul className="navbar-nav">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="col-md-4">
            <ul className={styles.socialList}>
              {socialLinks.map((social) => (
                <li key={social.alt}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <img 
                      className={styles.socialIcon} 
                      src={social.src} 
                      alt={social.alt} 
                      width="40" 
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      
      <div className="text-center mt-4">
        <small className="text-muted">
          © 2025 - Todos os direitos reservados.
        </small>
      </div>
    </footer>
  );
}

export default Footer;
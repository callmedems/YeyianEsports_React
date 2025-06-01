import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="footer_brand">
          <img src="images/Arena Yeyian Logo.png" alt="Arena Yeyian Logo" className="footer_logo" />
        </div>
        <div className="footer_social">
          <a href="#" aria-label="Facebook"><img src="images/facebook_logo.png" alt="Facebook" /></a>
          <a href="#" aria-label="Instagram"><img src="images/instagram_logo.png" alt="Instagram" /></a>
          <a href="#" aria-label="X"><img src="images/x_logo.png" alt="X" /></a>
          <a href="#" aria-label="Twitch"><img src="images/twitch_logo.png" alt="Twitch" /></a>
          <a href="#" aria-label="YouTube"><img src="images/youtube_logoDOS.png" alt="YouTube" /></a>
        </div>
        <div className="footer_contact">
          <p>Horario: 9am - 9pm</p>
          <p>Tel: +52 XXX XXX XXXX</p>
          <p>Email: contacto@yeyianarena.com</p>
        </div>
      </div>
      <div className="footerCopyright">
        &copy; {new Date().getFullYear()} Arena Yeyian. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer
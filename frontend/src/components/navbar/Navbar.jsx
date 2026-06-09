import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar({ user, tema, alternarTema }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {!isOpen && (
        <button onClick={toggleMenu} className={styles.openbtn}>
          &#9776;
        </button>
      )}

      <div className={styles.navbar} style={{ width: isOpen ? "250px" : "0" }}>
        <button className={styles.closebtn} onClick={toggleMenu}>
          &times;
        </button>

        <Link to="/perfil" className={styles.link}>
          Meu Perfil
        </Link>
        <Link to="/dashboard" className={styles.link}>
          Dashboard
        </Link>
        <Link to="/sessoes" className={styles.link}>
          Registrar sessão
        </Link>
        <Link to="/metas" className={styles.link}>
          Metas
        </Link>
        <Link to="/estatisticas" className={styles.link}>
          Estatísticas
        </Link>
        <Link to="/recursos" className={styles.link}>
          Biblioteca
        </Link>
        <Link to="/ci" className={styles.link}>
          Comprehensible Input
        </Link>
        {user?.is_admin && (
          <Link to="/admin" className={styles.link}>
            ⚙️ Admin
          </Link>
        )}

        <div className={styles.userInfo}>
          {isOpen && (
            <>
              <button
                onClick={alternarTema}
                className={`${styles.botaoTema} ${tema === "escuro" ? styles.escuro : ""}`}
                title={tema === "escuro" ? "Modo claro" : "Modo escuro"}
              >
                <span className={styles.toggleLabel}>
                  {tema === "escuro" ? "☀️" : "🌙"}
                </span>
                <span className={styles.toggleTrack}>
                  <span className={styles.toggleThumb} />
                </span>
              </button>
              <span>{user?.nome}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;

import Navbar from "../navbar/Navbar";
import styles from './Layout.module.css';

function Layout({ children, user, tema, alternarTema }) {
    return (
        <div className={ styles.layout }>
            <Navbar user={user} tema={tema} alternarTema={alternarTema} />
            <main className={ styles.main }>
                { children }
            </main>
        </div>
    )
}

export default Layout;
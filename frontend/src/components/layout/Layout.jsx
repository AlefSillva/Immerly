import Navbar from "../navbar/Navbar";
import styles from './Layout.module.css';

function Layout({ children, user }) {
    return (
        <div className={ styles.layout }>
            <Navbar user={user} />
            <main>
                { children }
            </main>
        </div>
    )
}

export default Layout;
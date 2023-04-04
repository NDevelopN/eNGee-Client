import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/layout.module.css';
import utilStyles from '../styles/utils.module.css';

let name = "[Name Here]";
export const siteTitle = "eNGee Server";

// This creates the default layout for all pages of the app.
// For now, it only includes a header which links back to the homepage.
// TODO: change header to include player icon as well as their name.
export default function Layout({ children, home }) {
    return (
        <>
        <Head>{siteTitle}</Head>
        <header className={styles.header}>
            <>
            {/* This is the player icon, links back to homepage */}
            <Link href="/">
                <Image
                priority
                src="/images/logo.png"
                height={108}
                width={108}
                alt="Logo"
                />
            </Link>
            {/* This is the player name, links back to homepage */}
            <h2 className={utilStyles.headingLg }>
                <Link href="/" className={utilStyles.colorInherit}>
                    {name}
                </Link>
            </h2>
            </>

        </header>
        {/* Renders all children components */}
        <main>{children}</main>
        {/* Adds another link back to home */}
        {!home && (
            <div className={styles.backToHome}>
                <Link href="/">Backt to Home</Link>
            </div>
        )}
        </>
    );
}

export function updateName(newName) {
    name = newName;
}
import {useState, useEffect} from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/layout.module.css';
import utilStyles from '../styles/utils.module.css';


export const siteTitle = "eNGee Server";

// This creates the default layout for all pages of the app.
// For now, it only includes a header which links back to the homepage.
// TODO: change header to include player icon as well as their name.
export default function Layout({name, userChange, home, children}) {
    let [userName, setUserName] = useState("Username");

    useEffect(() => {
        setUserName(name)
    },[name])
    
    return (
        <>
        <Head>{siteTitle}</Head>
        <header className={styles.header} onClick={userChange} >
            <>
            {/* This is the player name, links to name change */}
            <h2 className={utilStyles.headingLg}><u>{userName}</u></h2>
            </>

        </header>
        {/* Renders all children components */}
        <main>{children}</main>
        </>
    );
}
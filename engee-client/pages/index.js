import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle, updateName } from '../components/layout'

import styles from '../styles/Home.module.css'

export default function Home({}) {


    return (
        <Layout home>
        <Head>
            <title>
                {siteTitle}
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </title>
        </Head>

        <main className={styles.main}> 
            <Link href="/lobby">Go to the Only Lobby</Link>
        </main>
        
        </Layout>
    );
}
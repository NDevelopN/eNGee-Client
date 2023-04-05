import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import Layout, { siteTitle, updateName } from '../components/layout'
import {SingleTextForm} from '../components/inputForms'
import { PlayerList } from '../components/listView';
import { BlockText } from '../components/outputTexts';

import styles from '../styles/Home.module.css'
import utilStyles from '../styles/utils.module.css'

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
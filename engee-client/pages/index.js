import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle } from '../components/layout'
import Date from '../components/date'

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

        <section className={utilStyles.headingMd}>
            <p>This is the sample text</p>
        </section>
        
        </Layout>
    );
}
import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Date from '../components/date';

export async function getStaticProps() {
  //Get all posts sorted
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

//TODO create layout for landing page
export default function Home({allPostsData}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      
    </Layout>
  );
}

import React from 'react'
import Head from 'next/head'

const Meta = ({ title, description, keywords, canonicalURL, robots, ogUrl, ogTitle, ogDescrition, twitterDescription, twitterTitle}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:site_name" content='teletype.su' />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content={robots} />
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={ogUrl}/>
        <meta property="og:image" content="https://teletype.su/images/opg1.jpg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
        <meta property="og:title" content={ogTitle}/>
        <meta property="og:description" content={ogDescrition}/>
        <meta name="twitter:card" content='summary'/>
        <meta name="twitter:title" content={twitterTitle}/>
        <meta name="twitter:description" content={twitterDescription}/>
        {/* <meta name="twitter:image" content={}/> */}
        <link rel="canonical" href={canonicalURL} />
      </Head>
    </>
  )
}

export default Meta
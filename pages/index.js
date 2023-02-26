import Head from 'next/head'
import { PostCard, Categories, PostWidget} from '../components'

const posts = [
  {title: 'Post 1', excerpt: 'Post 1 excerpt'},
  {title: 'Post 2', excerpt: 'Post 2 excerpt'},
  {title: 'Post 3', excerpt: 'Post 3 excerpt'},
  {title: 'Post 4', excerpt: 'Post 4 excerpt'},
  {title: 'Post 5', excerpt: 'Post 5 excerpt'},
]

const Home = () => {
  return (
    <div className="container mx-auto px-10 mb-8 p-10">
      <Head>
        <title>Programmers Life Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className='lg:col-span-8 col-span-1'>
        {posts.map((post, index) => <PostCard key={post.title} post={post} />)}
        </div>

        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PostWidget />
            <Categories />
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default Home

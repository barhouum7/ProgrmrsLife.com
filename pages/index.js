import { PostCard, Categories, PostWidget} from '../components'
import { getPosts } from '../services'
// import { Header } from '../sections';


export default function Home ({ posts }) {
  return (
    <>
      {/* <Header /> */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">
        <div className='lg:col-span-8 col-span-1'>
        {posts.map((post, index) => <PostCard key={post.node.title} post={post.node} />)}
        </div>
        <div className='lg:col-span-8 col-span-1'>
        {posts.map((post, index) => <PostCard key={post.node.title} post={post.node} />)}
        </div>

        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PostWidget />
            <Categories />
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return {
    props: {
      posts
    }
  }
}
import { PostCard, Categories, PostWidget} from '../components'
import { getPosts } from '../services'


export default function Home ({ posts }) {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">
        <div className='lg:col-span-8 col-span-1'>
        {posts.map((post, index) => (<PostCard key={post.node.title} post={post.node} />))}
        </div>

        <div className="lg:col-span-4 col-span-1 mr-4">
          <div className="lg:sticky relative top-0">
            <PostWidget />
            <Categories />
          </div>
        </div>
      </div>
  );
}

// Fetch data at build time
export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return {
    props: {
      posts
    }
  };
}
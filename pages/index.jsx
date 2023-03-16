import { PostCard, Categories, PostWidget, FeaturedPosts} from '../components/index'
import { getPosts } from '../services'


export default function Home ({ posts }) {
  return (
    <div>
    <FeaturedPosts />
      <div className='dark:bg-gray-800 container relative flex-grow rounded-t mx-auto transition ease-in-out duration-500'>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className='lg:col-span-8 col-span-1'>
              {/* {console.log(posts.length)} */}
              {posts.map((post, index) => {
                return (
                  <PostCard key={post.node.title} post={post.node} />
                )
              }
              )}
            </div>

          <div className="lg:col-span-4 col-span-1 mr-4">
            <div className="lg:sticky relative top-0">
              <PostWidget />
              <Categories />
            </div>
          </div>
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
import React, { useState, useEffect } from 'react';
import appwriteService from '../appwrite/config.js';
import { Container, PostCard } from "../components";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await appwriteService.getPosts();
        const rows = res?.rows ?? [];            // safe access
        if (!mounted) return;
        setPosts(rows);
      } catch (err) {
        console.error('Home getPosts error:', err);
        if (mounted) setPosts([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                No posts yet — login or add the first post
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
